import uuid
from fastapi import FastAPI, HTTPException, Depends, status
from typing import Annotated, Any, Dict, List
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict
import auth
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware
from auth import get_current_user

app = FastAPI()
app.include_router(auth.router)


origins = [
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LabResourceBase(BaseModel):
    name: str
    description: str
    creation_time: str
    last_modified_time: str
    class Config:
        extra = 'forbid'
        orm_mode = True

class Server(LabResourceBase):
    serial_number: str
    board_ip: str
    model: str
    os: str
    cores: str
    memory: str
    storage: str

class Switch(LabResourceBase):
    num_ports: int
    port_speed: int
    model: str
    vendor: str
    serial_number: str
    management_ip: str
    
class Rack(LabResourceBase):
    pass

class Lab(LabResourceBase):
    pass

class Datacenter(LabResourceBase):
    address: str

class VM(LabResourceBase):
    serialnumber: str
    boardip: str
    model: str
    os: str
    cores: str
    memory: str
    storage: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

models.Base.metadata.create_all(bind=engine)

@app.get("/", status_code=status.HTTP_200_OK)
async def user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    return {"User": user}

@app.get("/users/", status_code=status.HTTP_200_OK)
def get_all_users(db: db_dependency, user: user_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    users = db.query(models.User).all()
    return users


@app.post("/datacenters/", response_model=Datacenter)
def create_datacenter(datacenter: Datacenter, lab_ids: List[str], db: db_dependency, user: user_dependency):
    db_datacenter = models.Datacenter(**datacenter.model_dump(), id=str(uuid.uuid4()), owner=user.username)
    db.add(db_datacenter)

    for id in lab_ids:
        db_lab = db.query(models.Lab).filter(models.Lab.id == id).first()
        if db_lab:
            db_datacenter.labs.append(db_lab)

    db.commit()
    db.refresh(db_datacenter)
    return db_datacenter

@app.post("/labs/", response_model=Lab)
def create_lab(lab: Lab, rack_ids: List[str], db: db_dependency, user: user_dependency):
    db_lab = models.Lab(**lab.model_dump(), id=str(uuid.uuid4()), owner=user.username)
    db.add(db_lab)

    for id in rack_ids:
        db_rack = db.query(models.Rack).filter(models.Rack.id == id).first()
        if db_rack:
            db_lab.racks.append(db_rack)

    db.commit()
    db.refresh(db_lab)
    return db_lab


@app.post("/racks/", response_model=Rack)
def create_rack(rack: Rack, servers: List[str], switches: List[str], db: db_dependency, user: user_dependency):
    db_rack = models.Rack(**rack.model_dump(), id=str(uuid.uuid4()), owner=user.username)
    db.add(db_rack)
    
    # Assign server IDs to the rack
    for server in servers:
        db_server = db.query(models.Server).filter(models.Server.id == server).first()
        if db_server:
            db_rack.servers.append(db_server)  # append the server object, not the ID
    
    # Assign switch IDs to the rack
    for switch in switches:
        db_switch = db.query(models.Switch).filter(models.Switch.id == switch).first()
        if db_switch:
            db_rack.switches.append(db_switch)  # append the switch object, not the ID
    
    db.commit()
    db.refresh(db_rack)
    return db_rack


@app.post("/servers/", response_model=Server)
def create_server(server: Server, db: db_dependency, user: user_dependency):
    db_server = models.Server(**server.model_dump(), id=str(uuid.uuid4()), owner=user.username)
    db.add(db_server)
    db.commit()
    db.refresh(db_server)
    return db_server

@app.post("/switches/", response_model=Switch)
def create_switch(switch: Switch, db: db_dependency, user: user_dependency):
    db_switch = models.Switch(**switch.model_dump(), id=str(uuid.uuid4()), owner=user.username)
    db.add(db_switch)
    db.commit()
    db.refresh(db_switch)
    return db_switch

@app.post("/vms/")
def create_vm(vm: VM, db: db_dependency, user: user_dependency):
    db_vm = models.VM(**vm.model_dump(), id=str(uuid.uuid4()), owner=user.username)
    db.add(db_vm)
    db.commit()
    db.refresh(db_vm)
    return vm


@app.get("/datacenters/", response_model=List[Datacenter])
def get_all_datacenters(db: db_dependency, user: user_dependency):
    db_datacenters = db.query(models.Datacenter).filter(models.Datacenter.owner == user.username).all()
    return db_datacenters

@app.get("/labs/", response_model=List[Lab])
def get_all_labs(db: db_dependency, user: user_dependency):
    db_labs = db.query(models.Lab).filter(models.Lab.owner == user.username).all()
    return db_labs

@app.get("/racks/", response_model=List[Rack])
def get_all_racks(db: db_dependency, user: user_dependency):
    db_racks = db.query(models.Rack).filter(models.Rack.owner == user.username).all()
    return db_racks

@app.get("/servers/", response_model=List[Server])
def get_all_servers(db: db_dependency, user: user_dependency):
    db_servers = db.query(models.Server).filter(models.Server.owner == user.username).all()
    return db_servers

@app.get("/switches/", response_model=List[Switch])
def get_all_switches(db: db_dependency, user: user_dependency):
    db_switches = db.query(models.Switch).filter(models.Switch.owner == user.username).all()
    return db_switches

@app.get("/vms/", response_model=List[VM])
def get_all_vms(db: db_dependency, user: user_dependency):
    db_vms = db.query(models.VM).filter(models.VM.owner == user.username).all()
    return db_vms
    
@app.get("/vms/{owner_username}", response_model=List[VM])
def get_vms_by_owner(owner_username: str, db: db_dependency):
    db_vms = db.query(models.VM).filter(models.VM.owner == owner_username).all()
    return db_vms

@app.get("/datacenters/{owner_username}", response_model=List[Datacenter])
def get_datacenters_by_owner(owner_username: str, db: db_dependency):
    db_datacenters = db.query(models.Datacenter).filter(models.Datacenter.owner == owner_username).all()
    return db_datacenters

@app.get("/labs/{owner_username}", response_model=List[Lab])
def get_labs_by_owner(owner_username: str, db: db_dependency):
    db_labs = db.query(models.Lab).filter(models.Lab.owner == owner_username).all()
    return db_labs

@app.get("/racks/{owner_username}", response_model=List[Rack])
def get_racks_by_owner(owner_username: str, db: db_dependency):
    db_racks = db.query(models.Rack).filter(models.Rack.owner == owner_username).all()
    return db_racks

@app.get("/servers/{owner_username}", response_model=List[Server])
def get_servers_by_owner(owner_username: str, db: db_dependency):
    db_servers = db.query(models.Server).filter(models.Server.owner == owner_username).all()
    return db_servers

@app.get("/switches/{owner_username}", response_model=List[Switch])
def get_switches_by_owner(owner_username: str, db: db_dependency):
    db_switches = db.query(models.Switch).filter(models.Switch.owner == owner_username).all()
    return db_switches



# add delete endpoints by ID and by owner, if something is deleted, delete all the children as well
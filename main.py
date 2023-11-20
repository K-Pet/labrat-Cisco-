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
# Create Lab
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

# Create Rack
@app.post("/racks/", response_model=Rack)
def create_rack(rack: Rack, servers: List[str], switches: List[str], db: db_dependency, user: user_dependency):
    db_rack = models.Rack(**rack.model_dump(), id=str(uuid.uuid4()), owner=user.username)
    db.add(db_rack)

    for server_id in servers:
        db_server = db.query(models.Server).filter(models.Server.id == server_id).first()
        if db_server:
            db_rack.servers.append(db_server)

    for switch_id in switches:
        db_switch = db.query(models.Switch).filter(models.Switch.id == switch_id).first()
        if db_switch:
            db_rack.switches.append(db_switch)

    db.commit()
    db.refresh(db_rack)
    return db_rack

# Create Switch
@app.post("/switches/", response_model=Switch)
def create_switch(switch: Switch, db: db_dependency, user: user_dependency):
    db_switch = models.Switch(**switch.model_dump(), id=str(uuid.uuid4()), owner=user.username)
    db.add(db_switch)
    db.commit()
    db.refresh(db_switch)
    return db_switch

# Create VM
@app.post("/vms/", response_model=VM)
def create_vm(vm: VM, db: db_dependency, user: user_dependency):
    db_vm = models.VM(**vm.model_dump(), id=str(uuid.uuid4()), owner=user.username)
    db.add(db_vm)
    db.commit()
    db.refresh(db_vm)
    return db_vm


# Create Datacenter
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

# Create multiple Datacenters
@app.post("/datacenters/batch/", response_model=List[Datacenter])
def create_datacenters_batch(datacenters: List[Datacenter], lab_ids_list: List[List[str]], db: db_dependency, user: user_dependency):
    created_datacenters = []
    for i, datacenter in enumerate(datacenters):
        db_datacenter = models.Datacenter(**datacenter.model_dump(), id=str(uuid.uuid4()), owner=user.username)
        db.add(db_datacenter)

        for lab_id in lab_ids_list[i]:
            db_lab = db.query(models.Lab).filter(models.Lab.id == lab_id).first()
            if db_lab:
                db_datacenter.labs.append(db_lab)

        db.commit()
        db.refresh(db_datacenter)
        created_datacenters.append(db_datacenter)

    return created_datacenters


# Create multiple Servers
@app.post("/servers/batch/", response_model=List[Server])
def create_servers_batch(servers: List[Server], db: db_dependency, user: user_dependency):
    created_servers = []
    for server in servers:
        db_server = models.Server(**server.model_dump(), id=str(uuid.uuid4()), owner=user.username)
        db.add(db_server)
        db.commit()
        db.refresh(db_server)
        created_servers.append(db_server)

    return created_servers

# Delete Datacenter by ID
@app.delete("/datacenters/{datacenter_id}", response_model=Datacenter)
def delete_datacenter(datacenter_id: str, db: db_dependency, user: user_dependency):
    db_datacenter = db.query(models.Datacenter).filter(models.Datacenter.id == datacenter_id, models.Datacenter.owner == user.username).first()
    if not db_datacenter:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Datacenter not found")

    # Cascade deletion to labs
    for lab in db_datacenter.labs:
        db.delete(lab)

    db.delete(db_datacenter)
    db.commit()

    return db_datacenter

# Delete Datacenters by owner
@app.delete("/datacenters/", response_model=str)
def delete_datacenters_by_owner(db: db_dependency, user: user_dependency):
    db_datacenters = db.query(models.Datacenter).filter(models.Datacenter.owner == user.username).all()
    if not db_datacenters:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No datacenters found for the user")

    for datacenter in db_datacenters:
        # Cascade deletion to labs
        for lab in datacenter.labs:
            db.delete(lab)

        db.delete(datacenter)

    db.commit()

    return {"message": "Datacenters deleted successfully"}

# Delete Lab by ID
@app.delete("/labs/{lab_id}", response_model=Lab)
def delete_lab(lab_id: str, db: db_dependency, user: user_dependency):
    db_lab = db.query(models.Lab).filter(models.Lab.id == lab_id, models.Lab.owner == user.username).first()
    if not db_lab:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lab not found")

    # Cascade deletion to racks
    for rack in db_lab.racks:
        # Cascade deletion to servers and switches
        for server in rack.servers:
            db.delete(server)
        for switch in rack.switches:
            db.delete(switch)
        
        db.delete(rack)

    db.delete(db_lab)
    db.commit()

    return db_lab

# Delete Labs by owner
@app.delete("/labs/", response_model=str)
def delete_labs_by_owner(db: db_dependency, user: user_dependency):
    db_labs = db.query(models.Lab).filter(models.Lab.owner == user.username).all()
    if not db_labs:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No labs found for the user")

    for lab in db_labs:
        # Cascade deletion to racks
        for rack in lab.racks:
            # Cascade deletion to servers and switches
            for server in rack.servers:
                db.delete(server)
            for switch in rack.switches:
                db.delete(switch)

            db.delete(rack)

        db.delete(lab)

    db.commit()

    return {"message": "Labs deleted successfully"}

# Delete Rack by ID
@app.delete("/racks/{rack_id}", response_model=Rack)
def delete_rack(rack_id: str, db: db_dependency, user: user_dependency):
    db_rack = db.query(models.Rack).filter(models.Rack.id == rack_id, models.Rack.owner == user.username).first()
    if not db_rack:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rack not found")

    # Cascade deletion to servers and switches
    for server in db_rack.servers:
        db.delete(server)
    for switch in db_rack.switches:
        db.delete(switch)

    db.delete(db_rack)
    db.commit()

    return db_rack

# Delete Racks by owner
@app.delete("/racks/", response_model=str)
def delete_racks_by_owner(db: db_dependency, user: user_dependency):
    db_racks = db.query(models.Rack).filter(models.Rack.owner == user.username).all()
    if not db_racks:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No racks found for the user")

    for rack in db_racks:
        # Cascade deletion to servers and switches
        for server in rack.servers:
            db.delete(server)
        for switch in rack.switches:
            db.delete(switch)

        db.delete(rack)

    db.commit()

    return {"message": "Racks deleted successfully"}

# Delete Server by ID
@app.delete("/servers/{server_id}", response_model=Server)
def delete_server(server_id: str, db: db_dependency, user: user_dependency):
    db_server = db.query(models.Server).filter(models.Server.id == server_id, models.Server.owner == user.username).first()
    if not db_server:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Server not found")

    db.delete(db_server)
    db.commit()

    return db_server

# Delete all Servers owned by a user
@app.delete("/servers/", response_model=str)
def delete_servers_by_owner(db: db_dependency, user: user_dependency):
    db_servers = db.query(models.Server).filter(models.Server.owner == user.username).all()
    if not db_servers:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No servers found for the user")

    for server in db_servers:
        db.delete(server)

    db.commit()

    return {"message": "Servers deleted successfully"}

# Delete Switch by ID
@app.delete("/switches/{switch_id}", response_model=Switch)
def delete_switch(switch_id: str, db: db_dependency, user: user_dependency):
    db_switch = db.query(models.Switch).filter(models.Switch.id == switch_id, models.Switch.owner == user.username).first()
    if not db_switch:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Switch not found")

    db.delete(db_switch)
    db.commit()

    return db_switch

# Delete all Switches owned by a user
@app.delete("/switches/", response_model=str)
def delete_switches_by_owner(db: db_dependency, user: user_dependency):
    db_switches = db.query(models.Switch).filter(models.Switch.owner == user.username).all()
    if not db_switches:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No switches found for the user")

    for switch in db_switches:
        db.delete(switch)

    db.commit()

    return {"message": "Switches deleted successfully"}

# Delete VM by ID
@app.delete("/vms/{vm_id}", response_model=VM)
def delete_vm(vm_id: str, db: db_dependency, user: user_dependency):
    db_vm = db.query(models.VM).filter(models.VM.id == vm_id, models.VM.owner == user.username).first()
    if not db_vm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="VM not found")

    db.delete(db_vm)
    db.commit()

    return db_vm

# Delete all VMs owned by a user
@app.delete("/vms/", response_model=str)
def delete_vms_by_owner(db: db_dependency, user: user_dependency):
    db_vms = db.query(models.VM).filter(models.VM.owner == user.username).all()
    if not db_vms:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No VMs found for the user")

    for vm in db_vms:
        db.delete(vm)

    db.commit()

    return {"message": "VMs deleted successfully"}
###
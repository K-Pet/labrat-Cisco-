from database import Base
from sqlalchemy import JSON, Boolean, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class BaseModel(Base):
    __abstract__ = True

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    owner = Column(String)
    creation_time = Column(String)
    last_modified_time = Column(String)

class Datacenter(BaseModel):
    __tablename__ = 'datacenters'
    address = Column(String)
    labs = relationship("Lab", back_populates="datacenter")

class Lab(BaseModel):
    __tablename__ = 'labs'

    racks = relationship("Rack", back_populates="lab")

    datacenter_id = Column(Integer, ForeignKey("datacenters.id"), nullable=True)
    datacenter = relationship("Datacenter", back_populates="labs")

class Rack(BaseModel):
    __tablename__ = 'racks'
    
    servers = relationship("Server", back_populates="rack")
    switches = relationship("Switch", back_populates="rack")

    lab_id = Column(Integer, ForeignKey("labs.id"), nullable=True)
    lab = relationship("Lab", back_populates="racks")

class Server(BaseModel):
    __tablename__ = 'servers'

    serial_number = Column(String)
    board_ip = Column(String)
    model = Column(String)
    os = Column(String)
    cores = Column(String)
    memory = Column(String)
    storage = Column(String)

    rack_id = Column(Integer, ForeignKey("racks.id"), nullable=True)
    rack = relationship("Rack", back_populates="servers")


class Switch(BaseModel):
    __tablename__ = 'switches'

    num_ports = Column(Integer)
    port_speed = Column(Integer)
    model = Column(String)
    vendor = Column(String)
    serial_number = Column(String)
    management_ip = Column(String)
    rack_id = Column(Integer, ForeignKey("racks.id"), nullable=True)
    rack = relationship("Rack", back_populates="switches")

class VM(BaseModel):
    __tablename__ = 'vms'
    serialnumber = Column(String)
    boardip = Column(String)
    model = Column(String)
    os = Column(String)
    cores = Column(String)
    memory = Column(String)
    storage = Column(String)


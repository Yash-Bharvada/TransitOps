from sqlalchemy import Column, String, Integer, Numeric, DateTime, Enum
import enum
from datetime import datetime
from app.database import Base
from sqlalchemy.orm import relationship

class VehicleType(str, enum.Enum):
    Truck = "Truck"
    Van = "Van"
    Pickup = "Pickup"
    Sedan = "Sedan"

class VehicleStatus(str, enum.Enum):
    Available = "Available"
    On_Trip = "On Trip"
    In_Shop = "In Shop"
    Retired = "Retired"

class RegionEnum(str, enum.Enum):
    North = "North"
    South = "South"
    East = "East"
    West = "West"

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(String, primary_key=True, index=True) # e.g. "VH-001"
    registration = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    type = Column(Enum(VehicleType), nullable=False)
    max_capacity_kg = Column(Integer, nullable=False)
    odometer_km = Column(Integer, nullable=False, default=0)
    status = Column(Enum(VehicleStatus), default=VehicleStatus.Available, nullable=False)
    acquisition_cost = Column(Numeric(10, 2), nullable=False)
    region = Column(Enum(RegionEnum), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    trips = relationship("Trip", back_populates="vehicle")
    maintenance_records = relationship("Maintenance", back_populates="vehicle")
    fuel_logs = relationship("FuelLog", back_populates="vehicle")

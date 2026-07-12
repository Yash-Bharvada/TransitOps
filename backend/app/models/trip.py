from sqlalchemy import Column, String, Integer, Date, DateTime, Enum, ForeignKey
import enum
from datetime import datetime
from app.database import Base
from sqlalchemy.orm import relationship

class TripStatus(str, enum.Enum):
    Draft = "Draft"
    Pending = "Pending"
    Dispatched = "Dispatched"
    Completed = "Completed"
    Cancelled = "Cancelled"

class Trip(Base):
    __tablename__ = "trips"

    id = Column(String, primary_key=True, index=True) # e.g. "TR-1042"
    vehicle_id = Column(String, ForeignKey("vehicles.id"), nullable=False)
    driver_id = Column(String, ForeignKey("drivers.id"), nullable=False)
    source = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    cargo_weight_kg = Column(Integer, nullable=False)
    distance_km = Column(Integer, nullable=False)
    date = Column(Date, nullable=False)
    status = Column(Enum(TripStatus), default=TripStatus.Draft, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    vehicle = relationship("Vehicle", back_populates="trips")
    driver = relationship("Driver", back_populates="trips")

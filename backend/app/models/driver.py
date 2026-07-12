from sqlalchemy import Column, String, Integer, Date, DateTime, Enum
import enum
from datetime import datetime
from app.database import Base
from sqlalchemy.orm import relationship

class LicenseCategory(str, enum.Enum):
    Class_A = "Class A"
    Class_B = "Class B"
    Class_C = "Class C"

class DriverStatus(str, enum.Enum):
    Available = "Available"
    On_Trip = "On Trip"
    Off_Duty = "Off Duty"
    Suspended = "Suspended"

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(String, primary_key=True, index=True) # e.g. "DR-001"
    name = Column(String, nullable=False)
    license_number = Column(String, unique=True, index=True, nullable=False)
    license_category = Column(Enum(LicenseCategory), nullable=False)
    license_expiry = Column(Date, nullable=False)
    contact = Column(String, nullable=False)
    safety_score = Column(Integer, default=100) # 0-100
    status = Column(Enum(DriverStatus), default=DriverStatus.Available, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    trips = relationship("Trip", back_populates="driver")

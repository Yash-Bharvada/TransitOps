from sqlalchemy import Column, String, Numeric, Date, DateTime, Enum, ForeignKey
import enum
from datetime import datetime
from app.database import Base
from sqlalchemy.orm import relationship

class MaintenanceStatus(str, enum.Enum):
    Pending = "Pending"
    In_Progress = "In Progress"
    Completed = "Completed"

class Maintenance(Base):
    __tablename__ = "maintenance"

    id = Column(String, primary_key=True, index=True) # e.g. "MT-201"
    vehicle_id = Column(String, ForeignKey("vehicles.id"), nullable=False)
    description = Column(String, nullable=False)
    cost = Column(Numeric(10, 2), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    status = Column(Enum(MaintenanceStatus), default=MaintenanceStatus.Pending, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    vehicle = relationship("Vehicle", back_populates="maintenance_records")

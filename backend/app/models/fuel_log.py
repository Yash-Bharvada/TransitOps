from sqlalchemy import Column, String, Integer, Numeric, Date, DateTime, ForeignKey
from datetime import datetime
from app.database import Base
from sqlalchemy.orm import relationship

class FuelLog(Base):
    __tablename__ = "fuel_logs"

    id = Column(String, primary_key=True, index=True) # e.g. "FL-501"
    vehicle_id = Column(String, ForeignKey("vehicles.id"), nullable=False)
    date = Column(Date, nullable=False)
    liters = Column(Numeric(10, 2), nullable=False)
    cost = Column(Numeric(10, 2), nullable=False)
    odometer_km = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    vehicle = relationship("Vehicle", back_populates="fuel_logs")

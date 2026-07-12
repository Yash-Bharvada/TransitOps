from sqlalchemy import Column, String, Integer, DateTime, Uuid
import uuid
from datetime import datetime
from app.database import Base

class Settings(Base):
    __tablename__ = "settings"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_name = Column(String, nullable=False)
    currency = Column(String, default="USD")
    distance_unit = Column(String, default="km")
    fuel_unit = Column(String, default="liters")
    timezone = Column(String, default="UTC")
    maintenance_alert_days = Column(Integer, default=7)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

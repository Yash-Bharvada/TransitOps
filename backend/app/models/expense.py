from sqlalchemy import Column, String, Numeric, Date, DateTime, Enum
import enum
from datetime import datetime
from app.database import Base

class ExpenseType(str, enum.Enum):
    Toll = "Toll"
    Parking = "Parking"
    Maintenance = "Maintenance"
    Other = "Other"

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(String, primary_key=True, index=True) # e.g. "EX-301"
    description = Column(String, nullable=False)
    type = Column(Enum(ExpenseType), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    date = Column(Date, nullable=False)
    associated_with = Column(String, nullable=True) # trip_id or vehicle_registration
    created_at = Column(DateTime, default=datetime.utcnow)

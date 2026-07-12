from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import date, datetime
from decimal import Decimal
from app.models.maintenance import MaintenanceStatus

class MaintenanceBase(BaseModel):
    vehicle_id: str
    description: str
    cost: Decimal = Field(ge=0)
    start_date: date
    end_date: Optional[date] = None
    status: MaintenanceStatus = MaintenanceStatus.Pending

class MaintenanceCreate(MaintenanceBase):
    id: str

class MaintenanceUpdate(BaseModel):
    vehicle_id: Optional[str] = None
    description: Optional[str] = None
    cost: Optional[Decimal] = Field(default=None, ge=0)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[MaintenanceStatus] = None

class MaintenanceInDBBase(MaintenanceBase):
    id: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class MaintenanceResponse(MaintenanceInDBBase):
    pass

class MaintenanceStats(BaseModel):
    total: int
    pending: int
    inProgress: int
    completed: int

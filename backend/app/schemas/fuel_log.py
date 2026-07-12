from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import date, datetime
from decimal import Decimal

class FuelLogBase(BaseModel):
    vehicle_id: str
    date: date
    liters: Decimal = Field(gt=0)
    cost: Decimal = Field(gt=0)
    odometer_km: int = Field(gt=0)

class FuelLogCreate(FuelLogBase):
    id: str

class FuelLogUpdate(BaseModel):
    vehicle_id: Optional[str] = None
    date: Optional[date] = None
    liters: Optional[Decimal] = Field(default=None, gt=0)
    cost: Optional[Decimal] = Field(default=None, gt=0)
    odometer_km: Optional[int] = Field(default=None, gt=0)

class FuelLogInDBBase(FuelLogBase):
    id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class FuelLogResponse(FuelLogInDBBase):
    pass

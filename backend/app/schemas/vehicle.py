from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal
from app.models.vehicle import VehicleType, VehicleStatus, RegionEnum

class VehicleBase(BaseModel):
    name: str
    type: VehicleType
    max_capacity_kg: int = Field(gt=0)
    odometer_km: int = Field(ge=0)
    status: VehicleStatus = VehicleStatus.Available
    acquisition_cost: Decimal = Field(gt=0)
    region: RegionEnum

class VehicleCreate(VehicleBase):
    id: str
    registration: str

class VehicleUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[VehicleType] = None
    max_capacity_kg: Optional[int] = Field(default=None, gt=0)
    odometer_km: Optional[int] = Field(default=None, ge=0)
    status: Optional[VehicleStatus] = None
    acquisition_cost: Optional[Decimal] = Field(default=None, gt=0)
    region: Optional[RegionEnum] = None

class VehicleInDBBase(VehicleBase):
    id: str
    registration: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class VehicleResponse(VehicleInDBBase):
    pass

class VehicleStats(BaseModel):
    total: int
    available: int
    onTrip: int
    inShop: int
    retired: int

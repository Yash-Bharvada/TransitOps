from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import date, datetime
from app.models.trip import TripStatus

class TripBase(BaseModel):
    vehicle_id: str
    driver_id: str
    source: str
    destination: str
    cargo_weight_kg: int = Field(gt=0)
    distance_km: int = Field(gt=0)
    date: date
    status: TripStatus = TripStatus.Draft

class TripCreate(TripBase):
    id: str

class TripUpdate(BaseModel):
    vehicle_id: Optional[str] = None
    driver_id: Optional[str] = None
    source: Optional[str] = None
    destination: Optional[str] = None
    cargo_weight_kg: Optional[int] = Field(default=None, gt=0)
    distance_km: Optional[int] = Field(default=None, gt=0)
    date: Optional[date] = None
    status: Optional[TripStatus] = None

class TripInDBBase(TripBase):
    id: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class TripResponse(TripInDBBase):
    pass

class TripStats(BaseModel):
    total: int
    draft: int
    pending: int
    dispatched: int
    completed: int
    cancelled: int

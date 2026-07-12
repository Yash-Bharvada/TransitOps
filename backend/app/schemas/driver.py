from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import date, datetime
from app.models.driver import LicenseCategory, DriverStatus

class DriverBase(BaseModel):
    name: str
    license_category: LicenseCategory
    license_expiry: date
    contact: str
    safety_score: int = Field(default=100, ge=0, le=100)
    status: DriverStatus = DriverStatus.Available

class DriverCreate(DriverBase):
    id: str
    license_number: str

class DriverUpdate(BaseModel):
    name: Optional[str] = None
    license_category: Optional[LicenseCategory] = None
    license_expiry: Optional[date] = None
    contact: Optional[str] = None
    safety_score: Optional[int] = Field(default=None, ge=0, le=100)
    status: Optional[DriverStatus] = None

class DriverInDBBase(DriverBase):
    id: str
    license_number: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class DriverResponse(DriverInDBBase):
    pass

class DriverStats(BaseModel):
    total: int
    available: int
    onTrip: int
    offDuty: int
    suspended: int

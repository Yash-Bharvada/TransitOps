from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID

class SettingsBase(BaseModel):
    company_name: str
    currency: str = "USD"
    distance_unit: str = "km"
    fuel_unit: str = "liters"
    timezone: str = "UTC"
    maintenance_alert_days: int = 7

class SettingsUpdate(BaseModel):
    company_name: Optional[str] = None
    currency: Optional[str] = None
    distance_unit: Optional[str] = None
    fuel_unit: Optional[str] = None
    timezone: Optional[str] = None
    maintenance_alert_days: Optional[int] = None

class SettingsInDBBase(SettingsBase):
    id: UUID
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class SettingsResponse(SettingsInDBBase):
    pass

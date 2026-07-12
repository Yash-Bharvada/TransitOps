from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import date, datetime
from decimal import Decimal
from app.models.expense import ExpenseType

class ExpenseBase(BaseModel):
    description: str
    type: ExpenseType
    amount: Decimal = Field(gt=0)
    date: date
    associated_with: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    id: str

class ExpenseUpdate(BaseModel):
    description: Optional[str] = None
    type: Optional[ExpenseType] = None
    amount: Optional[Decimal] = Field(default=None, gt=0)
    date: Optional[date] = None
    associated_with: Optional[str] = None

class ExpenseInDBBase(ExpenseBase):
    id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ExpenseResponse(ExpenseInDBBase):
    pass

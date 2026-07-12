from pydantic import BaseModel, ConfigDict
from typing import Generic, TypeVar, List, Optional, Any
from datetime import datetime

T = TypeVar("T")

class Pagination(BaseModel):
    total: int
    page: int
    limit: int
    pages: int

class PaginatedResponse(BaseModel, Generic[T]):
    status: str = "success"
    data: List[T]
    pagination: Pagination

class SuccessResponse(BaseModel, Generic[T]):
    status: str = "success"
    data: T
    message: str = "Operation successful"

class ErrorDetail(BaseModel):
    field: Optional[str] = None
    max: Optional[int] = None
    provided: Optional[Any] = None

class ErrorResponse(BaseModel):
    status: str = "error"
    code: str
    message: str
    details: Optional[dict] = None

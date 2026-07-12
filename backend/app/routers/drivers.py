from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.dependencies import get_current_user, require_role
from app.models.user import User
from app.schemas.driver import DriverCreate, DriverUpdate, DriverResponse, DriverStats
from app.schemas import PaginatedResponse, SuccessResponse
from app.crud.driver import driver as crud_driver
from app.models.driver import DriverStatus, LicenseCategory
import math

router = APIRouter()

@router.get("", response_model=PaginatedResponse[DriverResponse])
def read_drivers(
    db: Session = Depends(get_db),
    status: Optional[DriverStatus] = None,
    license_category: Optional[LicenseCategory] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    skip = (page - 1) * limit
    drivers, total = crud_driver.get_multi_with_filters(
        db, status=status, license_category=license_category, search=search, skip=skip, limit=limit
    )
    return {
        "status": "success",
        "data": drivers,
        "pagination": {
            "total": total,
            "page": page,
            "limit": limit,
            "pages": math.ceil(total / limit)
        }
    }

@router.post("", response_model=SuccessResponse[DriverResponse], status_code=201)
def create_driver(
    driver_in: DriverCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "manager", "driver"]))
):
    driver = crud_driver.get_by_license_number(db, license_number=driver_in.license_number)
    if driver:
        raise HTTPException(status_code=400, detail="Driver with this license already exists")
    
    new_driver = crud_driver.create(db, obj_in=driver_in)
    return {"status": "success", "data": new_driver, "message": "Driver created successfully"}

@router.get("/stats", response_model=SuccessResponse[DriverStats])
def get_driver_stats(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    stats = crud_driver.get_stats(db)
    return {"status": "success", "data": stats, "message": "Stats retrieved successfully"}

@router.get("/{id}", response_model=SuccessResponse[DriverResponse])
def read_driver(id: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    driver = crud_driver.get(db, id=id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return {"status": "success", "data": driver, "message": "Operation successful"}

@router.patch("/{id}", response_model=SuccessResponse[DriverResponse])
def update_driver(
    id: str, driver_in: DriverUpdate, 
    db: Session = Depends(get_db), current_user: User = Depends(require_role(["admin", "manager", "driver"]))
):
    driver = crud_driver.get(db, id=id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    updated_driver = crud_driver.update(db, db_obj=driver, obj_in=driver_in)
    return {"status": "success", "data": updated_driver, "message": "Driver updated successfully"}

@router.delete("/{id}", response_model=SuccessResponse[DriverResponse])
def delete_driver(id: str, db: Session = Depends(get_db), current_user: User = Depends(require_role(["admin", "manager", "driver"]))):
    driver = crud_driver.get(db, id=id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    deleted_driver = crud_driver.remove(db, id=id)
    return {"status": "success", "data": deleted_driver, "message": "Driver deleted successfully"}

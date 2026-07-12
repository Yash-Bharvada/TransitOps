from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.dependencies import get_current_user, require_role
from app.models.user import User
from app.schemas.maintenance import MaintenanceCreate, MaintenanceUpdate, MaintenanceResponse, MaintenanceStats
from app.schemas import PaginatedResponse, SuccessResponse
from app.crud.maintenance import maintenance as crud_maintenance
from app.crud.vehicle import vehicle as crud_vehicle
from app.models.maintenance import MaintenanceStatus
import math

router = APIRouter()

@router.get("", response_model=PaginatedResponse[MaintenanceResponse])
def read_maintenance(
    db: Session = Depends(get_db),
    status: Optional[MaintenanceStatus] = None,
    vehicle_id: Optional[str] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    skip = (page - 1) * limit
    records, total = crud_maintenance.get_multi_with_filters(
        db, status=status, vehicle_id=vehicle_id, search=search, skip=skip, limit=limit
    )
    return {
        "status": "success",
        "data": records,
        "pagination": {
            "total": total,
            "page": page,
            "limit": limit,
            "pages": math.ceil(total / limit)
        }
    }

@router.post("", response_model=SuccessResponse[MaintenanceResponse], status_code=201)
def create_maintenance(
    maint_in: MaintenanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "manager", "driver"]))
):
    vehicle = crud_vehicle.get(db, id=maint_in.vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=400, detail="Vehicle does not exist")
    
    if maint_in.end_date and maint_in.end_date < maint_in.start_date:
        raise HTTPException(status_code=400, detail="End date must be >= start date")
        
    new_maint = crud_maintenance.create(db, obj_in=maint_in)
    return {"status": "success", "data": new_maint, "message": "Maintenance record created successfully"}

@router.get("/stats", response_model=SuccessResponse[MaintenanceStats])
def get_maintenance_stats(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    stats = crud_maintenance.get_stats(db)
    return {"status": "success", "data": stats, "message": "Stats retrieved successfully"}

@router.get("/{id}", response_model=SuccessResponse[MaintenanceResponse])
def read_maintenance_record(id: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    maint = crud_maintenance.get(db, id=id)
    if not maint:
        raise HTTPException(status_code=404, detail="Maintenance record not found")
    return {"status": "success", "data": maint, "message": "Operation successful"}

@router.patch("/{id}", response_model=SuccessResponse[MaintenanceResponse])
def update_maintenance(
    id: str, maint_in: MaintenanceUpdate, 
    db: Session = Depends(get_db), current_user: User = Depends(require_role(["admin", "manager", "driver"]))
):
    maint = crud_maintenance.get(db, id=id)
    if not maint:
        raise HTTPException(status_code=404, detail="Maintenance record not found")
        
    # Additional validation can be done here for dates
        
    updated_maint = crud_maintenance.update(db, db_obj=maint, obj_in=maint_in)
    return {"status": "success", "data": updated_maint, "message": "Maintenance updated successfully"}

@router.delete("/{id}", response_model=SuccessResponse[MaintenanceResponse])
def delete_maintenance(id: str, db: Session = Depends(get_db), current_user: User = Depends(require_role(["admin", "manager", "driver"]))):
    maint = crud_maintenance.get(db, id=id)
    if not maint:
        raise HTTPException(status_code=404, detail="Maintenance record not found")
    deleted_maint = crud_maintenance.remove(db, id=id)
    return {"status": "success", "data": deleted_maint, "message": "Maintenance deleted successfully"}

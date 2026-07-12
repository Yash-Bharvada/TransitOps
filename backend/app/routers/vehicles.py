from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.dependencies import get_current_user, require_role
from app.models.user import User
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleResponse, VehicleStats
from app.schemas import PaginatedResponse, SuccessResponse
from app.crud.vehicle import vehicle as crud_vehicle
from app.models.vehicle import VehicleStatus, VehicleType, RegionEnum
import math

router = APIRouter()
# We would ideally apply Depends(get_current_user) globally or to all, adding it where data is read/written

@router.get("", response_model=PaginatedResponse[VehicleResponse])
def read_vehicles(
    db: Session = Depends(get_db),
    status: Optional[VehicleStatus] = None,
    type: Optional[VehicleType] = None,
    region: Optional[RegionEnum] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    skip = (page - 1) * limit
    vehicles, total = crud_vehicle.get_multi_with_filters(
        db, status=status, type=type, region=region, search=search, skip=skip, limit=limit
    )
    return {
        "status": "success",
        "data": vehicles,
        "pagination": {
            "total": total,
            "page": page,
            "limit": limit,
            "pages": math.ceil(total / limit)
        }
    }

@router.post("", response_model=SuccessResponse[VehicleResponse], status_code=201)
def create_vehicle(
    vehicle_in: VehicleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "manager", "driver"]))
):
    vehicle = crud_vehicle.get_by_registration(db, registration=vehicle_in.registration)
    if vehicle:
        raise HTTPException(status_code=400, detail="Vehicle with this registration already exists")
    
    new_vehicle = crud_vehicle.create(db, obj_in=vehicle_in)
    return {"status": "success", "data": new_vehicle, "message": "Vehicle created successfully"}

@router.get("/stats", response_model=SuccessResponse[VehicleStats])
def get_vehicle_stats(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    stats = crud_vehicle.get_stats(db)
    return {"status": "success", "data": stats, "message": "Stats retrieved successfully"}

@router.get("/{id}", response_model=SuccessResponse[VehicleResponse])
def read_vehicle(id: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    vehicle = crud_vehicle.get(db, id=id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return {"status": "success", "data": vehicle, "message": "Operation successful"}

@router.patch("/{id}", response_model=SuccessResponse[VehicleResponse])
def update_vehicle(
    id: str, vehicle_in: VehicleUpdate, 
    db: Session = Depends(get_db), current_user: User = Depends(require_role(["admin", "manager", "driver"]))
):
    vehicle = crud_vehicle.get(db, id=id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    updated_vehicle = crud_vehicle.update(db, db_obj=vehicle, obj_in=vehicle_in)
    return {"status": "success", "data": updated_vehicle, "message": "Vehicle updated successfully"}

@router.delete("/{id}", response_model=SuccessResponse[VehicleResponse])
def delete_vehicle(id: str, db: Session = Depends(get_db), current_user: User = Depends(require_role(["admin", "manager", "driver"]))):
    vehicle = crud_vehicle.get(db, id=id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    # Soft delete
    deleted_vehicle = crud_vehicle.remove(db, id=id)
    return {"status": "success", "data": deleted_vehicle, "message": "Vehicle deleted (retired) successfully"}

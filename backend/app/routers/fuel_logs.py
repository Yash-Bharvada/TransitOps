from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from app.database import get_db
from app.dependencies import get_current_user, require_role
from app.models.user import User
from app.schemas.fuel_log import FuelLogCreate, FuelLogResponse
from app.schemas import PaginatedResponse, SuccessResponse
from app.crud.fuel_log import fuel_log as crud_fuel_log
from app.crud.vehicle import vehicle as crud_vehicle
import math

router = APIRouter()

@router.get("", response_model=PaginatedResponse[FuelLogResponse])
def read_fuel_logs(
    db: Session = Depends(get_db),
    vehicle_id: Optional[str] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    skip = (page - 1) * limit
    logs, total = crud_fuel_log.get_multi_with_filters(
        db, vehicle_id=vehicle_id, date_from=date_from, date_to=date_to, skip=skip, limit=limit
    )
    return {
        "status": "success",
        "data": logs,
        "pagination": {
            "total": total,
            "page": page,
            "limit": limit,
            "pages": math.ceil(total / limit)
        }
    }

@router.post("", response_model=SuccessResponse[FuelLogResponse], status_code=201)
def create_fuel_log(
    log_in: FuelLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "manager", "driver"]))
):
    vehicle = crud_vehicle.get(db, id=log_in.vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=400, detail="Vehicle does not exist")
    
    if log_in.odometer_km < vehicle.odometer_km:
        raise HTTPException(status_code=400, detail="Odometer reading cannot be lower than current vehicle odometer")
        
    new_log = crud_fuel_log.create(db, obj_in=log_in)
    
    # Update vehicle odometer
    crud_vehicle.update(db, db_obj=vehicle, obj_in={"odometer_km": log_in.odometer_km})
    
    return {"status": "success", "data": new_log, "message": "Fuel log created successfully"}

@router.get("/trend", response_model=SuccessResponse[list])
def get_fuel_trend(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    trend = crud_fuel_log.get_monthly_trend(db)
    return {"status": "success", "data": trend, "message": "Trend retrieved successfully"}

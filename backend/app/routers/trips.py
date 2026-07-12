from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.trip import TripCreate, TripUpdate, TripResponse, TripStats
from app.schemas import PaginatedResponse, SuccessResponse
from app.crud.trip import trip as crud_trip
from app.models.trip import TripStatus
from app.crud.vehicle import vehicle as crud_vehicle
from app.models.vehicle import VehicleStatus
from app.crud.driver import driver as crud_driver
from app.models.driver import DriverStatus
import math

router = APIRouter()

@router.get("", response_model=PaginatedResponse[TripResponse])
def read_trips(
    db: Session = Depends(get_db),
    status: Optional[TripStatus] = None,
    vehicle_id: Optional[str] = None,
    driver_id: Optional[str] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    skip = (page - 1) * limit
    trips, total = crud_trip.get_multi_with_filters(
        db, status=status, vehicle_id=vehicle_id, driver_id=driver_id, 
        date_from=date_from, date_to=date_to, search=search, skip=skip, limit=limit
    )
    return {
        "status": "success",
        "data": trips,
        "pagination": {
            "total": total,
            "page": page,
            "limit": limit,
            "pages": math.ceil(total / limit)
        }
    }

@router.post("", response_model=SuccessResponse[TripResponse], status_code=201)
def create_trip(
    trip_in: TripCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Validate vehicle
    vehicle = crud_vehicle.get(db, id=trip_in.vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=400, detail="Vehicle does not exist")
    if vehicle.status != VehicleStatus.Available:
        raise HTTPException(status_code=400, detail="Vehicle is not available")
    if trip_in.cargo_weight_kg > vehicle.max_capacity_kg:
        raise HTTPException(status_code=400, detail={
            "field": "cargo_weight_kg",
            "max": vehicle.max_capacity_kg,
            "provided": trip_in.cargo_weight_kg,
            "message": "Vehicle capacity exceeded"
        })

    # Validate driver
    driver = crud_driver.get(db, id=trip_in.driver_id)
    if not driver:
        raise HTTPException(status_code=400, detail="Driver does not exist")
    if driver.status != DriverStatus.Available:
        raise HTTPException(status_code=400, detail="Driver is not available")
        
    new_trip = crud_trip.create(db, obj_in=trip_in)
    return {"status": "success", "data": new_trip, "message": "Trip created successfully"}

@router.get("/stats", response_model=SuccessResponse[TripStats])
def get_trip_stats(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    stats = crud_trip.get_stats(db)
    return {"status": "success", "data": stats, "message": "Stats retrieved successfully"}

@router.get("/{id}", response_model=SuccessResponse[TripResponse])
def read_trip(id: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    trip = crud_trip.get(db, id=id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return {"status": "success", "data": trip, "message": "Operation successful"}

@router.patch("/{id}", response_model=SuccessResponse[TripResponse])
def update_trip(
    id: str, trip_in: TripUpdate, 
    db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)
):
    trip = crud_trip.get(db, id=id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.status == TripStatus.Completed:
        raise HTTPException(status_code=400, detail="Completed trips cannot be modified")
        
    updated_trip = crud_trip.update(db, db_obj=trip, obj_in=trip_in)
    return {"status": "success", "data": updated_trip, "message": "Trip updated successfully"}

@router.delete("/{id}", response_model=SuccessResponse[TripResponse])
def delete_trip(id: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    trip = crud_trip.get(db, id=id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.status not in [TripStatus.Draft, TripStatus.Pending]:
        raise HTTPException(status_code=400, detail="Can only delete trips in Draft or Pending status")
        
    # Before deleting, reset vehicle/driver status if needed (optional based on exact business logic)
    if trip.status == TripStatus.Pending:
        vehicle = crud_vehicle.get(db, id=trip.vehicle_id)
        if vehicle:
            crud_vehicle.update(db, db_obj=vehicle, obj_in={"status": VehicleStatus.Available})
        driver = crud_driver.get(db, id=trip.driver_id)
        if driver:
            crud_driver.update(db, db_obj=driver, obj_in={"status": DriverStatus.Available})
            
    deleted_trip = crud_trip.remove(db, id=id)
    return {"status": "success", "data": deleted_trip, "message": "Trip deleted successfully"}

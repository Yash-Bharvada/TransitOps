from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from datetime import date
from app.database import get_db
from app.dependencies import get_current_user
from app.schemas import SuccessResponse
from app.models.vehicle import Vehicle, VehicleStatus
from app.models.driver import Driver, DriverStatus
from app.models.trip import Trip, TripStatus
from app.models.fuel_log import FuelLog

router = APIRouter()

@router.get("/vehicle-performance", response_model=SuccessResponse[list])
def get_vehicle_performance(
    db: Session = Depends(get_db),
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    current_user: dict = Depends(get_current_user)
):
    # Get trips grouped by vehicle
    query = db.query(
        Trip.vehicle_id,
        func.count(Trip.id).label('total_trips'),
        func.sum(Trip.distance_km).label('total_distance'),
        func.sum(Trip.cargo_weight_kg).label('total_cargo')
    )
    if date_from:
        query = query.filter(Trip.date >= date_from)
    if date_to:
        query = query.filter(Trip.date <= date_to)
        
    results = query.group_by(Trip.vehicle_id).all()
    
    data = []
    for r in results:
        vehicle = db.query(Vehicle).filter(Vehicle.id == r.vehicle_id).first()
        data.append({
            "vehicle_id": r.vehicle_id,
            "registration": vehicle.registration if vehicle else "Unknown",
            "total_trips": r.total_trips,
            "total_distance": float(r.total_distance) if r.total_distance else 0,
            "total_cargo": float(r.total_cargo) if r.total_cargo else 0
        })
    return {"status": "success", "data": data, "message": "Vehicle performance retrieved"}

@router.get("/fuel-by-vehicle", response_model=SuccessResponse[list])
def get_fuel_by_vehicle(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    results = db.query(
        FuelLog.vehicle_id,
        func.sum(FuelLog.liters).label('total_liters'),
        func.sum(FuelLog.cost).label('total_cost')
    ).group_by(FuelLog.vehicle_id).all()
    
    data = []
    for r in results:
        vehicle = db.query(Vehicle).filter(Vehicle.id == r.vehicle_id).first()
        data.append({
            "vehicle_id": r.vehicle_id,
            "registration": vehicle.registration if vehicle else "Unknown",
            "total_liters": float(r.total_liters) if r.total_liters else 0,
            "total_cost": float(r.total_cost) if r.total_cost else 0
        })
    return {"status": "success", "data": data, "message": "Fuel cost by vehicle retrieved"}

@router.get("/dashboard", response_model=SuccessResponse[dict])
def get_dashboard_kpis(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    from app.crud.vehicle import vehicle as crud_vehicle
    from app.crud.driver import driver as crud_driver
    from app.crud.trip import trip as crud_trip
    from app.crud.maintenance import maintenance as crud_maintenance
    
    return {
        "status": "success",
        "data": {
            "vehicles": crud_vehicle.get_stats(db),
            "drivers": crud_driver.get_stats(db),
            "trips": crud_trip.get_stats(db),
            "maintenance": crud_maintenance.get_stats(db)
        },
        "message": "Dashboard KPIs retrieved successfully"
    }

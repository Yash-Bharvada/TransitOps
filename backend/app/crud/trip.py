from sqlalchemy.orm import Session
from datetime import date
from typing import Optional, List, Tuple
from app.crud.base import CRUDBase
from app.models.trip import Trip, TripStatus
from app.models.vehicle import Vehicle, VehicleStatus
from app.models.driver import Driver, DriverStatus
from app.schemas.trip import TripCreate, TripUpdate

class CRUDTrip(CRUDBase[Trip, TripCreate, TripUpdate]):
    def get_multi_with_filters(
        self, db: Session, *, 
        status: Optional[TripStatus] = None,
        vehicle_id: Optional[str] = None,
        driver_id: Optional[str] = None,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None,
        search: Optional[str] = None,
        skip: int = 0, limit: int = 100
    ) -> Tuple[List[Trip], int]:
        query = db.query(Trip)
        
        if status:
            query = query.filter(Trip.status == status)
        if vehicle_id:
            query = query.filter(Trip.vehicle_id == vehicle_id)
        if driver_id:
            query = query.filter(Trip.driver_id == driver_id)
        if date_from:
            query = query.filter(Trip.date >= date_from)
        if date_to:
            query = query.filter(Trip.date <= date_to)
        if search:
            search_term = f"%{search}%"
            query = query.filter((Trip.source.ilike(search_term)) | (Trip.destination.ilike(search_term)))
            
        total = query.count()
        trips = query.offset(skip).limit(limit).all()
        return trips, total

    def create(self, db: Session, *, obj_in: TripCreate) -> Trip:
        # Create trip
        db_obj = super().create(db, obj_in=obj_in)
        
        # Update vehicle and driver status
        vehicle = db.query(Vehicle).filter(Vehicle.id == obj_in.vehicle_id).first()
        if vehicle:
            vehicle.status = VehicleStatus.On_Trip
            
        driver = db.query(Driver).filter(Driver.id == obj_in.driver_id).first()
        if driver:
            driver.status = DriverStatus.On_Trip
            
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Trip, obj_in: TripUpdate) -> Trip:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
            
        old_status = db_obj.status
        updated_trip = super().update(db, db_obj=db_obj, obj_in=update_data)
        
        # Handle status transitions
        if "status" in update_data and update_data["status"] != old_status:
            new_status = update_data["status"]
            if new_status == TripStatus.Completed:
                vehicle = db.query(Vehicle).filter(Vehicle.id == updated_trip.vehicle_id).first()
                if vehicle:
                    vehicle.status = VehicleStatus.Available
                driver = db.query(Driver).filter(Driver.id == updated_trip.driver_id).first()
                if driver:
                    driver.status = DriverStatus.Available
                db.commit()
                
        return updated_trip

    def get_stats(self, db: Session) -> dict:
        total = db.query(Trip).count()
        draft = db.query(Trip).filter(Trip.status == TripStatus.Draft).count()
        pending = db.query(Trip).filter(Trip.status == TripStatus.Pending).count()
        dispatched = db.query(Trip).filter(Trip.status == TripStatus.Dispatched).count()
        completed = db.query(Trip).filter(Trip.status == TripStatus.Completed).count()
        cancelled = db.query(Trip).filter(Trip.status == TripStatus.Cancelled).count()
        
        return {
            "total": total,
            "draft": draft,
            "pending": pending,
            "dispatched": dispatched,
            "completed": completed,
            "cancelled": cancelled
        }

trip = CRUDTrip(Trip)

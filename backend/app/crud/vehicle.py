from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List, Tuple
from app.crud.base import CRUDBase
from app.models.vehicle import Vehicle, VehicleStatus, VehicleType, RegionEnum
from app.schemas.vehicle import VehicleCreate, VehicleUpdate

class CRUDVehicle(CRUDBase[Vehicle, VehicleCreate, VehicleUpdate]):
    def get_by_registration(self, db: Session, *, registration: str) -> Optional[Vehicle]:
        return db.query(Vehicle).filter(Vehicle.registration == registration).first()

    def get_multi_with_filters(
        self, db: Session, *, 
        status: Optional[VehicleStatus] = None,
        type: Optional[VehicleType] = None,
        region: Optional[RegionEnum] = None,
        search: Optional[str] = None,
        skip: int = 0, limit: int = 100
    ) -> Tuple[List[Vehicle], int]:
        query = db.query(Vehicle)
        
        if status:
            query = query.filter(Vehicle.status == status)
        if type:
            query = query.filter(Vehicle.type == type)
        if region:
            query = query.filter(Vehicle.region == region)
        if search:
            search_term = f"%{search}%"
            query = query.filter((Vehicle.registration.ilike(search_term)) | (Vehicle.name.ilike(search_term)))
            
        total = query.count()
        vehicles = query.offset(skip).limit(limit).all()
        return vehicles, total

    def get_stats(self, db: Session) -> dict:
        total = db.query(Vehicle).count()
        available = db.query(Vehicle).filter(Vehicle.status == VehicleStatus.Available).count()
        on_trip = db.query(Vehicle).filter(Vehicle.status == VehicleStatus.On_Trip).count()
        in_shop = db.query(Vehicle).filter(Vehicle.status == VehicleStatus.In_Shop).count()
        retired = db.query(Vehicle).filter(Vehicle.status == VehicleStatus.Retired).count()
        
        return {
            "total": total,
            "available": available,
            "onTrip": on_trip,
            "inShop": in_shop,
            "retired": retired
        }

    def remove(self, db: Session, *, id: str) -> Vehicle:
        obj = db.query(Vehicle).get(id)
        if obj:
            # Soft delete logic
            obj.status = VehicleStatus.Retired
            db.commit()
            db.refresh(obj)
        return obj

vehicle = CRUDVehicle(Vehicle)

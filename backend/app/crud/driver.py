from sqlalchemy.orm import Session
from typing import Optional, List, Tuple
from app.crud.base import CRUDBase
from app.models.driver import Driver, DriverStatus, LicenseCategory
from app.schemas.driver import DriverCreate, DriverUpdate

class CRUDDriver(CRUDBase[Driver, DriverCreate, DriverUpdate]):
    def get_by_license_number(self, db: Session, *, license_number: str) -> Optional[Driver]:
        return db.query(Driver).filter(Driver.license_number == license_number).first()

    def get_multi_with_filters(
        self, db: Session, *, 
        status: Optional[DriverStatus] = None,
        license_category: Optional[LicenseCategory] = None,
        search: Optional[str] = None,
        skip: int = 0, limit: int = 100
    ) -> Tuple[List[Driver], int]:
        query = db.query(Driver)
        
        if status:
            query = query.filter(Driver.status == status)
        if license_category:
            query = query.filter(Driver.license_category == license_category)
        if search:
            search_term = f"%{search}%"
            query = query.filter((Driver.name.ilike(search_term)) | (Driver.license_number.ilike(search_term)))
            
        total = query.count()
        drivers = query.offset(skip).limit(limit).all()
        return drivers, total
        
    def get_stats(self, db: Session) -> dict:
        total = db.query(Driver).count()
        available = db.query(Driver).filter(Driver.status == DriverStatus.Available).count()
        on_trip = db.query(Driver).filter(Driver.status == DriverStatus.On_Trip).count()
        off_duty = db.query(Driver).filter(Driver.status == DriverStatus.Off_Duty).count()
        suspended = db.query(Driver).filter(Driver.status == DriverStatus.Suspended).count()
        
        return {
            "total": total,
            "available": available,
            "onTrip": on_trip,
            "offDuty": off_duty,
            "suspended": suspended
        }

driver = CRUDDriver(Driver)

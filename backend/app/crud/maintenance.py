from sqlalchemy.orm import Session
from typing import Optional, List, Tuple
from app.crud.base import CRUDBase
from app.models.maintenance import Maintenance, MaintenanceStatus
from app.schemas.maintenance import MaintenanceCreate, MaintenanceUpdate

class CRUDMaintenance(CRUDBase[Maintenance, MaintenanceCreate, MaintenanceUpdate]):
    def get_multi_with_filters(
        self, db: Session, *, 
        status: Optional[MaintenanceStatus] = None,
        vehicle_id: Optional[str] = None,
        search: Optional[str] = None,
        skip: int = 0, limit: int = 100
    ) -> Tuple[List[Maintenance], int]:
        query = db.query(Maintenance)
        
        if status:
            query = query.filter(Maintenance.status == status)
        if vehicle_id:
            query = query.filter(Maintenance.vehicle_id == vehicle_id)
        if search:
            search_term = f"%{search}%"
            query = query.filter(Maintenance.description.ilike(search_term))
            
        total = query.count()
        records = query.offset(skip).limit(limit).all()
        return records, total

    def get_stats(self, db: Session) -> dict:
        total = db.query(Maintenance).count()
        pending = db.query(Maintenance).filter(Maintenance.status == MaintenanceStatus.Pending).count()
        in_progress = db.query(Maintenance).filter(Maintenance.status == MaintenanceStatus.In_Progress).count()
        completed = db.query(Maintenance).filter(Maintenance.status == MaintenanceStatus.Completed).count()
        
        return {
            "total": total,
            "pending": pending,
            "inProgress": in_progress,
            "completed": completed
        }

maintenance = CRUDMaintenance(Maintenance)

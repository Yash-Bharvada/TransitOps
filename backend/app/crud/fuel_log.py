from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from typing import Optional, List, Tuple
from app.crud.base import CRUDBase
from app.models.fuel_log import FuelLog
from app.schemas.fuel_log import FuelLogCreate, FuelLogUpdate

class CRUDFuelLog(CRUDBase[FuelLog, FuelLogCreate, FuelLogUpdate]):
    def get_multi_with_filters(
        self, db: Session, *, 
        vehicle_id: Optional[str] = None,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None,
        skip: int = 0, limit: int = 100
    ) -> Tuple[List[FuelLog], int]:
        query = db.query(FuelLog)
        
        if vehicle_id:
            query = query.filter(FuelLog.vehicle_id == vehicle_id)
        if date_from:
            query = query.filter(FuelLog.date >= date_from)
        if date_to:
            query = query.filter(FuelLog.date <= date_to)
            
        total = query.count()
        logs = query.offset(skip).limit(limit).all()
        return logs, total

    def get_monthly_trend(self, db: Session) -> List[dict]:
        # Last 6 months trend
        six_months_ago = date.today() - timedelta(days=180)
        
        # This is a simplified trend grouping query
        # For full postgres we might use date_trunc('month', FuelLog.date)
        results = db.query(
            func.date_trunc('month', FuelLog.date).label('month'),
            func.sum(FuelLog.liters).label('total_liters'),
            func.sum(FuelLog.cost).label('total_cost')
        ).filter(FuelLog.date >= six_months_ago)\
         .group_by(func.date_trunc('month', FuelLog.date))\
         .order_by(func.date_trunc('month', FuelLog.date)).all()
         
        return [
            {
                "month": r.month.strftime("%Y-%m") if r.month else "",
                "total_liters": float(r.total_liters) if r.total_liters else 0,
                "total_cost": float(r.total_cost) if r.total_cost else 0
            } for r in results
        ]

fuel_log = CRUDFuelLog(FuelLog)

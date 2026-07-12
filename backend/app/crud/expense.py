from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from typing import Optional, List, Tuple
from app.crud.base import CRUDBase
from app.models.expense import Expense, ExpenseType
from app.schemas.expense import ExpenseCreate, ExpenseUpdate

class CRUDExpense(CRUDBase[Expense, ExpenseCreate, ExpenseUpdate]):
    def get_multi_with_filters(
        self, db: Session, *, 
        type: Optional[ExpenseType] = None,
        associated_with: Optional[str] = None,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None,
        skip: int = 0, limit: int = 100
    ) -> Tuple[List[Expense], int]:
        query = db.query(Expense)
        
        if type:
            query = query.filter(Expense.type == type)
        if associated_with:
            query = query.filter(Expense.associated_with == associated_with)
        if date_from:
            query = query.filter(Expense.date >= date_from)
        if date_to:
            query = query.filter(Expense.date <= date_to)
            
        total = query.count()
        expenses = query.offset(skip).limit(limit).all()
        return expenses, total

    def get_breakdown(self, db: Session) -> List[dict]:
        results = db.query(
            Expense.type,
            func.sum(Expense.amount).label('total_amount')
        ).group_by(Expense.type).all()
        
        return [
            {
                "type": r.type.value,
                "amount": float(r.total_amount) if r.total_amount else 0
            } for r in results
        ]

expense = CRUDExpense(Expense)

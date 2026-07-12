from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from app.database import get_db
from app.dependencies import get_current_user, require_role
from app.models.user import User
from app.schemas.expense import ExpenseCreate, ExpenseResponse
from app.schemas import PaginatedResponse, SuccessResponse
from app.crud.expense import expense as crud_expense
from app.models.expense import ExpenseType
import math

router = APIRouter()

@router.get("", response_model=PaginatedResponse[ExpenseResponse])
def read_expenses(
    db: Session = Depends(get_db),
    type: Optional[ExpenseType] = None,
    associated_with: Optional[str] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    skip = (page - 1) * limit
    expenses, total = crud_expense.get_multi_with_filters(
        db, type=type, associated_with=associated_with, date_from=date_from, 
        date_to=date_to, skip=skip, limit=limit
    )
    return {
        "status": "success",
        "data": expenses,
        "pagination": {
            "total": total,
            "page": page,
            "limit": limit,
            "pages": math.ceil(total / limit)
        }
    }

@router.post("", response_model=SuccessResponse[ExpenseResponse], status_code=201)
def create_expense(
    expense_in: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "manager", "driver"]))
):
    new_expense = crud_expense.create(db, obj_in=expense_in)
    return {"status": "success", "data": new_expense, "message": "Expense created successfully"}

@router.get("/breakdown", response_model=SuccessResponse[list])
def get_expense_breakdown(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    breakdown = crud_expense.get_breakdown(db)
    return {"status": "success", "data": breakdown, "message": "Breakdown retrieved successfully"}

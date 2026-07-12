from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.settings import SettingsUpdate, SettingsResponse
from app.schemas import SuccessResponse
from app.crud.settings import settings as crud_settings

router = APIRouter()

@router.get("", response_model=SuccessResponse[SettingsResponse])
def get_settings(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    settings_obj = crud_settings.get_settings(db)
    return {"status": "success", "data": settings_obj, "message": "Settings retrieved successfully"}

@router.patch("", response_model=SuccessResponse[SettingsResponse])
def update_settings(
    settings_in: SettingsUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    settings_obj = crud_settings.get_settings(db)
    updated = crud_settings.update(db, db_obj=settings_obj, obj_in=settings_in)
    return {"status": "success", "data": updated, "message": "Settings updated successfully"}

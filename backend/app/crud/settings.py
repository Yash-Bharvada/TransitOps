from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.settings import Settings
from app.schemas.settings import SettingsUpdate

class CRUDSettings(CRUDBase[Settings, Settings, SettingsUpdate]):
    def get_settings(self, db: Session) -> Settings:
        settings_obj = db.query(Settings).first()
        if not settings_obj:
            settings_obj = Settings(company_name="TransitOps")
            db.add(settings_obj)
            db.commit()
            db.refresh(settings_obj)
        return settings_obj

settings = CRUDSettings(Settings)

from sqlalchemy import Column, String, Boolean, DateTime, Enum, Uuid
import enum
from datetime import datetime
import uuid
from app.database import Base

class RoleEnum(str, enum.Enum):
    admin = "admin"
    manager = "manager"
    driver = "driver"
    viewer = "viewer"

class User(Base):
    __tablename__ = "users"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.viewer, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

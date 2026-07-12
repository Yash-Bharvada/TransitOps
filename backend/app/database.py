from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# In SQLAlchemy 2.0, we use a single engine for sync
# Since the requirements use psycopg2, we'll stick to a sync engine for now,
# but FastAPI endpoints can still be async with def or async def based on needs.
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    # pool_size=10, max_overflow=20
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

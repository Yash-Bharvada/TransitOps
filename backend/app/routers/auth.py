from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.database import get_db
from app.schemas.user import UserCreate, UserResponse, Token
from app.crud.user import user as crud_user
from app.security import verify_password, create_access_token
from app.dependencies import get_current_user

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """User registration"""
    user = crud_user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    user = crud_user.create(db, obj_in=user_in)
    return user

@router.post("/login", response_model=Token)
def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    """User login"""
    user = crud_user.get_by_email(db, email=form_data.username)
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
def logout(current_user: dict = Depends(get_current_user)):
    """User logout - in stateless JWT, client deletes token"""
    return {"status": "success", "message": "Successfully logged out"}

@router.post("/refresh", response_model=Token)
def refresh(current_user: dict = Depends(get_current_user)):
    """Refresh JWT token"""
    access_token = create_access_token(subject=current_user.get("user_id"))
    return {"access_token": access_token, "token_type": "bearer"}

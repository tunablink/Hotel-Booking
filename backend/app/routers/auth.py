"""
Legacy auth router kept for backward compatibility with existing tests.
New routes live in app/api/auth.py under /api/auth prefix.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, Token
from app.core import security
from app.repositories import user_repository

router = APIRouter(prefix="/auth", tags=["Auth (Legacy)"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = user_repository.get_user_by_email(db, email=user.email)
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = security.get_password_hash(user.password)
    new_user = user_repository.create_user(
        db,
        full_name=user.full_name,
        email=user.email,
        password_hash=hashed_password,
    )
    return {"message": "User registered successfully", "email": new_user.email}


@router.post("/login", response_model=Token)
def login(credentials: UserCreate, db: Session = Depends(get_db)):
    user = user_repository.get_user_by_email(db, email=credentials.email)
    if not user or not security.verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Credentials",
        )

    access_token = security.create_access_token(data={"sub": user.email})
    from app.schemas.user import UserResponse
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )

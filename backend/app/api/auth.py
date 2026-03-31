from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, Token, UserResponse
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, summary="Register a new user")
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user account.

    - **email**: valid email address (must be unique)
    - **full_name**: user's full name
    - **password**: plain-text password (will be hashed with bcrypt)
    """
    return auth_service.register_user(db, user_data)


@router.post("/login", response_model=Token, summary="Login and get JWT token")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Authenticate with email + password. Returns a JWT access token.

    - Works with Swagger UI "Authorize" button (form data)
    - Also works with JSON body via `/api/auth/login/json`
    """
    login_data = UserLogin(email=form_data.username, password=form_data.password)
    return auth_service.authenticate_user(db, login_data)


@router.post("/login/json", response_model=Token, summary="Login with JSON body")
def login_json(login_data: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate with JSON body: `{"email": "...", "password": "..."}`.
    Use this from your frontend.
    """
    return auth_service.authenticate_user(db, login_data)

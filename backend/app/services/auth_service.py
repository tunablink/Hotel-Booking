from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.repositories import user_repository
from app.core.security import verify_password, create_access_token, get_password_hash, verify_token
from datetime import timedelta


def register_user(db: Session, user_data: UserCreate):
    db_user = user_repository.get_user_by_email(db, email=user_data.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    new_user = user_repository.create_user(db=db, user=user_data)
    return new_user


def authenticate_user(db: Session, login_data: UserLogin):
    return authenticate_user_by_identifier(db, login_data.email, login_data.password)


def authenticate_user_by_identifier(db: Session, identifier: str, password: str):
    user = user_repository.get_user_by_email_or_full_name(db, identifier=identifier)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user),
    }


def generate_password_reset_token(db: Session, email: str):
    user = user_repository.get_user_by_email(db, email=email)
    if not user:
        # Prevent email enumeration by returning success anyway, but we log or just return success
        return {"msg": "If your email is registered, you will receive a reset link."}
    
    # Generate token valid for 15 minutes
    expires_delta = timedelta(minutes=15)
    reset_token = create_access_token(data={"sub": user.email, "type": "reset"}, expires_delta=expires_delta)
    
    # Mock sending email by printing to console
    print("\n" + "="*50)
    print("MOCK EMAIL SENT")
    print(f"To: {email}")
    print(f"Subject: Password Reset Request")
    print(f"Reset Link: http://localhost:5173/reset-password?token={reset_token}")
    print("="*50 + "\n")
    
    return {"msg": "If your email is registered, you will receive a reset link."}


def reset_password(db: Session, token: str, new_password: str):
    try:
        email = verify_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )
    
    user = user_repository.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
        
    hashed_password = get_password_hash(new_password)
    user_repository.update_user_password(db, email, hashed_password)
    
    return {"msg": "Password reset successfully"}

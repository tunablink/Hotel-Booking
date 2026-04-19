from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.user import User, UserRole
from app.schemas.user import UserCreate
from app.core.security import get_password_hash


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_user_by_email_or_full_name(db: Session, identifier: str):
    normalized_identifier = identifier.strip().lower()
    return (
        db.query(User)
        .filter(
            (func.lower(User.email) == normalized_identifier)
            | (func.lower(User.full_name) == normalized_identifier)
        )
        .first()
    )


def create_user(db: Session, user: UserCreate, role: UserRole = UserRole.USER):
    """Create a user from a UserCreate schema."""
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        full_name=user.full_name,
        password_hash=hashed_password,
        role=role,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user_password(db: Session, email: str, new_password_hash: str):
    db_user = get_user_by_email(db, email)
    if not db_user:
        return None
    db_user.password_hash = new_password_hash
    db.commit()
    return db_user

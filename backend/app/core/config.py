import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Hotel Booking API"
    # Fallback to local sqlite
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./hotel_booking.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super_secret_key_12345_for_jwt")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 1 week

settings = Settings()

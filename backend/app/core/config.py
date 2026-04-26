import os

from pydantic_settings import BaseSettings, SettingsConfigDict


DEFAULT_CORS_ORIGINS = ",".join(
    [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://hotel-booking-ochre-chi.vercel.app",
        "https://hotel-booking-iukmavsq8-tunablinks-projects.vercel.app",
    ]
)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    PROJECT_NAME: str = "Hotel Booking API"
    SECRET_KEY: str = "123"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    DATABASE_URL: str = "sqlite:///./hotel.db"

    # Comma-separated frontend URLs allowed to call the API.
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", DEFAULT_CORS_ORIGINS)
    # Allows Vercel preview deployments. Set to an empty value to disable.
    CORS_ORIGIN_REGEX: str | None = os.getenv(
        "CORS_ORIGIN_REGEX",
        r"https://.*\.vercel\.app",
    )

    @property
    def cors_origin_list(self) -> list[str]:
        return [
            origin.strip().rstrip("/")
            for origin in self.CORS_ORIGINS.split(",")
            if origin.strip()
        ]


settings = Settings()

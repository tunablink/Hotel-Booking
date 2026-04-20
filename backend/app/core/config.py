from pydantic_settings import BaseSettings, SettingsConfigDict #quản lí cấu hình ứng dụng an toàn  và tự động
#pydantic -> validate dữ liệu và quản lí cấu trúc dữ liệu
class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    PROJECT_NAME: str = "Hotel Booking API"#tên project
    SECRET_KEY: str = "123"#khóa bí mật để mã hóa và giải mã token
    ALGORITHM: str = "HS256"#thuật toán mã hóa
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    DATABASE_URL: str = "sqlite:///./hotel.db"
    CORS_ORIGINS: str = "http://localhost:5173"

settings = Settings()


# quản lí cấu hình tập trung cho backend

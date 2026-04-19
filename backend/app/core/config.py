from pydantic_settings import BaseSettings #quản lí cấu hình ứng dụng an toàn  và tự động
#pydantic -> validate dữ liệu và quản lí cấu trúc dữ liệu
class Settings(BaseSettings):
    PROJECT_NAME: str = "Hotel Booking API"#tên project
    SECRET_KEY: str = "123"#khóa bí mật để mã hóa và giải mã token
    ALGORITHM: str = "HS256"#thuật toán mã hóa
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days

settings = Settings()


# quản lí cấu hình tập trung cho backend
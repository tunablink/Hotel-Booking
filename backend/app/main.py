from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, ensure_hotel_map_columns
from app.api import auth, users, hotels, rooms, bookings, admin
from app.core.config import settings
from app.core.seed import seed_data
import app.models  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    ensure_hotel_map_columns()
    seed_data()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Hotel Booking REST API — Clean Architecture",
    version="1.0.0",
    lifespan=lifespan,
)

# ===== CHỈ MỘT CORS MIDDLEWARE DUY NHẤT =====
cors_origins = [
    "https://hotel-booking-ochre-chi.vercel.app",
    "https://hotel-booking-iukmavsq8-tunablinks-projects.vercel.app",  # Thêm domain mới này
    "http://localhost:5173",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)
# ===== HẾT CORS CONFIG =====

# Routes
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(hotels.router, prefix="/api")
app.include_router(rooms.router, prefix="/api")
app.include_router(bookings.router, prefix="/api")
app.include_router(admin.router, prefix="/api")


@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "Service is healthy"}


@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the Hotel Booking API"}
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models  # noqa: F401
from app.api import admin, auth, bookings, hotels, rooms, users
from app.core.config import settings
from app.core.seed import seed_data
from app.database import Base, engine, ensure_hotel_map_columns, ensure_user_columns


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    ensure_user_columns()
    ensure_hotel_map_columns()
    seed_data()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Hotel Booking REST API - Clean Architecture",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=settings.CORS_ORIGIN_REGEX or None,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

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

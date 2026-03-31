from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api import auth, users, hotels, rooms, bookings, admin
from app.core.config import settings
from app.core.seed import seed_data
import app.models  # noqa: F401 — ensure all models are registered with Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed data
    Base.metadata.create_all(bind=engine)
    seed_data()
    yield
    # Shutdown


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Hotel Booking REST API — Clean Architecture",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Register all API routers under /api prefix ─────────────────
app.include_router(auth.router,     prefix="/api")
app.include_router(users.router,    prefix="/api")
app.include_router(hotels.router,   prefix="/api")
app.include_router(rooms.router,    prefix="/api")
app.include_router(bookings.router, prefix="/api")
app.include_router(admin.router,    prefix="/api")


# ─── Health & Root ───────────────────────────────────────────────
@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "Service is healthy"}


@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the Hotel Booking API"}

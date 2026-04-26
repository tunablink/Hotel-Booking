from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import app.models  # noqa: F401
from app.database import Base, get_db
from app.main import app

test_engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=test_engine,
)
Base.metadata.create_all(bind=test_engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def unique_email() -> str:
    return f"test-{uuid4().hex}@example.com"


def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Hotel Booking API"}


def test_register_user():
    email = unique_email()
    response = client.post(
        "/api/auth/register",
        json={
            "email": email,
            "full_name": "Test User",
            "password": "testpassword",
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["email"] == email
    assert body["full_name"] == "Test User"
    assert body["role"] == "USER"


def test_login_user():
    email = unique_email()
    password = "testpassword"
    client.post(
        "/api/auth/register",
        json={
            "email": email,
            "full_name": "Test User",
            "password": password,
        },
    )

    response = client.post(
        "/api/auth/login/json",
        json={"email": email, "password": password},
    )

    assert response.status_code == 200
    assert "access_token" in response.json()


def test_cors_allows_vercel_frontend():
    response = client.options(
        "/api/auth/register",
        headers={
            "Origin": "https://hotel-booking-ochre-chi.vercel.app",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )

    assert response.status_code == 200
    assert (
        response.headers["access-control-allow-origin"]
        == "https://hotel-booking-ochre-chi.vercel.app"
    )

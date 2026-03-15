from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Hotel Booking API"}

def test_register_user():
    response = client.post(
        "/auth/register",
        json={"username": "testuser", "email": "test@example.com", "password": "testpassword"}
    )
    if response.status_code == 400:
        assert response.json() == {"detail": "User already exists"}
    else:
        assert response.status_code == 200
        assert response.json()["username"] == "testuser"
        assert response.json()["role"] == "user"

def test_login_user():
    response = client.post(
        "/auth/login",
        data={"username": "testuser", "password": "testpassword"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

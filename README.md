# Luxe Hotel Booking Web Application

This is a complete full-stack Hotel Booking web application.
- **Backend**: Python 3.10+, FastAPI, SQLite (easily swappable to PostgreSQL)
- **Frontend**: React, TypeScript, Vite, Tailwind CSS

## Prerequisites

1. Python 3.10+
2. Node.js 18+
3. Docker & Docker Compose (optional for Docker setup)

## Setup Instructions (Windows / Powershell)

### Running Locally without Docker

**1. Setup Backend**
```powershell
cd backend

# Create Virtual Environment
python -m venv venv

# Activate Virtual Environment
.\venv\Scripts\Activate.ps1

# Install Dependencies
pip install -r requirements.txt

# Run the backend
uvicorn app.main:app --reload
```
The FastAPI backend will be running at `http://127.0.0.1:8000`. Swagger API docs are available at `http://127.0.0.1:8000/docs`.

**2. Setup Frontend**
Open a new PowerShell terminal.
```powershell
cd frontend

# Install Node modules
npm install

# Run the Vite Dev Server
npm run dev
```
The React frontend will be running at `http://localhost:5173`.

### Running with Docker

Run the entire stack using Docker in the project root:
```powershell
docker-compose up --build
```

## Features

- **Authentication**: JWT Based Auth via local storage. 
- **Database**: The app initially uses SQLite and dynamically creates a `hotel_booking.db` file. All database settings are in `backend/app/core/config.py`.
- **Roles**: Register an account normally, and update the role to `admin` in your database client if you need dashboard access.

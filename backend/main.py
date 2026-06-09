from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from database import engine, Base
import models  # noqa: F401 – ensures all models are registered before create_all

from routers import auth, departments, officers, complaints, stats

# Create all tables (safe if they already exist)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TN Grievance Portal API",
    description="Backend API for Tamil Nadu Public Grievance Redressal Portal",
    version="1.0.0",
)

# CORS – allow the Vite dev server and production origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files statically
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Register routers
app.include_router(auth.router)
app.include_router(departments.router)
app.include_router(officers.router)
app.include_router(complaints.router)
app.include_router(stats.router)


@app.get("/")
def root():
    return {"message": "TN Grievance Portal API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}

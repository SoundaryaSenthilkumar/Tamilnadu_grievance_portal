import os
import random
import string
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from auth import get_current_admin
from dotenv import load_dotenv

load_dotenv()

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(prefix="/api/complaints", tags=["Complaints"])


def generate_token() -> str:
    letters = "".join(random.choices(string.ascii_uppercase, k=5))
    digits = "".join(random.choices(string.digits, k=5))
    return letters + digits


def add_timeline(db: Session, complaint_id: int, status: str, note: str = None):
    entry = models.ComplaintTimeline(complaint_id=complaint_id, status=status, note=note)
    db.add(entry)


# ── Public: Submit complaint ───────────────────────────────────────────────────

@router.post("/", response_model=schemas.ComplaintOut, status_code=201)
async def submit_complaint(
    citizen_name: str = Form(...),
    phone: str = Form(...),
    department_id: int = Form(...),
    address_line1: str = Form(...),
    message: str = Form(...),
    constituency: Optional[str] = Form(None),
    address_line2: Optional[str] = Form(None),
    files: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db),
):
    if not phone.isdigit() or len(phone) != 10:
        raise HTTPException(status_code=422, detail="Phone must be exactly 10 digits")
    if len(message.strip()) < 10:
        raise HTTPException(status_code=422, detail="Message must be at least 10 characters")
    if not db.query(models.Department).filter(models.Department.id == department_id).first():
        raise HTTPException(status_code=404, detail="Department not found")

    token = generate_token()
    while db.query(models.Complaint).filter(models.Complaint.token == token).first():
        token = generate_token()

    complaint = models.Complaint(
        token=token,
        citizen_name=citizen_name,
        phone=phone,
        department_id=department_id,
        constituency=constituency,
        address_line1=address_line1,
        address_line2=address_line2,
        message=message,
        status="Pending",
    )
    db.add(complaint)
    db.flush()

    add_timeline(db, complaint.id, "Complaint Submitted")

    if files:
        for upload in files:
            if not upload.filename:
                continue
            contents = await upload.read()
            safe_name = f"{token}_{upload.filename}"
            save_path = os.path.join(UPLOAD_DIR, safe_name)
            with open(save_path, "wb") as f:
                f.write(contents)
            db.add(models.ComplaintAttachment(
                complaint_id=complaint.id,
                file_name=upload.filename,
                file_path=save_path,
                file_type=upload.content_type,
            ))

    db.commit()
    db.refresh(complaint)
    return complaint


# ── Public: Track complaint by token ──────────────────────────────────────────

@router.get("/track/{token}", response_model=schemas.ComplaintTrackOut)
def track_complaint(token: str, db: Session = Depends(get_db)):
    complaint = db.query(models.Complaint).filter(models.Complaint.token == token).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint


# ── Admin: List all complaints ─────────────────────────────────────────────────

@router.get("/", response_model=List[schemas.ComplaintOut])
def list_complaints(
    status: Optional[str] = None,
    department_id: Optional[int] = None,
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_admin),
):
    query = db.query(models.Complaint)
    if status:
        query = query.filter(models.Complaint.status == status)
    if department_id:
        query = query.filter(models.Complaint.department_id == department_id)
    return query.order_by(models.Complaint.submitted_at.desc()).all()


# ── Admin: Get single complaint ────────────────────────────────────────────────

@router.get("/{complaint_id}", response_model=schemas.ComplaintOut)
def get_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_admin),
):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint


# ── Admin: Assign officer ──────────────────────────────────────────────────────

@router.patch("/{complaint_id}/assign", response_model=schemas.ComplaintOut)
def assign_officer(
    complaint_id: int,
    payload: schemas.ComplaintAssign,
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_admin),
):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    officer = db.query(models.Officer).filter(models.Officer.id == payload.officer_id).first()
    if not officer:
        raise HTTPException(status_code=404, detail="Officer not found")

    complaint.assigned_officer_id = payload.officer_id
    if complaint.status == "Pending":
        complaint.status = "Under Review"
        add_timeline(db, complaint.id, "Under Review", f"Assigned to {officer.name}")
    db.commit()
    db.refresh(complaint)
    return complaint


# ── Admin: Update status ───────────────────────────────────────────────────────

@router.patch("/{complaint_id}/status", response_model=schemas.ComplaintOut)
def update_status(
    complaint_id: int,
    payload: schemas.ComplaintStatusUpdate,
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_admin),
):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint.status = payload.status
    if payload.notes:
        complaint.notes = payload.notes
    add_timeline(db, complaint.id, payload.status, payload.notes)
    db.commit()
    db.refresh(complaint)
    return complaint


# ── Public: Submit feedback ────────────────────────────────────────────────────

@router.post("/track/{token}/feedback", response_model=schemas.FeedbackOut)
def submit_feedback(token: str, payload: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    complaint = db.query(models.Complaint).filter(models.Complaint.token == token).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    if complaint.feedback:
        raise HTTPException(status_code=400, detail="Feedback already submitted")

    fb = models.Feedback(complaint_id=complaint.id, rating=payload.rating, comment=payload.comment)
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return fb

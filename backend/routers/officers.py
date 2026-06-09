from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from auth import get_current_admin

router = APIRouter(prefix="/api/officers", tags=["Officers"])


@router.get("/", response_model=List[schemas.OfficerOut])
def list_officers(db: Session = Depends(get_db), _: models.AdminUser = Depends(get_current_admin)):
    return db.query(models.Officer).order_by(models.Officer.name).all()


@router.post("/", response_model=schemas.OfficerOut)
def create_officer(
    payload: schemas.OfficerCreate,
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_admin),
):
    if db.query(models.Officer).filter(models.Officer.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    dept = db.query(models.Department).filter(models.Department.id == payload.department_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    officer = models.Officer(**payload.model_dump())
    db.add(officer)
    db.commit()
    db.refresh(officer)
    return officer


@router.put("/{officer_id}", response_model=schemas.OfficerOut)
def update_officer(
    officer_id: int,
    payload: schemas.OfficerUpdate,
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_admin),
):
    officer = db.query(models.Officer).filter(models.Officer.id == officer_id).first()
    if not officer:
        raise HTTPException(status_code=404, detail="Officer not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(officer, field, value)
    db.commit()
    db.refresh(officer)
    return officer


@router.delete("/{officer_id}")
def delete_officer(
    officer_id: int,
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_admin),
):
    officer = db.query(models.Officer).filter(models.Officer.id == officer_id).first()
    if not officer:
        raise HTTPException(status_code=404, detail="Officer not found")
    db.delete(officer)
    db.commit()
    return {"detail": "Deleted successfully"}

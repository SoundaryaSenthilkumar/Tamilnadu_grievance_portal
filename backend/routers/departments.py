from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from auth import get_current_admin

router = APIRouter(prefix="/api/departments", tags=["Departments"])


@router.get("/", response_model=List[schemas.DepartmentOut])
def list_departments(db: Session = Depends(get_db)):
    return db.query(models.Department).order_by(models.Department.name).all()


@router.post("/", response_model=schemas.DepartmentOut)
def create_department(
    payload: schemas.DepartmentCreate,
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_admin),
):
    if db.query(models.Department).filter(models.Department.code == payload.code.upper()).first():
        raise HTTPException(status_code=400, detail="Department code already exists")
    dept = models.Department(name=payload.name, code=payload.code.upper())
    db.add(dept)
    db.commit()
    db.refresh(dept)
    return dept


@router.put("/{dept_id}", response_model=schemas.DepartmentOut)
def update_department(
    dept_id: int,
    payload: schemas.DepartmentUpdate,
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_admin),
):
    dept = db.query(models.Department).filter(models.Department.id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    if payload.name is not None:
        dept.name = payload.name
    if payload.code is not None:
        dept.code = payload.code.upper()
    db.commit()
    db.refresh(dept)
    return dept


@router.delete("/{dept_id}")
def delete_department(
    dept_id: int,
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_admin),
):
    dept = db.query(models.Department).filter(models.Department.id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    db.delete(dept)
    db.commit()
    return {"detail": "Deleted successfully"}

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from auth import get_current_admin

router = APIRouter(prefix="/api/stats", tags=["Stats"])


@router.get("/", response_model=schemas.StatsOut)
def get_stats(db: Session = Depends(get_db), _: models.AdminUser = Depends(get_current_admin)):
    total = db.query(models.Complaint).count()
    pending = db.query(models.Complaint).filter(models.Complaint.status == "Pending").count()
    in_progress = db.query(models.Complaint).filter(
        models.Complaint.status.in_(["Under Review", "In Progress", "Action Taken"])
    ).count()
    resolved = db.query(models.Complaint).filter(
        models.Complaint.status.in_(["Resolved", "Closed"])
    ).count()
    depts = db.query(models.Department).count()
    officers = db.query(models.Officer).count()

    return schemas.StatsOut(
        total_complaints=total,
        pending_complaints=pending,
        in_progress_complaints=in_progress,
        resolved_complaints=resolved,
        departments_count=depts,
        officers_count=officers,
    )

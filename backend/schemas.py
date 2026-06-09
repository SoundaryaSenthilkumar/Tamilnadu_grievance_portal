from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime


# ── Department ──────────────────────────────────────────────────────────────

class DepartmentBase(BaseModel):
    name: str
    code: str

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None

class DepartmentOut(DepartmentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ── Officer ──────────────────────────────────────────────────────────────────

class OfficerBase(BaseModel):
    name: str
    department_id: int
    email: str
    phone: str

class OfficerCreate(OfficerBase):
    pass

class OfficerUpdate(BaseModel):
    name: Optional[str] = None
    department_id: Optional[int] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class OfficerOut(OfficerBase):
    id: int
    department: DepartmentOut
    created_at: datetime

    class Config:
        from_attributes = True


# ── Complaint ─────────────────────────────────────────────────────────────────

class ComplaintCreate(BaseModel):
    citizen_name: str
    phone: str
    department_id: int
    constituency: Optional[str] = None
    address_line1: str
    address_line2: Optional[str] = None
    message: str

    @field_validator("phone")
    @classmethod
    def phone_must_be_10_digits(cls, v):
        if not v.isdigit() or len(v) != 10:
            raise ValueError("Phone must be exactly 10 digits")
        return v

class ComplaintAssign(BaseModel):
    officer_id: int

class ComplaintStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

class TimelineOut(BaseModel):
    status: str
    note: Optional[str]
    changed_at: datetime

    class Config:
        from_attributes = True

class AttachmentOut(BaseModel):
    id: int
    file_name: str
    file_path: str
    file_type: Optional[str]

    class Config:
        from_attributes = True

class ComplaintOut(BaseModel):
    id: int
    token: str
    citizen_name: str
    phone: str
    department: DepartmentOut
    constituency: Optional[str]
    address_line1: str
    address_line2: Optional[str]
    message: str
    status: str
    assigned_officer: Optional[OfficerOut]
    notes: Optional[str]
    submitted_at: datetime
    updated_at: datetime
    attachments: List[AttachmentOut] = []
    timeline: List[TimelineOut] = []

    class Config:
        from_attributes = True

class ComplaintTrackOut(BaseModel):
    token: str
    citizen_name: str
    department: DepartmentOut
    constituency: Optional[str]
    status: str
    assigned_officer: Optional[OfficerOut]
    notes: Optional[str]
    submitted_at: datetime
    timeline: List[TimelineOut] = []

    class Config:
        from_attributes = True


# ── Feedback ──────────────────────────────────────────────────────────────────

class FeedbackCreate(BaseModel):
    rating: int
    comment: Optional[str] = None

    @field_validator("rating")
    @classmethod
    def rating_range(cls, v):
        if not 1 <= v <= 5:
            raise ValueError("Rating must be between 1 and 5")
        return v

class FeedbackOut(FeedbackCreate):
    id: int
    complaint_id: int
    submitted_at: datetime

    class Config:
        from_attributes = True


# ── Auth ──────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str


# ── Stats ─────────────────────────────────────────────────────────────────────

class StatsOut(BaseModel):
    total_complaints: int
    pending_complaints: int
    in_progress_complaints: int
    resolved_complaints: int
    departments_count: int
    officers_count: int

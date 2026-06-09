from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    code = Column(String(30), nullable=False, unique=True)
    created_at = Column(DateTime, default=func.now())

    officers = relationship("Officer", back_populates="department")
    complaints = relationship("Complaint", back_populates="department")


class Officer(Base):
    __tablename__ = "officers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    email = Column(String(150), nullable=False, unique=True)
    phone = Column(String(15), nullable=False)
    created_at = Column(DateTime, default=func.now())

    department = relationship("Department", back_populates="officers")
    complaints = relationship("Complaint", back_populates="assigned_officer")


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False, unique=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum("admin", "officer"), nullable=False, default="admin")
    officer_id = Column(Integer, ForeignKey("officers.id"), nullable=True)
    created_at = Column(DateTime, default=func.now())


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String(20), nullable=False, unique=True, index=True)
    citizen_name = Column(String(150), nullable=False)
    phone = Column(String(15), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    constituency = Column(String(100))
    address_line1 = Column(String(255), nullable=False)
    address_line2 = Column(String(100))
    message = Column(Text, nullable=False)
    status = Column(
        Enum("Pending", "Submitted", "Under Review", "In Progress", "Action Taken", "Resolved", "Closed"),
        default="Pending",
        nullable=False,
    )
    assigned_officer_id = Column(Integer, ForeignKey("officers.id"), nullable=True)
    notes = Column(Text)
    submitted_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    department = relationship("Department", back_populates="complaints")
    assigned_officer = relationship("Officer", back_populates="complaints")
    attachments = relationship("ComplaintAttachment", back_populates="complaint", cascade="all, delete-orphan")
    timeline = relationship("ComplaintTimeline", back_populates="complaint", cascade="all, delete-orphan", order_by="ComplaintTimeline.changed_at")
    feedback = relationship("Feedback", back_populates="complaint", uselist=False, cascade="all, delete-orphan")


class ComplaintAttachment(Base):
    __tablename__ = "complaint_attachments"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(100))
    uploaded_at = Column(DateTime, default=func.now())

    complaint = relationship("Complaint", back_populates="attachments")


class ComplaintTimeline(Base):
    __tablename__ = "complaint_timeline"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    status = Column(String(100), nullable=False)
    note = Column(Text)
    changed_at = Column(DateTime, default=func.now())

    complaint = relationship("Complaint", back_populates="timeline")


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False, unique=True)
    rating = Column(Integer)
    comment = Column(Text)
    submitted_at = Column(DateTime, default=func.now())

    complaint = relationship("Complaint", back_populates="feedback")

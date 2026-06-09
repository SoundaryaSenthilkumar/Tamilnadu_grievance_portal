"""
Run this script to create or reset the admin user.
Usage: python create_admin.py
"""
from database import SessionLocal
from models import AdminUser
from auth import hash_password

db = SessionLocal()

username = "admin"
password = "admin123"

existing = db.query(AdminUser).filter(AdminUser.username == username).first()

if existing:
    existing.hashed_password = hash_password(password)
    db.commit()
    print(f"Password reset for user '{username}'")
else:
    user = AdminUser(
        username=username,
        hashed_password=hash_password(password),
        role="admin"
    )
    db.add(user)
    db.commit()
    print(f"Admin user '{username}' created successfully")

db.close()
print("Done! Login with username='admin' password='admin123'")

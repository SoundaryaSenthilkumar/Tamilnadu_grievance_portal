# TN Grievance Portal — Backend

FastAPI + MySQL backend for the Tamil Nadu Public Grievance Redressal Portal.

## Tech Stack
- **Python** 3.10+
- **FastAPI** — REST API framework
- **SQLAlchemy** — ORM
- **PyMySQL** — MySQL driver
- **Passlib / bcrypt** — password hashing
- **python-jose** — JWT tokens
- **python-multipart** — file uploads

## Setup

### 1. Create MySQL database
```sql
mysql -u root -p < init_db.sql
```

### 2. Configure environment
```bash
copy .env.example .env
# Edit .env and set DB_PASSWORD and SECRET_KEY
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API docs available at: http://localhost:8000/docs

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Admin login → JWT token |
| GET | `/api/departments/` | No | List departments |
| POST | `/api/departments/` | Admin | Create department |
| PUT | `/api/departments/{id}` | Admin | Update department |
| DELETE | `/api/departments/{id}` | Admin | Delete department |
| GET | `/api/officers/` | Admin | List officers |
| POST | `/api/officers/` | Admin | Create officer |
| PUT | `/api/officers/{id}` | Admin | Update officer |
| DELETE | `/api/officers/{id}` | Admin | Delete officer |
| POST | `/api/complaints/` | No | Submit complaint (multipart) |
| GET | `/api/complaints/track/{token}` | No | Track by token |
| GET | `/api/complaints/` | Admin | List all complaints |
| PATCH | `/api/complaints/{id}/assign` | Admin | Assign officer |
| PATCH | `/api/complaints/{id}/status` | Admin | Update status |
| POST | `/api/complaints/track/{token}/feedback` | No | Submit feedback |
| GET | `/api/stats/` | Admin | Dashboard stats |

## Default Admin Credentials
- **Username:** `admin`
- **Password:** `admin123`

> Change the password immediately after first login in production.

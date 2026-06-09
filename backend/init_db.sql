-- TN Grievance Portal - MySQL Database Setup
-- Run this script to initialize the database

CREATE DATABASE IF NOT EXISTS tn_grievance_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tn_grievance_db;

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Officers table
CREATE TABLE IF NOT EXISTS officers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    department_id INT NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'officer') NOT NULL DEFAULT 'admin',
    officer_id INT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (officer_id) REFERENCES officers(id) ON DELETE SET NULL
);

-- Complaints table
CREATE TABLE IF NOT EXISTS complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(20) NOT NULL UNIQUE,
    citizen_name VARCHAR(150) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    department_id INT NOT NULL,
    constituency VARCHAR(100),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(100),
    message TEXT NOT NULL,
    status ENUM('Pending','Submitted','Under Review','In Progress','Action Taken','Resolved','Closed') NOT NULL DEFAULT 'Pending',
    assigned_officer_id INT NULL,
    notes TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (assigned_officer_id) REFERENCES officers(id) ON DELETE SET NULL
);

-- Complaint attachments table
CREATE TABLE IF NOT EXISTS complaint_attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

-- Complaint timeline table
CREATE TABLE IF NOT EXISTS complaint_timeline (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id INT NOT NULL,
    status VARCHAR(100) NOT NULL,
    note TEXT,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

-- Seed: Departments
INSERT IGNORE INTO departments (name, code) VALUES
('Revenue Department', 'REV'),
('Public Works Department', 'PWD'),
('Health Department', 'HEALTH'),
('Education Department', 'EDU'),
('Police Department', 'POLICE'),
('Water Supply', 'WATER'),
('Electricity Board', 'ELEC'),
('Transport Department', 'TRANS'),
('Municipal Services', 'MUNI');

-- Seed: Officers
INSERT IGNORE INTO officers (name, department_id, email, phone) VALUES
('Rajesh Kumar', 1, 'rajesh@tn.gov.in', '9876543210'),
('Priya Sharma', 2, 'priya@tn.gov.in', '9876543211'),
('Suresh Babu', 3, 'suresh@tn.gov.in', '9876543212'),
('Lakshmi Devi', 4, 'lakshmi@tn.gov.in', '9876543213'),
('Murugan M', 5, 'murugan@tn.gov.in', '9876543214');

-- Seed: Admin user (password: admin123)
-- bcrypt hash of 'admin123'
INSERT IGNORE INTO admin_users (username, hashed_password, role) VALUES
('admin', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin');

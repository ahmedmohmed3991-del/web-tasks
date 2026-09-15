# MediCare — Hospital Management & Clinical Care Platform
## Complete Project Plan & Architecture Specification

---

## 1. Project Overview

### Project Name
**MediCare — Cloud Hospital Management & Clinical Care Portal**

### Problem Statement
Traditional healthcare facilities often suffer from fragmented communications, physical paperwork bottlenecks, appointment scheduling conflicts, and delayed access to patient medical histories. Patients face long waiting times and lack immediate access to diagnostic test reports. Doctors lack an integrated digital workspace to review lab scans, issue digital prescriptions, and view appointment queues. Hospital administrators struggle with manual staff scheduling and lack a centralized dashboard for operational metrics.

### Main Purpose
To provide a secure, role-governed, centralized web portal connecting hospital administrators, certified doctors, and patients. The platform unifies appointment booking, role-restricted medical records, file uploads for lab diagnostics and doctor credentials, and automated clinical workflows.

### Target Users
1. **Hospital Administrators**: Hospital executives and medical registrars overseeing staffing, department allocations, and compliance.
2. **Doctors / Medical Specialists**: Physicians managing clinical appointments, patient medical records, diagnostic reviews, and digital prescriptions.
3. **Patients**: Individuals seeking healthcare consultations, booking appointments, uploading medical history/lab results, and viewing doctor diagnoses.

---

## 2. Users and Roles (Role-Based Access Control)

| Role Name | Description | Key Permissions & System Capabilities |
| :--- | :--- | :--- |
| **System Admin** | Hospital administration & management | • Full access to Admin Dashboard<br>• Manage system users (activate/suspend accounts)<br>• Verify and approve Doctor licenses/credentials<br>• Create and configure Hospital Departments<br>• View institutional audit logs and aggregate statistics<br>• System-wide backup and record archiving |
| **Doctor** | Verified healthcare practitioners | • View personal clinical dashboard and daily appointment queue<br>• Accept, reschedule, or cancel patient appointments<br>• Create, read, and update Patient Medical Records and Diagnoses<br>• Issue and manage Digital Prescriptions<br>• Review uploaded patient diagnostic scans and laboratory reports<br>• Configure weekly availability slots and consultation fees |
| **Patient** | Registered healthcare consumers | • Search doctors by department, specialty, and availability<br>• Book, reschedule, and cancel own appointments<br>• View personal medical records and doctor prescriptions<br>• Upload personal diagnostic scans and previous test reports<br>• Manage personal profile, emergency contact, and billing history |

---

## 3. Main Features Specification

### 3.1 Authentication
- **User Registration**:
  - *Patient Signup*: Name, email, phone, date of birth, password.
  - *Doctor Onboarding*: Professional credentials, department, medical license number, certificate upload (account held in `Pending Approval` state until Admin verification).
- **Secure Login**:
  - Email and password authentication with `bcrypt` (work factor 12) password hashing.
  - Multi-session JWT tokens transmitted via HTTP-only, secure, SameSite cookies.
- **Account Verification & Password Recovery**:
  - Time-limited token email verification for new accounts.
  - Secure password reset flow using single-use cryptographic tokens.
- **Session Management**:
  - Automatic token expiration (15-minute access token, 7-day refresh token).
  - Explicit logout with token invalidation.

### 3.2 Authorization (RBAC) & Protected Routes
- **Role-Based Middleware**:
  - Every API endpoint and view route evaluates the authenticated user's role before granting access.
- **Access Control Matrix**:
  - `/admin/*` $\to$ Strictly restricted to `System Admin`.
  - `/doctor/*` $\to$ Strictly restricted to verified `Doctor` accounts.
  - `/patient/*` $\to$ Strictly restricted to `Patient` accounts.
  - `/api/records/:patientId` $\to$ Accessible by the specific Patient, treating Doctor, and System Admin.
- **Data Isolation**: Patients cannot query or view records belonging to other patients under any circumstances.

### 3.3 CRUD Operations Specification

The system manages four core business resources:

#### Resource 1: Appointments
- **Create**: Patients create appointments by selecting department, doctor, date, and available time slot.
- **Read**:
  - Patients view their upcoming and past appointment history.
  - Doctors view their scheduled daily/weekly appointments.
  - Admins view hospital-wide appointment schedules and room bookings.
- **Update**:
  - Patients can reschedule appointments up to 24 hours prior to appointment time.
  - Doctors can update appointment status (`Scheduled`, `In-Progress`, `Completed`, `Cancelled`).
- **Delete**: Patients or Doctors can cancel appointments. Admins can permanently purge cancelled records older than retention policies.

#### Resource 2: Medical Records & Clinical Diagnoses
- **Create**: Doctors create medical record entries following consultations, containing symptoms, clinical observations, vital signs, and diagnostic findings.
- **Read**: Patients view their completed medical records; attending doctors review patient history during active consultations.
- **Update**: Treating doctors can append follow-up notes or amend clinical observations within a 48-hour revision window.
- **Delete / Archive**: Only Admins can archive or soft-delete medical records upon legal request or compliance requirements (preventing accidental loss).

#### Resource 3: Digital Prescriptions
- **Create**: Doctors issue digital prescriptions linked to an appointment, specifying medication name, dosage, frequency, duration, and pharmacy instructions.
- **Read**: Patients view and download printable PDF prescriptions; doctors view past medication history.
- **Update**: Doctors can adjust dosages or renew active prescriptions.
- **Delete**: Doctors or Admins can cancel or void invalid/discontinued prescriptions.

#### Resource 4: Hospital Departments & Doctor Schedules
- **Create**: Admins create hospital departments (e.g. Cardiology, Neurology) and assign doctors.
- **Read**: Publicly browsable by all users to locate specialists.
- **Update**: Admins update department details; doctors update their weekly working hours and consultation availability.
- **Delete**: Admins can decommission departments or remove obsolete schedule blocks.

---

## 4. Image & File Upload Specification

File uploads are strictly validated on MIME type, magic bytes, and file size, and stored in secure cloud object storage (e.g., S3/GCS) with private ACLs and signed URLs for access.

| Upload Category | File Purpose | Allowed MIME Types | Max File Size | Authorized Uploaders | Storage & Security Rules |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Diagnostic Lab Reports & Scans** | MRI, CT scans, X-rays, blood test results | `application/pdf`<br>`image/jpeg`<br>`image/png` | **10 MB** | • Patient<br>• Doctor | Encrypted at rest (AES-256). Accessible only via short-lived signed URLs generated for treating doctor/patient. |
| **Doctor Medical Credentials** | Medical degree, state license, board certification | `application/pdf`<br>`image/jpeg`<br>`image/png` | **5 MB** | • Doctor (during onboarding) | Restricted to Admin review; shielded from public access. |
| **User Profile Pictures** | Visual user identification in portal headers | `image/jpeg`<br>`image/png`<br>`image/webp` | **2 MB** | • All authenticated users | Public CDN asset; compressed and sanitized of EXIF metadata upon upload. |

---

## 5. Database Architecture & Relational Schema

### Database Engine
**PostgreSQL 16** (Relational Database Management System ensuring ACID compliance for critical health records).

### Core Entities & Attributes

1. **`users`**
   - `id` (UUID, Primary Key)
   - `name` (VARCHAR 100)
   - `email` (VARCHAR 255, Unique, Indexed)
   - `password_hash` (VARCHAR 255)
   - `role` (ENUM: `'ADMIN'`, `'DOCTOR'`, `'PATIENT'`)
   - `avatar_url` (VARCHAR 500, Nullable)
   - `created_at` (TIMESTAMP WITH TIME ZONE)
   - `updated_at` (TIMESTAMP WITH TIME ZONE)

2. **`doctor_profiles`**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key $\to$ `users.id`, Unique)
   - `department_id` (UUID, Foreign Key $\to$ `departments.id`)
   - `license_number` (VARCHAR 50, Unique)
   - `specialization` (VARCHAR 100)
   - `verification_status` (ENUM: `'PENDING'`, `'VERIFIED'`, `'REJECTED'`)
   - `credential_file_url` (VARCHAR 500)
   - `consultation_fee` (NUMERIC(10, 2))

3. **`patient_profiles`**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key $\to$ `users.id`, Unique)
   - `date_of_birth` (DATE)
   - `blood_group` (VARCHAR 5)
   - `emergency_contact_phone` (VARCHAR 20)
   - `allergies` (TEXT, Nullable)

4. **`appointments`**
   - `id` (UUID, Primary Key)
   - `patient_id` (UUID, Foreign Key $\to$ `patient_profiles.id`)
   - `doctor_id` (UUID, Foreign Key $\to$ `doctor_profiles.id`)
   - `appointment_date` (TIMESTAMP WITH TIME ZONE)
   - `status` (ENUM: `'PENDING'`, `'CONFIRMED'`, `'COMPLETED'`, `'CANCELLED'`)
   - `reason_for_visit` (TEXT)
   - `created_at` (TIMESTAMP WITH TIME ZONE)

5. **`medical_records`**
   - `id` (UUID, Primary Key)
   - `appointment_id` (UUID, Foreign Key $\to$ `appointments.id`, Unique)
   - `patient_id` (UUID, Foreign Key $\to$ `patient_profiles.id`)
   - `doctor_id` (UUID, Foreign Key $\to$ `doctor_profiles.id`)
   - `diagnosis` (TEXT)
   - `vital_signs` (JSONB: `{ bp: "120/80", pulse: 72, temp: 98.6 }`)
   - `clinical_notes` (TEXT)
   - `created_at` (TIMESTAMP WITH TIME ZONE)

6. **`prescriptions`**
   - `id` (UUID, Primary Key)
   - `record_id` (UUID, Foreign Key $\to$ `medical_records.id`)
   - `medication_name` (VARCHAR 150)
   - `dosage` (VARCHAR 50)
   - `frequency` (VARCHAR 50)
   - `duration_days` (INTEGER)
   - `instructions` (TEXT)

7. **`medical_attachments`**
   - `id` (UUID, Primary Key)
   - `patient_id` (UUID, Foreign Key $\to$ `patient_profiles.id`)
   - `record_id` (UUID, Foreign Key $\to$ `medical_records.id`, Nullable)
   - `file_name` (VARCHAR 255)
   - `file_url` (VARCHAR 500)
   - `file_type` (VARCHAR 50)
   - `file_size_bytes` (BIGINT)
   - `uploaded_by_user_id` (UUID, Foreign Key $\to$ `users.id`)
   - `uploaded_at` (TIMESTAMP WITH TIME ZONE)

---

## 6. UI Design & Screen Blueprints

### UI Design Tool Status
> **Design Tool URL**: `[PENDING / LOCAL SPECIFICATION]`  
> *(Per Session 10 guidelines, this project provides a complete structural design blueprint and wireframe layout below rather than fabricating an unverified external Figma/Canva link).*

---

### Screen 1: Public Home & Landing Page (`/`)
- **Layout**: Sticky header with logo, primary navigation (`Departments`, `Doctors`, `About`, `Portal Login`), hero banner with quick CTA ("Book Appointment"), specialist highlight cards, and hospital footer.
- **Components**:
  - `HeroSection`: Headline, medical illustration, "Find a Doctor" search bar.
  - `DepartmentGrid`: Cards displaying icon, department name, specialist count, and "Explore" button.
  - `DoctorShowcase`: Carousel showcasing verified specialists with ratings and next available dates.
  - `Footer`: Emergency hotline, operating hours, accreditation badges, legal links.

### Screen 2: Authentication Pages (`/login` & `/register`)
- **Layout**: Centered split card (left side: hospital branding and security badges; right side: interactive form).
- **Components**:
  - `LoginForm`: Tabs for `Patient` and `Staff (Doctor/Admin)`, Email input, Password input with visibility toggle, "Remember Me", "Forgot Password?" link, primary "Sign In" button.
  - `PatientRegisterForm`: Full Name, Email, Phone, Date of Birth, Password & Confirmation, Terms checkbox, primary "Create Patient Account" button.
  - `DoctorOnboardForm`: Medical license number, department dropdown, credential document upload dropzone, submit button.

### Screen 3: Patient Portal Dashboard (`/patient/dashboard`)
- **Layout**: Two-column layout with sidebar navigation (Home, Appointments, Medical Records, Prescriptions, Lab Uploads, Settings) and main content canvas.
- **Components**:
  - `QuickStatsBanner`: Next upcoming appointment card, recent diagnosis badge, unread message alerts.
  - `UpcomingAppointmentsTable`: Doctor name, specialty, date/time, status badge, action buttons ("Reschedule", "Cancel", "Join Teleconsultation").
  - `PrescriptionListCard`: Active medications with dosage reminders and "Download PDF" button.
  - `UploadReportCTA`: Quick button opening file upload modal for new lab results.

### Screen 4: Appointment Booking Wizard (`/patient/book-appointment`)
- **Layout**: 3-step progressive wizard interface with step indicator header.
- **Components**:
  - `Step 1 (Select Department & Specialist)`: Search filter by specialty, list of doctor profile cards with consultation fees.
  - `Step 2 (Select Date & Slot)`: Interactive calendar picker showing available green time slots; unavailable slots disabled in grey.
  - `Step 3 (Visit Reason & Confirmation)`: Textarea for symptoms/reason, file attachment drag-and-drop for prior test results, summary review box, "Confirm Booking" button.

### Screen 5: Doctor Clinical Workspace (`/doctor/dashboard`)
- **Layout**: Responsive grid featuring daily schedule, patient queue, and clinical action center.
- **Components**:
  - `DailyQueueTable`: Today's scheduled consultations sorted chronologically, patient name, age, appointment status, and "Start Consultation" CTA.
  - `PatientSummaryDrawer`: Sliding right-side drawer showing selected patient's historical vitals, previous diagnoses, and attached lab PDFs.
  - `AvailabilityToggle`: Quick toggle to set status as `Available`, `In Consultation`, or `Off Duty`.

### Screen 6: Medical Record & Diagnosis Entry Screen (`/doctor/consultation/:id`)
- **Layout**: Split-view consultation interface (left side: patient history & uploaded test documents viewer; right side: active clinical documentation form).
- **Components**:
  - `VitalsInputForm`: Inputs for Blood Pressure, Heart Rate, Body Temperature, Respiratory Rate.
  - `DiagnosisEditor`: Rich textarea for clinical assessment and findings.
  - `PrescriptionBuilder`: Dynamic form row repeater allowing doctor to add multiple medications (Drug name, Dosage, Frequency, Duration, Refill instructions).
  - `AttachFileControl`: Upload field to attach official hospital lab results to the record.
  - `ActionFooter`: "Save as Draft" and "Finalize & Issue to Patient" buttons.

### Screen 7: Admin Control Center (`/admin/dashboard`)
- **Layout**: High-density operational dashboard with top summary metrics cards and full-width management data tables.
- **Components**:
  - `MetricCards`: Total Registered Patients, Active Doctors, Today's Consultations, Pending Doctor Verifications.
  - `DoctorVerificationTable`: Table of newly registered doctors with status `Pending`, showing uploaded license document preview button, "Approve" button (green), and "Reject" button (red).
  - `DepartmentManager`: Add/edit modal for hospital departments and duty rosters.

---

## 7. Submission Checklist & Validation

- [x] **Project Idea Selected**: Hospital Management System (MediCare Portal) chosen from official Session 10 examples.
- [x] **CRUD Operations**: Comprehensive CRUD matrices detailed for Appointments, Medical Records, Prescriptions, and Departments.
- [x] **Authentication**: User signup, doctor verification flow, bcrypt password hashing, and JWT session handling defined.
- [x] **Authorization & RBAC**: Specific roles (Admin, Doctor, Patient) with distinct permission tables and protected routes.
- [x] **File/Image Upload**: Detailed upload matrix with MIME types, size restrictions, and role permissions for diagnostics, doctor licenses, and avatars.
- [x] **Database Management**: Complete PostgreSQL schema with primary/foreign keys, JSONB fields, and indices.
- [x] **UI Design & Screens**: 7 distinct UI screens specified with layouts, components, buttons, forms, and navigation.
- [x] **Design Link Quality Rule**: Marked as `[PENDING / LOCAL SPECIFICATION]` without fabricating fictional URLs.

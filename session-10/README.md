# SESSION 10 — Project Idea Research & Planning

This directory contains the complete research, technical planning, and architectural design specification for **MediCare — Cloud Hospital Management & Clinical Care Portal**, fulfilling all requirements for Session 10.

---

## 📁 Session Deliverables

```
session-10/
├── README.md           # Guide to Session 10 documentation
└── project-plan.md     # Full architectural specification & project plan
```

---

## 🏥 Selected Project Idea: MediCare Hospital Management System

Selected from the official Session 10 project examples (**Hospital Management System**), this platform provides a unified clinical and administrative web portal that supports:

1. **Different User Roles**:
   - `System Admin`: Overall administration, user verification, department creation, audit logging.
   - `Doctor`: Schedule configuration, patient consultations, diagnoses, prescription writing, lab reviews.
   - `Patient`: Doctor searches, appointment booking, viewing medical histories, downloading prescriptions, uploading lab results.
2. **Authentication**:
   - Secure registration for patients and onboarding verification for physicians.
   - Bcrypt password hashing and HTTP-only JWT session management.
3. **Authorization & RBAC**:
   - Strict role-based access control protecting administrative, doctor, and patient routes.
4. **Full CRUD Operations**:
   - *Appointments*: Create, Read, Reschedule (Update), Cancel (Delete).
   - *Medical Records & Diagnoses*: Create clinical notes, Read history, Append observations, Archive records.
   - *Digital Prescriptions*: Issue prescriptions, Read dosages, Update frequencies, Invalidate expired orders.
   - *Departments & Schedules*: Manage hospital departments and specialist working shifts.
5. **Image / File Upload**:
   - Diagnostic reports and scans (PDF/JPG, up to 10MB) uploaded by patients and doctors.
   - Doctor medical licensing certificates (PDF/PNG, up to 5MB) uploaded for administrative review.
   - User profile avatars (JPG/PNG/WebP, up to 2MB).
6. **Database Management**:
   - Normalized PostgreSQL relational schema specifying 7 core entities with primary keys, foreign key constraints, and JSONB diagnostic payloads.
7. **UI Design & Screen Blueprints**:
   - Complete wireframe specifications, components, buttons, tables, forms, and navigation flows for 7 distinct UI screens.
   - *UI Tool Link Status*: Marked as `[PENDING / LOCAL SPECIFICATION]` in adherence to guidelines avoiding fabricated URLs.

---

## 📖 How to Navigate `project-plan.md`

Open [`project-plan.md`](./project-plan.md) to review the complete submission organized into seven core sections:
- **Section 1: Project Overview**: Problem definition, target audiences, and primary goals.
- **Section 2: Users and Roles**: Role-based permissions matrix.
- **Section 3: Main Features**: Authentication, Authorization, and detailed CRUD resource tables.
- **Section 4: Image & File Upload**: File types, size restrictions, and authorization policies.
- **Section 5: Database Architecture**: Complete PostgreSQL relational tables and schema definitions.
- **Section 6: UI Design & Screen Blueprints**: Detailed component and wireframe breakdowns for all 7 application pages.
- **Section 7: Submission Checklist**: Verification of all project criteria.

# SESSION 11 — Create Your First Module (Doctor Entity)

Implementation of **Session 11: Create Your First Module** based directly on our final graduation project plan from Session 10 (**MediCare — Cloud Hospital Management & Clinical Care Platform**).

This backend module is built with **Node.js**, **Express**, **MongoDB**, and **Mongoose**, providing a complete, production-ready REST API for managing the **Doctor** entity.

---

## 📁 Project Structure

```
session-11/
├── config/
│   └── db.js                      # MongoDB connection using Mongoose
├── controllers/
│   └── doctor.controller.js       # Business logic for Doctor CRUD
├── models/
│   └── doctor.model.js            # Mongoose schema and model definition
├── routes/
│   └── doctor.routes.js           # Express router endpoints
├── test/
│   └── doctor.test.js             # Automated integration test suite
├── index.js                       # Express server entry point
├── package.json                   # Dependencies and scripts
└── README.md                      # Documentation
```

---

## 🏥 1. Entity Chosen & Project Context

### Selected Entity: `Doctor`
In accordance with the Session 11 specification:
> *"The entity MUST actually exist in the selected project idea... Do not choose one arbitrarily if the repository already defines the project."*

Our repository's Session 10 final project plan defines the **MediCare Hospital Management System**, which centers on the **Doctor** entity (`doctor_profiles`). Doctors represent the primary medical service providers responsible for consultations, medical record authoring, and prescription issuance.

---

## 📋 2. Mongoose Model Fields

The `Doctor` model (`models/doctor.model.js`) contains 7 fields adhering to schema validation and timestamps:

| Field Name | Type | Constraints | Description |
| :--- | :---: | :---: | :--- |
| `name` | `String` | Required, Trim, Min 2 chars | Full name of the medical practitioner |
| `email` | `String` | Required, Unique, Lowercase, Regex | Professional contact email address |
| `specialization` | `String` | Required, Trim | Area of expertise (e.g., Cardiology, Neurology) |
| `department` | `String` | Required, Trim | Hospital department (e.g., Internal Medicine) |
| `licenseNumber` | `String` | Required, Unique, Uppercase, Trim | State/Board Medical Practice License ID |
| `consultationFee` | `Number` | Required, Min 0 | Standard consultation visit fee in USD |
| `available` | `Boolean` | Default: `true` | Real-time on-duty consultation availability |
| `createdAt` | `Date` | Automatic timestamp | Record creation time |
| `updatedAt` | `Date` | Automatic timestamp | Record last modification time |

---

## 🌐 3. REST Routes Summary

| Method | Endpoint | Description | Success Status | Error Statuses |
| :--- | :--- | :--- | :---: | :---: |
| **POST** | `/doctors` | Create a new Doctor | `201 Created` | `400 Bad Request`, `500` |
| **GET** | `/doctors` | Retrieve all Doctors | `200 OK` | `500 Internal Server Error` |
| **GET** | `/doctors/:id` | Retrieve single Doctor by MongoDB ID | `200 OK` | `400 Bad Request`, `404 Not Found` |
| **PATCH** | `/doctors/:id` | Update specific Doctor fields | `200 OK` | `400 Bad Request`, `404 Not Found` |
| **DELETE** | `/doctors/:id` | Delete a Doctor by ID | `200 OK` | `400 Bad Request`, `404 Not Found` |

---

## 🛠️ 4. How to Run Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Active MongoDB instance (e.g. running locally on port 27017 or a MongoDB Atlas URI)

### Installation & Execution
```bash
# 1. Navigate to session-11 directory
cd session-11

# 2. Install dependencies
npm install

# 3. Start the API server
npm start
```
The server will start listening on `http://localhost:5000`.

---

## 🗄️ 5. MongoDB Configuration

By default, the application connects to:
```text
mongodb://127.0.0.1:27017/medicare_db
```
To customize the connection string, set the `MONGODB_URI` environment variable:
```bash
# Windows PowerShell
$env:MONGODB_URI="mongodb://localhost:27017/my_database"
npm start

# Linux / macOS
export MONGODB_URI="mongodb://localhost:27017/my_database"
npm start
```

---

## 📡 6. Sample Request & Response Payloads (Postman Testing)

### 1. POST /doctors
**Request Body:**
```json
{
  "name": "Dr. Gregory House",
  "email": "house@medicare.com",
  "specialization": "Diagnostic Medicine",
  "department": "Internal Medicine",
  "licenseNumber": "MED-HOUSE-9001",
  "consultationFee": 250,
  "available": true
}
```
**Response (HTTP 201 Created):**
```json
{
  "success": true,
  "message": "Doctor created successfully",
  "data": {
    "_id": "673752e892b1cf56b820914a",
    "name": "Dr. Gregory House",
    "email": "house@medicare.com",
    "specialization": "Diagnostic Medicine",
    "department": "Internal Medicine",
    "licenseNumber": "MED-HOUSE-9001",
    "consultationFee": 250,
    "available": true,
    "createdAt": "2026-09-15T22:10:00.000Z",
    "updatedAt": "2026-09-15T22:10:00.000Z"
  }
}
```

### 2. GET /doctors
**Response (HTTP 200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "673752e892b1cf56b820914a",
      "name": "Dr. Gregory House",
      "email": "house@medicare.com",
      "specialization": "Diagnostic Medicine",
      "department": "Internal Medicine",
      "licenseNumber": "MED-HOUSE-9001",
      "consultationFee": 250,
      "available": true
    }
  ]
}
```

### 3. GET /doctors/:id
**Response (HTTP 200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "673752e892b1cf56b820914a",
    "name": "Dr. Gregory House",
    "email": "house@medicare.com",
    "specialization": "Diagnostic Medicine",
    "department": "Internal Medicine",
    "licenseNumber": "MED-HOUSE-9001",
    "consultationFee": 250,
    "available": true
  }
}
```

### 4. PATCH /doctors/:id
**Request Body:**
```json
{
  "consultationFee": 320,
  "available": false
}
```
**Response (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Doctor updated successfully",
  "data": {
    "_id": "673752e892b1cf56b820914a",
    "name": "Dr. Gregory House",
    "email": "house@medicare.com",
    "consultationFee": 320,
    "available": false
  }
}
```

### 5. DELETE /doctors/:id
**Response (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Doctor deleted successfully",
  "data": {
    "_id": "673752e892b1cf56b820914a",
    "name": "Dr. Gregory House"
  }
}
```

---

## 🧪 7. Automated Testing & Verification

Run the automated integration test suite:
```bash
npm test
# or: node test/doctor.test.js
```

### Tests Performed
1. **POST /doctors**: Creates document, verifies HTTP 201 Created and auto-generated MongoDB `_id`.
2. **Database Persistence**: Directly queries MongoDB using `Doctor.findById()` to verify record is stored.
3. **GET /doctors**: Verifies HTTP 200 OK and array retrieval.
4. **GET /doctors/:id**: Retrieves created doctor document by ID.
5. **PATCH /doctors/:id**: Updates `consultationFee` to $320 and `available` to `false`, verifies HTTP 200 and database persistence.
6. **DELETE /doctors/:id**: Deletes document, verifies HTTP 200 OK and confirms removal from MongoDB.
7. **404 Not Found Handling**: Queries deleted ID, verifies HTTP 404 response.
8. **Invalid ID Format**: Queries malformed ID string, verifies HTTP 400 Bad Request.
9. **Validation Error Handling**: Attempts `POST` with missing required fields, verifies HTTP 400 Validation Error.

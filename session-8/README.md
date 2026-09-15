# SESSION 8 — Library Book Management REST API

A native REST API built using **only Node.js built-in modules** to manage a library's books collection stored in a local JSON file (`books.json`). This project strictly avoids external API frameworks such as Express or Fastify.

---

## 📁 Exact File Structure

```
session-8/
├── books.json      # Persistent JSON data store
├── server.js       # Native Node.js HTTP REST API server
├── test.js         # Automated HTTP test harness
└── README.md       # Documentation
```

---

## 📦 Allowed Built-in Modules

This project exclusively uses Node.js standard runtime modules:
- **`http`**: Server initialization (`http.createServer`), request streaming, status codes, and HTTP headers.
- **`fs`**: Reading from and writing to `books.json`.
- **`path`**: Resolving safe file paths across operating systems.

> **Note**: No external dependencies (Express, Fastify, nodemon, body-parser) are installed or used.

---

## 📖 Book Data Structure

Each book record stored in `books.json` adheres to the following structure:

```json
{
  "id": 1,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 450,
  "available": true
}
```

The `id` is generated automatically by the server during creation.

---

## 🌐 API Endpoints & Specification

| Method | Endpoint | Description | Success Status | Error Statuses |
| :--- | :--- | :--- | :---: | :---: |
| **GET** | `/books` | Retrieve all library books | `200 OK` | `500 Internal Server Error` |
| **POST** | `/books` | Add a new book (auto-generates `id`) | `201 Created` | `400 Bad Request`, `500` |
| **DELETE** | `/books/:id` | Remove a book by its numeric ID | `200 OK` | `404 Not Found`, `500` |

---

## 📡 Example Requests & Responses

### 1. GET /books
Retrieve all books currently stored in the library.

**Request:**
```http
GET /books HTTP/1.1
Host: localhost:3000
```

**Response (HTTP 200 OK):**
```json
[
  {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "price": 450,
    "available": true
  },
  {
    "id": 2,
    "title": "The Pragmatic Programmer",
    "author": "Andrew Hunt, David Thomas",
    "price": 400,
    "available": true
  }
]
```

---

### 2. POST /books
Add a new book to the library.

**Request:**
```http
POST /books HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "title": "JavaScript: The Good Parts",
  "author": "Douglas Crockford",
  "price": 300,
  "available": true
}
```

**Response (HTTP 201 Created):**
```json
{
  "id": 3,
  "title": "JavaScript: The Good Parts",
  "author": "Douglas Crockford",
  "price": 300,
  "available": true
}
```

---

### 3. DELETE /books/:id
Delete an existing book by its ID.

**Request:**
```http
DELETE /books/3 HTTP/1.1
Host: localhost:3000
```

**Response (HTTP 200 OK):**
```json
{
  "message": "Book deleted successfully",
  "book": {
    "id": 3,
    "title": "JavaScript: The Good Parts",
    "author": "Douglas Crockford",
    "price": 300,
    "available": true
  }
}
```

**Error Response if ID does not exist (HTTP 404 Not Found):**
```json
{
  "error": "Book with ID 999 not found"
}
```

---

### 4. Malformed JSON Body
**Request:**
```http
POST /books HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{ invalid json
```

**Response (HTTP 400 Bad Request):**
```json
{
  "error": "Invalid JSON in request body"
}
```

---

### 5. Invalid Route
**Request:**
```http
GET /authors HTTP/1.1
Host: localhost:3000
```

**Response (HTTP 404 Not Found):**
```json
{
  "error": "Cannot GET /authors. Route not found."
}
```

---

## 🚀 How to Start the Server

Start the API server on port 3000:

```bash
node session-8/server.js
```

The server will output:
```text
Library Book Management API listening on http://localhost:3000
```

---

## 🧪 Testing Performed

Execute the automated test suite:

```bash
node session-8/test.js
```

The test runner starts the server, executes HTTP requests across all scenarios, and verifies:
1. **GET `/books`**: Validates HTTP 200 OK and array retrieval.
2. **POST `/books`**: Posts the exact assignment payload (`"JavaScript: The Good Parts"`), validates HTTP 201 Created and auto-assigned `id: 3`.
3. **File Persistence (POST)**: Reads `books.json` from disk to confirm the book was written.
4. **DELETE `/books/:id`**: Deletes the added book, validates HTTP 200 OK.
5. **File Persistence (DELETE)**: Verifies `books.json` on disk no longer contains the deleted book.
6. **DELETE Non-existent ID**: Sends `DELETE /books/9999`, validates HTTP 404 Not Found.
7. **Malformed JSON Payload**: Sends malformed JSON to `POST /books`, validates HTTP 400 Bad Request.
8. **Invalid Route**: Requests `GET /unknown-endpoint`, validates HTTP 404 Not Found.

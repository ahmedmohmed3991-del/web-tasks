/**
 * SESSION 8 — Library Book Management API
 *
 * A lightweight REST API built strictly using Node.js built-in modules:
 * - http: Server creation and request/response lifecycle
 * - fs: Synchronous/Asynchronous file system operations
 * - path: Resolving local file paths
 *
 * REST Endpoints:
 * - GET    /books     -> Return all stored books (200 OK)
 * - POST   /books     -> Add a new book with auto-generated ID (201 Created)
 * - DELETE /books/:id -> Remove a book by ID (200 OK / 404 Not Found)
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const DATA_FILE_PATH = path.join(__dirname, "books.json");

/**
 * Reads books from books.json
 * @returns {Array<Object>}
 */
function readBooksFromFile() {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      fs.writeFileSync(DATA_FILE_PATH, "[]", "utf-8");
      return [];
    }
    const data = fs.readFileSync(DATA_FILE_PATH, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    throw new Error(`File read error: ${error.message}`);
  }
}

/**
 * Writes books array to books.json
 * @param {Array<Object>} books
 */
function writeBooksToFile(books) {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(books, null, 2), "utf-8");
  } catch (error) {
    throw new Error(`File write error: ${error.message}`);
  }
}

/**
 * Helper to parse incoming JSON request body
 * @param {http.IncomingMessage} req
 * @returns {Promise<Object>}
 */
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      if (!body || body.trim().length === 0) {
        resolve({});
        return;
      }
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(new Error("Invalid JSON in request body"));
      }
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
}

/**
 * Helper to send JSON responses
 * @param {http.ServerResponse} res
 * @param {number} statusCode
 * @param {Object} payload
 */
function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

// Create HTTP Server
const server = http.createServer(async (req, res) => {
  const method = req.method;
  const url = req.url;

  try {
    // -------------------------------------------------------------
    // ENDPOINT 1: GET /books
    // -------------------------------------------------------------
    if (method === "GET" && url === "/books") {
      const books = readBooksFromFile();
      sendJson(res, 200, books);
      return;
    }

    // -------------------------------------------------------------
    // ENDPOINT 2: POST /books
    // -------------------------------------------------------------
    if (method === "POST" && url === "/books") {
      let body;
      try {
        body = await parseRequestBody(req);
      } catch (err) {
        sendJson(res, 400, { error: err.message });
        return;
      }

      const { title, author, price, available } = body;

      // Validate required fields
      if (
        !title || typeof title !== "string" ||
        !author || typeof author !== "string" ||
        typeof price !== "number" || isNaN(price) || price < 0
      ) {
        sendJson(res, 400, {
          error: "Missing or invalid book fields. 'title' (string), 'author' (string), and 'price' (positive number) are required."
        });
        return;
      }

      const books = readBooksFromFile();

      // Automatically generate a unique incremental ID
      const newId = books.length > 0 ? Math.max(...books.map((b) => Number(b.id) || 0)) + 1 : 1;

      const newBook = {
        id: newId,
        title: title.trim(),
        author: author.trim(),
        price,
        available: available !== undefined ? Boolean(available) : true
      };

      books.push(newBook);
      writeBooksToFile(books);

      sendJson(res, 201, newBook);
      return;
    }

    // -------------------------------------------------------------
    // ENDPOINT 3: DELETE /books/:id
    // -------------------------------------------------------------
    const deleteMatch = url.match(/^\/books\/(\d+)$/);
    if (method === "DELETE" && deleteMatch) {
      const bookId = Number(deleteMatch[1]);
      const books = readBooksFromFile();

      const index = books.findIndex((b) => b.id === bookId);

      if (index === -1) {
        sendJson(res, 404, { error: `Book with ID ${bookId} not found` });
        return;
      }

      const [removedBook] = books.splice(index, 1);
      writeBooksToFile(books);

      sendJson(res, 200, {
        message: "Book deleted successfully",
        book: removedBook
      });
      return;
    }

    // -------------------------------------------------------------
    // ERROR HANDLING: Invalid Route (404 Not Found)
    // -------------------------------------------------------------
    sendJson(res, 404, { error: `Cannot ${method} ${url}. Route not found.` });
  } catch (err) {
    console.error(`[Server Error] ${err.message}`);
    sendJson(res, 500, { error: "Internal Server Error", details: err.message });
  }
});

// Start listening if run directly
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Library Book Management API listening on http://localhost:${PORT}`);
  });
}

module.exports = {
  server,
  readBooksFromFile,
  writeBooksToFile,
  DATA_FILE_PATH
};

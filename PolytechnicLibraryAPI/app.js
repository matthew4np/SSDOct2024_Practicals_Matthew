const express = require("express");
const booksController = require("./controllers/booksController");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser"); // Import body-parser
const validateBook = require("./middlewares/validateBook");
const verifyJWT = require("./middlewares/verifyJWT");
const staticMiddleware = express.static("public"); // Path to the public folder
const usersController = require("./controllers/usersController");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling
app.use(staticMiddleware); // Mount the static middleware

// JWT Setup
app.use((req, res, next) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', (err, decode) => {
          if (err) req.user = undefined;
          req.user = decode;
          next();
      })
  } else  {
      req.user = undefined;
      next();
  }
});



// Routes for GET requests (replace with appropriate routes for update and delete later)
// app.get("/books/:id", booksController.getBookById);
// app.post("/books", validateBook, booksController.createBook); // POST for creating books (can handle JSON data)
// app.put("/books/:id", validateBook, booksController.updateBook);
// app.delete("/books/:id", booksController.deleteBook); // DELETE for deleting books

app.get("/books", verifyJWT, booksController.getAllBooks); // keep this
app.put("/books/:id/availability", verifyJWT, booksController.updateBook); // keep this


// app.post("/users", usersController.createUser); // Create user
// app.get("/users/search", usersController.searchUsers);
// app.get("/users/with-books", usersController.getUsersWithBooks);
// app.put("/users/:id", usersController.updateUser); // Update user
// app.delete("/users/:id", usersController.deleteUser); // Delete user

app.get("/users/:id", usersController.getUserById); // Get user by ID
app.get("/users", usersController.getAllUsers); // Get all users
app.post("/users", usersController.registerUser); // Create user with authentication
app.post("/users/login", usersController.login); // Login user to retrieve the authorization token



app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }

  console.log(`Server listening on port ${port}`);
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});
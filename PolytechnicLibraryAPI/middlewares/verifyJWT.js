const jwt = require("jsonwebtoken");
const Joi = require("joi");

function verifyJWT(req, res, next) {
  const token =
    req.headers.authorization && req.headers.authorization.split("Bearer ")[1];
  console.log(req.headers.authorization.split("Bearer ")[1]);
  if (!token) {
    return res.status(401).json({ token, message: "Unauthorized verifyJWT" });
  }

  jwt.verify(token, "RESTFULAPIs", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Check user role for authorization (replace with your logic)
    const authorizedRoles = {
      "/books": ["member", "Librarian"], // Anyone can view books
      "/books/[0-9]+/availability": ["Librarian"], // Only librarians can update availability
    };

    const requestedEndpoint = req.url;
    const userRole = decoded.role;

    const authorizedRole = Object.entries(authorizedRoles).find(
      ([endpoint, roles]) => {
        const regex = new RegExp(`^${endpoint}$`); // Create RegExp from endpoint
        return regex.test(requestedEndpoint) && roles.includes(userRole);
      }
    );

    if (!authorizedRole) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded; // Attach decoded user information to the request object
    next();
  });
}

module.exports = verifyJWT;
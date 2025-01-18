const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function login(req, res) {
  const { username, password } = req.body;

  try {
    // Validate user credentials
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password with hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = {
      id: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, "your_secret_key", { expiresIn: "3600s" }); // Expires in 1 hour

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const getAllUsers = async (req, res) => {
    try {
      const users = await User.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send("500 Internal Server Error getAllUsers");
    }
  };
  
  const getUserById = async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
      const user = await User.getUserById(userId);
      if (!user) {
        return res.status(404).send("getUserById not found");
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("500 Internal Server Error getUserById");
    }
  };
  
  const createUser = async (req, res) => {
    const newUser = req.body;
    try {
      const createdUser = await User.createUser(newUser);
      res.status(201).json(createdUser);
    } catch (error) {
      console.error(error);
      res.status(500).send("500 Internal Server Error createUser");
    }
  };
  
  const updateUser = async (req, res) => {
    const userId = parseInt(req.params.id);
    const newUserData = req.body;
  
    try {
      const updatedUser = await User.updateUser(userId, newUserData);
      if (!updatedUser) {
        return res.status(404).send("updateUser not found");
      }
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).send("500 Internal Server Error updateUser");
    }
  };
  
  const deleteUser = async (req, res) => {
    const userId = parseInt(req.params.id);
  
    try {
      const success = await User.deleteUser(userId);
      if (!success) {
        return res.status(404).send("deleteUser not found");
      }
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).send("500 Internal Server Error deleteUser");
    }
  };

  async function searchUsers(req, res) {
    const searchTerm = req.query.searchTerm; // Extract search term from query params

    try {
      const users = await User.searchUsers(searchTerm);
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "500 Internal Server Error searchUsers" });
    };
  }
  
  async function getUsersWithBooks(req, res) {

    try {
      const users = await User.getUsersWithBooks();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching users with books" });
    }
  }


module.exports = {
    login,
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    searchUsers,
    getUsersWithBooks
  };
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Filter the users array for any user with the same username
  let userWithSameUsername = users.filter((user) => user.username === username);

  // Return true if no user with the same username exists, otherwise return false
  return userWithSameUsername.length === 0;
}

const authenticatedUser = (username, password) => {
  // Filter the users array for a user with the given username and password
  let validUsers = users.filter((user) => user.username === username && user.password === password);
  // Return true if a valid user is found, otherwise return false
  return validUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  // Retrieve the username and password from the request body
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Authenticate the user
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate a JWT token with the username as payload
  let accessToken = jwt.sign({ data: username }, "access", { expiresIn: 60 * 60 });

  // Store the token in the session
  req.session.authorization = {
    accessToken
  };

  return res.status(200).json({ message: "User successfully logged in" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

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
    accessToken, username
  };

  req.session.save((err) => {
    if (err) {
      return res.status(500).json({ message: "Error saving session" });
    }
    return res.status(200).json({ message: "User successfully logged in", token: accessToken });
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Retrieve the isbn parameter from the request URL, the review from the request query, and the username from the session
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.data;

  console.log(`Received review for ISBN ${isbn} from user ${username}: ${review}`);

  // Check if the review is provided
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or update the review for the book
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Retrieve the isbn parameter from the request URL and the username from the session
  const isbn = req.params.isbn;
  const username = req.user.data;

  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has a review for the book
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  // Delete the user's review for the book
  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

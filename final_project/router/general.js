const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  // Retrieve the username and password from the request body
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username is already taken
  if (!isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username: username, password: password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  // Using a promise to simulate asynchronous operation for fetching all books
  var getAllBooksPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books.length === 0) {
        reject("No books available");
      } else {
        resolve(books);
      }
    }, 1000);
  });

  try {
    const allBooks = await getAllBooksPromise;
    // Send JSON response with formatted books data
    res.send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Retrieve the isbn parameter from the request URL and send the corresponding book details
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn], null, 4));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  // Retrieve the author parameter from the request URL and send the corresponding book details
  const author = req.params.author;
  const filteredBooks = Object.values(books).filter(book => book.author === author);
  res.send(JSON.stringify(filteredBooks, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  // Retrieve the title parameter from the request URL and send the corresponding book details
  const title = req.params.title;
  const filteredBooks = Object.values(books).filter(book => book.title === title);
  res.send(JSON.stringify(filteredBooks, null, 4));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  // Retrieve the isbn parameter from the request URL and send the corresponding book review
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;

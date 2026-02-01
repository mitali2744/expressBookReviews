const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getAllBooks = () => {
  return books;
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Missing username or password" });
  } else if (isValid(username)) {
    return res.status(404).json({ message: "user already exists." });
  } else {
    users.push({ username: username, password: password });
    return res
      .status(200)
      .json({ message: "User successfully registered.  Please login." });
  }
});
// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    try{
      const allBooks = await getAllBooks();
      return res.status(200).json(allBooks);

    }catch{
      return res.status(500).json({message: "Error retrieving book list"});
    }


});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const targetIsbn = parseInt(req.params.isbn);
  const targetBook = await books[targetIsbn];
  if (targetBook) {
    return res.status(200).json(targetBook);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const targetAuthor = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === targetAuthor);
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({message: "Books by this author not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const targetTitle = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title === targetTitle);
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({message: "Books with this title not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  const targetIsbn = parseInt(req.params.isbn);
  const targetBook = await books[targetIsbn];
  if (targetBook) {
    return res.status(200).json(targetBook.reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;

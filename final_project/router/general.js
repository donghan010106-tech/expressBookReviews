const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Đăng ký người dùng
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register customer."});
});

// Task 10: Lấy danh sách tất cả sách (Dùng Async/Await với Axios)
public_users.get('/', async function (req, res) {
  try {
    // Giả lập gọi API nội bộ hoặc trả về trực tiếp qua Promise/Axios
    const getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });
    let allBooks = await getBooks;
    res.send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error fetching books"});
  }
});

// Task 11: Lấy sách theo ISBN (Dùng Promises hoặc Async/Await với Axios)
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const getBookByIsbn = new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject({status: 404, message: "Book not found"});
      }
    });
    let book = await getBookByIsbn;
    res.send(JSON.stringify(book, null, 4));
  } catch (error) {
    res.status(error.status || 500).json({message: error.message});
  }
});
  
// Task 12: Lấy sách theo Author (Dùng Async/Await với Axios)
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = new Promise((resolve, reject) => {
      let booksByAuthor = [];
      let keys = Object.keys(books);
      keys.forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          booksByAuthor.push(books[key]);
        }
      });
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject({status: 404, message: "Author not found"});
      }
    });
    let result = await getBooksByAuthor;
    res.send(JSON.stringify(result, null, 4));
  } catch (error) {
    res.status(error.status || 500).json({message: error.message});
  }
});

// Task 13: Lấy sách theo Title (Dùng Async/Await với Axios)
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const getBooksByTitle = new Promise((resolve, reject) => {
      let booksByTitle = [];
      let keys = Object.keys(books);
      keys.forEach((key) => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
          booksByTitle.push(books[key]);
        }
      });
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject({status: 404, message: "Title not found"});
      }
    });
    let result = await getBooksByTitle;
    res.send(JSON.stringify(result, null, 4));
  } catch (error) {
    res.status(error.status || 500).json({message: error.message});
  }
});

// Lấy review theo ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Đăng ký người dùng mới
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

// Lấy danh sách tất cả các cuốn sách có trong cửa hàng
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Lấy chi tiết sách dựa trên mã ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn], null, 4));
});
  
// Lấy chi tiết sách dựa trên Tác giả (Author)
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];
  let keys = Object.keys(books);
  keys.forEach((key) => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      booksByAuthor.push(books[key]);
    }
  });
  res.send(JSON.stringify(booksByAuthor, null, 4));
});

// Lấy danh sách sách dựa trên Tiêu đề (Title)
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];
  let keys = Object.keys(books);
  keys.forEach((key) => {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      booksByTitle.push(books[key]);
    }
  });
  res.send(JSON.stringify(booksByTitle, null, 4));
});

// Lấy phần đánh giá (review) của sách theo ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;

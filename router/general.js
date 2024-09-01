const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//task #6
public_users.post("/register", (req, res) => {
  //Write your code here
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ msg: "Error create user " });
  }

  const filterUser = users.filter((user) => user.name === name);

  if (filterUser.length > 0) {
    return res.status(400).json({ msg: `User already exists` });
  }

  const newUser = {
    name: name,
    password: password,
  };

  users.push(newUser);

  res.status(201).json(users);
});

//task #1
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

//task #2
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = Number(req.params.isbn);

  if (!isbn) {
    return res.status(404).json({ msg: "Error Type Code ISBN" });
  }

  if (isbn > 10) {
    return res.status(404).json({ msg: "number ISBN not found" });
  }

  res.status(201).json(books[isbn]);
});

//task #3
public_users.get("/author/:author", function (req, res) {
  const { author } = req.params;

  const data = Object.values(books);

  const filterAuthor = data.filter(
    (aut) => aut.author.toLowerCase() === author.toLowerCase()
  );

  if (filterAuthor < 1) {
    res.status(404).json({ msg: `${author} Not Found` });
  }

  res.status(201).json(filterAuthor);
});

//task #4
public_users.get("/title/:title", function (req, res) {
  const { title } = req.params;

  const data = Object.values(books);

  const filterTitle = data.filter(
    (tit) => tit.title.toLowerCase() === title.toLowerCase()
  );

  if (filterTitle < 1) {
    res.status(404).json({ msg: `${title} Not Found` });
  }

  res.status(201).json(filterTitle);
});

//task #5
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;

  if (!isbn || isbn > 10 || isbn < 1) {
    res.status(404).json({ msg: `Book with ${isbn} review not found` });
  }

  const data = Object.values(books[isbn].reviews);


  res.status(201).json({
    review: `${data < 1 ? "0 reviews" : data}`,
  });
});

module.exports.general = public_users;

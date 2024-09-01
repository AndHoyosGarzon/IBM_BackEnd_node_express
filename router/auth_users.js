const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const filterUserName = users.filter((user) => user.name === username);
  if (filterUserName.length < 1) {
    return false;
  }
  return true;
};

const authenticatedUser = (username, password) => {
  //write code to check if username and password match the one we have in records.
  const filterUser = users.filter((user) => {
    if (user.name === username && user.password === password) {
      return user;
    }
  });

  return filterUser.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { name, password } = req.body;

  if (!isValid(name)) {
    return res.status(404).json({ msg: "User not found" });
  }

  if (!authenticatedUser(name, password)) {
    return res.status(404).json({ msg: "username or password error" });
  }

  const token = jwt.sign({ name, expiresIn: "1h" }, password);

  const userToken = {
    name: name,
    password: password,
    token: token,
  };

  const findUser = users.findIndex(
    (user) => user.name === name && user.password === password
  );

  if (findUser > -1) {
    users.splice(findUser, 1);
    users.push(userToken);
  }

  res.status(201).json(userToken);
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = Number(req.params.isbn);

  if (!isbn) {
    return res.status(404).json({ msg: "Book with isbn not found" });
  }

  const { name, review } = req.body;

  const filterUser = users.findIndex((user) => user.name === name);

  if (filterUser === -1) {
    return res.status(404).json({ msg: "Username not found" });
  }

  const rev = [];

  books[isbn]["reviews"] = { user: name, rev: rev };

  rev.push(review);

  return res.status(201).json(books[isbn]);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  try {
    const { isbn } = req.params;
    const { name, review } = req.body;

    if (!isbn || !name) {
      return res.status(404).json({ msg: "Book or User  not found" });
    }

    if (name) {
      const filterRev = books[isbn]["reviews"].rev.findIndex(
        (rev) => rev === review
      );

      if (filterRev === -1) {
        return res.status(404).json({ msg: `Review not found in database` });
      }

      if (filterRev !== -1) {
        books[isbn]["reviews"].rev.splice(filterRev, 1);
        return res.status(200).json({
          msg: `The user ${name} Delete review in book`,
        });
      }
    }
  } catch (error) {
    return res.status(400).json({ msg: "Error in request" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

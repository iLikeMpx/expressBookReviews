const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "Customer succcessfully registered! Now you can log in."});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Wrap the asynchronous operation in a Promise
  const getAllBooks = new Promise((resolve, reject) => {
    const allBooks = books;
    if (allBooks) {
      resolve(allBooks);
    } else {
      reject(new Error('No books found'));
    }
  });

  // Use the Promise to handle the request
  getAllBooks
    .then((allBooks) => {
      res.send(JSON.stringify(allBooks, null, 4));
    })
    .catch((error) => {
      res.status(404).send(error.message);
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    // Wrap the asynchronous operation in a Promise
    const getBook = new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error(`Book with ISBN ${isbn} not found`));
      }
    });
  
    // Use the Promise to handle the request
    getBook
      .then((book) => {
        res.send(JSON.stringify(book, null, 4));
      })
      .catch((error) => {
        res.status(404).send(error.message);
      });
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {

    // Wrap the asynchronous operation in a Promise
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const author = req.params.author;
      let result = { "booksbyauthor": [] };
      for (let isbn in books) {
        let hit = {};
        if (books[isbn].author === author) {
          hit["isbn"] = isbn;
          hit["title"] = books[isbn].title;
          hit["reviews"] = books[isbn].reviews;
          result["booksbyauthor"].push(hit);
        }
      }
      if (result["booksbyauthor"].length > 0) {
        resolve(result);
      } else {
        reject(new Error(`No books found for author '${author}'`));
      }
    });
  
    // Use the Promise to handle the request
    getBooksByAuthor
      .then((result) => {
        res.send(JSON.stringify(result, null, 4));
      })
      .catch((error) => {
        res.status(404).send(error.message);
      });
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {

    // Wrap the asynchronous operation in a Promise
    const getBooksByTitle = new Promise((resolve, reject) => {
      const title = req.params.title;
      let result = { "booksbyauthor": [] };
      for (let isbn in books) {
        let hit = {};
        if (books[isbn].title === title) {
          hit["isbn"] = isbn;
          hit["author"] = books[isbn].author;
          hit["reviews"] = books[isbn].reviews;
          result["booksbyauthor"].push(hit);
        }
      }
      if (result["booksbyauthor"].length > 0) {
        resolve(result);
      } else {
        reject(new Error(`No books found with title '${title}'`));
      }
    });
  
    // Use the Promise to handle the request
    getBooksByTitle
      .then((result) => {
        res.send(JSON.stringify(result, null, 4));
      })
      .catch((error) => {
        res.status(404).send(error.message);
      });
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let reviews = books[isbn].reviews;
  res.send(JSON.stringify(reviews,null,4));
});

module.exports.general = public_users;

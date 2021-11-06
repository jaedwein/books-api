const express = require("express");
const helmet = require("helmet");
const http = require("http");
var compression = require("compression");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors());

const books = [
  { title: "Java Programming", id: 1 },
  { title: "C# Programming", id: 2 },
  { title: "Python Programming", id: 3 },
];

app.get("/", (req, res) => {
  console.log("Hola ....");
  res.send("Hola Mundo");
});

app.get("/api/books", (req, res) => {
  res.send(books);
});

app.get("/api/books/:id", (req, res) => {
  res.send(books.find((x) => x.id === parseInt(req.params.id)));
});

app.post("/api/books/addBook", (req, res) => {
  const book = {
    id: books.length + 1,
    title: req.body.title,
  };
  books.push(book);
  res.send(book);
});

app.put("/api/books/:id", (req, res) => {
  const book = books.find((x) => x.id === parseInt(req.params.id));
  if (!book) res.status(404).send("Libro no encontrado");

  book.title = req.body.title;
  res.send(book);
});

app.delete("/api/books/:id", (req, res) => {
  const book = books.find((x) => x.id === parseInt(req.params.id));
  if (!book) {
    res.status(404).send("Libro no encontrado");
  } else {
    //const index = books.indexOf(book);
    //console.log(index);
    //const deletedBook = books.splice(index, 1);
    res.send(books.splice(books.indexOf(book), 1));
  }
});

app.listen(8080);

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

app.listen(8080);

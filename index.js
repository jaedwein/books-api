const express = require("express");

const app = express();

app.use(express.json);

const books = [
  { title: "Java Programming", id: 1 },
  { title: "C# Programming", id: 2 },
  { title: "Python Programming", id: 3 },
];

app.get("/", (req, res) => {
  res.send("Hola Mundo");
});

app.listen(8080);

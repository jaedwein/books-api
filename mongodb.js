const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const app = express();
app.use(express.json());

var database;

app.get("/", (_req, res) => {
  res.send("Bienvenido a MongoDB API");
});

app.get("/api/books", (_req, res) => {
  database
    .collection("books")
    .find({})
    .toArray((error, result) => {
      if (error) {
        throw error;
      } else {
        res.send(result);
      }
    });
});

app.delete("/api/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  database.collection("books").deleteOne({ id: id }, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

app.get("/api/books/:id", (req, res) => {
  database
    .collection("books")
    .find({ id: parseInt(req.params.id) })
    .toArray((error = r, result) => {
      if (error) {
        throw error;
      } else {
        res.send(result);
      }
    });
});

app.put("/api/books/:id", (req, res) => {
  const title = req.body.title;
  const id = parseInt(req.params.id);
  console.log(id);
  database
    .collection("books")
    .updateOne(
      { id: id },
      { $set: { title: title } },
      { upsert: false },
      (err, result) => {
        console.log(err);
        console.log(result);
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(result);
        }
      }
    );
});

app.post("/api/books/addBook", (req, res) => {
  //const result = database.collection("books").find().sort({ id: -1 }).limit(1);
  const result = database.collection("books").aggregate([
    {
      $group: { _id: null, max: { $max: "$id" } },
    },
  ]);
  console.log(result);
  result.forEach((obj) => {
    console.log(obj);
    if (obj) {
      let book = {
        id: obj.max + 1,
        title: req.body.title,
      };
      database.collection("books").insertOne(book, (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          res.send(result);
        }
      });
    }
  });
});

app.listen(8080, () => {
  MongoClient.connect(
    "mongodb://127.0.0.1:27017/?compressors=zlib",
    { useNewUrlParser: true },
    (error, result) => {
      if (error) {
        throw error;
      } else {
        database = result.db("booksdb");
      }
    }
  );
});

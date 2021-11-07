const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const swaggerui = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const app = express();
app.use(express.json());

var database;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node JS API project for MongoDB",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["./mongodb.js"],
};

const swaggerSpecs = swaggerJSDoc(options);
app.use("/api-docs", swaggerui.serve, swaggerui.setup(swaggerSpecs));

/**
 * @swagger
 *  components:
 *      schemas:
 *          Book:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                  title:
 *                      type: string
 *          DeleteResult:
 *              type: object
 *              properties:
 *                  acknowledged:
 *                      type: boolean
 *                  deletedCount:
 *                      type: integer
 */

/**
 * @swagger
 * /:
 *  get:
 *      summary: this API is used to ckeck if the method is working or not.
 *      description: this API is used to ckeck if the method is working or not.
 *      responses:
 *          200:
 *              description: to test get method
 */

app.get("/", (_req, res) => {
  res.send("Bienvenido a MongoDB API");
});

/**
 * @swagger
 * /api/books/:
 *  get:
 *      summary: this API is used to get all books
 *      description: this API is used to get all books
 *
 *      responses:
 *          200:
 *              description: returns all books
 *              content:
 */

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

/**
 * @swagger
 * /api/books/{id}:
 *  delete:
 *      summary: this API is used to delete a book
 *      description: this API is used to delete a book
 *      parameters:
 *          - in : path
 *            name: id
 *            required: true
 *            description: id number of book to delete
 *            schema:
 *              type: integer
 
 *      responses:
 *          200:
 *              description: returns a book
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#components/schemas/DeleteResult'
 *          500:
 *              description: error
 */

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

/**
 * @swagger
 * /api/books/{id}:
 *  get:
 *      summary: this API is used to get a book given its id
 *      description: this API is used to get a book given its id
 *      parameters:
 *          - in : path
 *            name: id
 *            required: true
 *            description: id number of book to search
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: returns a book
 *              content:
 */

app.get("/api/books/:id", (req, res) => {
  database
    .collection("books")
    .find({ id: parseInt(req.params.id) })
    .toArray((error, result) => {
      if (error) {
        throw error;
      } else {
        res.send(result);
      }
    });
});

/**
 * @swagger
 * /api/books/{id}:
 *  put:
 *      summary: this API is used to update a book's title
 *      description: this API is used to update a book's title
 *      requestBody:
 *            required: true
 *            description: the title of the book to update
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#components/schemas/Book'
 *      parameters:
 *          - in : path
 *            name: id
 *            required: true
 *            description: id number of book to update
 *            schema:
 *              type: integer
 
 *      responses:
 *          200:
 *              description: returns a book
 *              content:
 *          500:
 *              description: error
 */

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

/**
 * @swagger
 * /api/books/addBook:
 *  post:
 *      summary: this API is used to get a book given its id
 *      description: this API is used to get a book given its id
 *      requestBody:
 *            required: true
 *            description: the title of the book to add
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#components/schemas/Book'
 *      responses:
 *          200:
 *              description: returns a book
 *              content:
 *          500:
 *              description: error
 */

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

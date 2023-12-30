// server.js
// Import
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const Book = require("./BookSchema");
const cors = require("cors");
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/BookShop", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware for parsing JSON bodies
app.use(express.json());

const port = 3001;

// RESTful Endpoints
// POST endpoint to add a new book
app.post("/books", async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET endpoint to fetch all books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET endpoint to fetch a single book by ID
app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404).json({ message: "Book not found" });
    } else {
      res.status(200).json(book);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT endpoint to update a book
app.put("/books/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBook) {
      res.status(404).json({ message: "Book not found" });
    } else {
      res.status(200).json(updatedBook);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE endpoint to delete a book
app.delete("/books/:id", async (req, res) => {
  try {
    console.log("Deleting book with ID:", req.params.id);
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      res.status(404).json({ message: "Book not found" });
    } else {
      res.status(200).json({ message: "Book deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST endpoint to bulk add books
app.post("/books/bulk", async (req, res) => {
  try {
    const books = req.body;
    const insertedBooks = await Book.insertMany(books);

    if (insertedBooks) {
      res.status(201).json({ message: "Books added successfully" });
    } else {
      res.status(400).json({ message: "Failed to add books to the database" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Test
app.get("/test", (req, res) => {
  res.send("Server is working!");
});

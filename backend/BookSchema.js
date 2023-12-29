// Book Schema JS
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    // Book Schema
    title: String,
    ISBN: String,
    author: String,
    category: String,
    price: Number,
    stock: Number
});

// Connecting to books collection
const Book = mongoose.model('Book', bookSchema, 'books');

module.exports = Book;

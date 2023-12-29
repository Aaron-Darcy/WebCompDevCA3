import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
    // State management for books list, new book details, selected book ID for editing, feedback messages, and file for bulk upload
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({ title: '', author: '', category: '', price: 0, stock: 0 });
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [file, setFile] = useState(null);

    // Effect to fetch books from the server when component mounts
    useEffect(() => {
        fetchBooks();
    }, []);

    // Function to fetch books from server and update the books state
    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:3001/books');
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error("Error fetching books:", error);
            setFeedback("Error fetching books");
        }
    };

    // Function to handle adding a new book or updating an existing one
    const handleAddOrUpdateBook = async () => {
        // Determine the appropriate URL and method based on whether a book is being added or updated
        const url = selectedBookId ? `http://localhost:3001/books/${selectedBookId}` : 'http://localhost:3001/books';
        const method = selectedBookId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBook),
            });
            if (response.ok) {
                const result = await response.json();
                if (selectedBookId) {
                    // Update the book in the state
                    setBooks(books.map(book => book._id === selectedBookId ? result : book));
                    setSelectedBookId(null); // Clear selection
                } else {
                    // Add the new book to the state
                    setBooks([...books, result]);
                }
                // Reset the newBook state and provide success feedback
                setNewBook({ title: '', author: '', category: '', price: 0, stock: 0 });
                setFeedback(`Book ${selectedBookId ? 'updated' : 'added'} successfully!`);
            } else {
                throw new Error('Failed to perform operation on the book');
            }
        } catch (error) {
            console.error(`Error ${selectedBookId ? 'updating' : 'adding'} book:`, error);
            setFeedback(`Error ${selectedBookId ? 'updating' : 'adding'} book`);
        }
    };

    // Function to handle deleting a book
    const handleDeleteBook = async (bookId) => {
        try {
            const response = await fetch(`http://localhost:3001/books/${bookId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                // Update the state to remove the deleted book
                setBooks(books.filter(book => book._id !== bookId));
                setFeedback("Book deleted successfully!");
            } else {
                throw new Error(`Failed to delete book: Server responded with ${response.status}`);
            }
        } catch (error) {
            console.error("Error deleting book:", error);
            setFeedback("Error deleting book");
        }
    };

    // Function to handle selecting a book for editing
    const handleEditClick = (book) => {
        // Set the selectedBookId and fill in the form with the book's current details
        setSelectedBookId(book._id);
        setNewBook({
            title: book.title || '',
            author: book.author || '',
            category: book.category || '',
            price: book.price || 0,
            stock: book.stock || 0
        });
    };

    // Function to update newBook state as the user types in the form
    const handleChange = (e) => {
        setNewBook({ ...newBook, [e.target.name]: e.target.value });
    };

    // Function to set the file for bulk upload when the user selects a file
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // Function to handle bulk upload of books
    const handleFileUpload = async () => {
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const books = JSON.parse(e.target.result);
                try {
                    const response = await fetch('http://localhost:3001/books/bulk', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(books),
                    });
                    if (response.ok) {
                        // Refresh the book list after bulk upload
                        fetchBooks(); 
                        setFeedback("Books added from file successfully!");
                    } else {
                        throw new Error('Failed to add books from file');
                    }
                } catch (error) {
                    console.error("Error uploading books from file:", error);
                    setFeedback("Error uploading books from file");
                }
            };
            // Read the file as text and then upload the books
            reader.readAsText(file); 
        }
    };

    // Render the UI
    return (
        <div className="container mt-5">
            {feedback && <div className="alert alert-danger">{feedback}</div>}

            {/* Upload Form for bulk upload of books */}
            <div className="mb-4">
                <h2>Upload Books from JSON File</h2>
                <input type="file" className="form-control-file" onChange={handleFileChange} accept=".json" />
                <button className="btn btn-primary mt-2" onClick={handleFileUpload}>Upload Books</button>
            </div>

            {/* Form for adding or updating a single book */}
            <div className="mb-4">
                <h2>{selectedBookId ? "Edit Book" : "Add New Book"}</h2>
                <div className="form-group">
                    <input type="text" className="form-control mb-2" name="title" value={newBook.title} onChange={handleChange} placeholder="Title" />
                    <input type="text" className="form-control mb-2" name="isbn" value={newBook.isbn} onChange={handleChange} placeholder="ISBN" />
                    <input type="text" className="form-control mb-2" name="author" value={newBook.author} onChange={handleChange} placeholder="Author" />
                    <input type="text" className="form-control mb-2" name="category" value={newBook.category} onChange={handleChange} placeholder="Category" />
                    <input type="number" className="form-control mb-2" name="price" value={newBook.price} onChange={handleChange} placeholder="Price" />
                    <input type="number" className="form-control mb-2" name="stock" value={newBook.stock} onChange={handleChange} placeholder="Stock" />
                </div>
                <button className="btn btn-success" onClick={handleAddOrUpdateBook}>{selectedBookId ? "Update Book" : "Add Book"}</button>
                {selectedBookId && <button className="btn btn-secondary ml-2" onClick={() => setSelectedBookId(null)}>Cancel</button>}
            </div>


            {/* List of books with options to edit or delete each */}
            <div className="mb-4">
                <h2>Books List</h2>
                <ul className="list-group">
                    {books.map(book => (
                        <li className="list-group-item d-flex justify-content-between align-items-center" key={book._id}>
                            {book.title} - {book.author}
                            <div>
                                <button className="btn btn-info mr-2" onClick={() => handleEditClick(book)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => handleDeleteBook(book._id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;

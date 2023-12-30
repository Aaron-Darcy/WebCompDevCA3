// AdminDashboard.js
// Imports
import React, { useState, useEffect } from "react";
import LogoutButton from "./LogoutButton";

const AdminDashboard = () => {
  // State management for books list, new book details, selected book ID for editing, feedback messages, and file for bulk upload
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    category: "",
    ISBN: 0,
    price: 0,
    stock: 0,
  });
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [file, setFile] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Effect to fetch books from the server when component mounts
  useEffect(() => {
    fetchBooks();
  }, []);

  // Function to fetch books from server and update the books state
  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:3001/books");
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
    const url = selectedBookId
      ? `http://localhost:3001/books/${selectedBookId}`
      : "http://localhost:3001/books";
    const method = selectedBookId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });
      if (response.ok) {
        const result = await response.json();
        if (selectedBookId) {
          // Update the book in the state
          setBooks(
            books.map((book) => (book._id === selectedBookId ? result : book))
          );
          setSelectedBookId(null); // Clear selection
        } else {
          // Add the new book to the state
          setBooks([...books, result]);
        }
        // Reset the newBook state and provide success feedback
        setNewBook({
          title: "",
          author: "",
          category: "",
          ISBN: 0,
          price: 0,
          stock: 0,
        });
        setFeedback(
          `Book ${selectedBookId ? "updated" : "added"} successfully!`
        );
      } else {
        throw new Error("Failed to perform operation on the book");
      }
    } catch (error) {
      console.error(
        `Error ${selectedBookId ? "updating" : "adding"} book:`,
        error
      );
      setFeedback(`Error ${selectedBookId ? "updating" : "adding"} book`);
    }
  };

  // Function to handle deleting a book
  const handleDeleteBook = async (bookId) => {
    try {
      const response = await fetch(`http://localhost:3001/books/${bookId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // Update the state to remove the deleted book
        setBooks(books.filter((book) => book._id !== bookId));
        setFeedback("Book deleted successfully!");
      } else {
        throw new Error(
          `Failed to delete book: Server responded with ${response.status}`
        );
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
      title: book.title || "",
      author: book.author || "",
      category: book.category || "",
      ISBN: book.ISBN || 0,
      price: book.price || 0,
      stock: book.stock || 0,
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
          const response = await fetch("http://localhost:3001/books/bulk", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(books),
          });
          if (response.ok) {
            // Refresh the book list after bulk upload
            fetchBooks();
            setFeedback("Books added from file successfully!");
          } else {
            throw new Error("Failed to add books from file");
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
    <div
      className={`min-h-screen bg-gray-100 dark:bg-gray-900 p-8 transition-colors`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with Dark Mode Toggle and Logout Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Book Store Admin Dashboard
          </h1>
          <div className="space-x-4">
            <LogoutButton />
          </div>
        </div>
        {/* Main Content */}
        <div className="flex gap-6">
          {/* Left Column */}
          <div className="flex-grow space-y-4">
            {/* Upload Form */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Upload Books From JSON File
              </h2>
              <input
                type="file"
                className="w-full mb-2 px-4 py-2 text-base font-normal text-gray-700 bg-white border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                onChange={handleFileChange}
                accept=".json"
              />
              <button
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition dark:bg-blue-600 dark:hover:bg-blue-700"
                onClick={handleFileUpload}
              >
                Upload Books
              </button>
            </div>

            {/* Form for adding or updating a single book */}
            <div className="mb-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                {selectedBookId ? "Edit Book" : "Add New Book"}
              </h2>
              <form className="space-y-4">
                {/* Title Field */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newBook.title}
                    onChange={handleChange}
                    placeholder="Enter title here"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>

                {/* ISBN Field */}
                <div>
                  <label
                    htmlFor="ISBN"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    ISBN
                  </label>
                  <input
                    type="text"
                    id="ISBN"
                    name="ISBN"
                    value={newBook.ISBN}
                    onChange={handleChange}
                    placeholder="Enter ISBN here"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>

                {/* Author Field */}
                <div>
                  <label
                    htmlFor="author"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Author
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={newBook.author}
                    onChange={handleChange}
                    placeholder="Enter author's name"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>

                {/* Category Field */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={newBook.category}
                    onChange={handleChange}
                    placeholder="Enter book category"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>

                {/* Price Field */}
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={newBook.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>

                {/* Stock Field */}
                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={newBook.stock}
                    onChange={handleChange}
                    placeholder="Enter stock quantity"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>

                {/* Submit and Cancel Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition dark:bg-green-400 dark:hover:bg-green-500"
                    onClick={handleAddOrUpdateBook}
                  >
                    {selectedBookId ? "Update Book" : "Add Book"}
                  </button>
                  {selectedBookId && (
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition dark:bg-gray-600 dark:hover:bg-gray-700"
                      onClick={() => setSelectedBookId(null)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List of books with options to edit or delete each */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Books List
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                  <div
                    key={book._id}
                    className="p-6 border rounded-lg shadow hover:shadow-lg transition bg-white dark:bg-gray-800"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {book.author}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {book.category}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Stock: {book.stock}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {book.ISBN}
                    </p>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        className="text-sm px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded dark:bg-blue-400 dark:hover:bg-blue-500"
                        onClick={() => handleEditClick(book)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded dark:bg-red-400 dark:hover:bg-red-500"
                        onClick={() => handleDeleteBook(book._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

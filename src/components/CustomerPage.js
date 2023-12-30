// CustomerPage.js
// Imports
import React, { useState, useEffect } from "react";
import DarkModeToggle from "./DarkModeToggle";
import LogoutButton from "./LogoutButton";

const CustomerPage = () => {
  // State variables
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch books from the server on component mount
  useEffect(() => {
    fetchBooks();
    // Toggle the dark class/mode
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // Function to fetch books data from server
  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:3001/books");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
      setFeedback("Error fetching books");
    }
  };

  // Function to handle selecting a book from the list
  const handleSelectBook = (book) => {
    setSelectedBook(book);
    // Reset quantity when selecting a new book
    setQuantity(1);
  };

  // Function to handle adding the selected book to the cart
  const handleAddToCart = () => {
    if (quantity < 1 || quantity > 5) {
      alert("Please select between 1 and 5 copies.");
      return;
    }
    let newCart = [...cart];
    const cartItem = newCart.find((item) => item.book._id === selectedBook._id);
    if (cartItem) {
      cartItem.quantity = Math.min(5, cartItem.quantity + quantity);
    } else {
      newCart.push({ book: selectedBook, quantity: quantity });
    }
    setCart(newCart);
  };

  // Calculate total function for cart
  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.book.price * item.quantity, 0)
      .toFixed(2);
  };

  // Event handler for checkout
  const handleCheckout = async () => {
    // Loop through all items in the cart and update the stock
    for (const item of cart) {
      const newStock = item.book.stock - item.quantity; // Calculate new stock

      if (newStock > 0) {
        // Update the stock if it's more than 0
        try {
          await fetch(`http://localhost:3001/books/${item.book._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            // send the new stock as part of the request
            body: JSON.stringify({ stock: newStock }),
          });
        } catch (error) {
          console.error("Error updating book stock:", error);
        }
      } else {
        // Remove the book if the stock is 0
        try {
          await fetch(`http://localhost:3001/books/${item.book._id}`, {
            method: "DELETE",
          });
        } catch (error) {
          console.error("Error deleting book:", error);
        }
      }
    }

    // Clear the cart after checkout
    setCart([]);
    alert("Checking out!");
    // Re-fetch books to update the local state
    fetchBooks();
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  // Filter the books based on the search term
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen bg-gray-100 dark:bg-gray-900 p-8 transition-colors`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with Dark Mode Toggle and Logout Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Book Store
          </h1>
          <div className="space-x-4">
            <LogoutButton />
            <DarkModeToggle
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Left Column: Book List */}
          <div className="flex-grow space-y-4">
            {/* Search Input */}
            <input
              type="text"
              className="w-full mb-4 px-4 py-2 text-base font-normal text-gray-700 bg-white border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
              placeholder="Search by title, genre, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Book Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book._id}
                  className="p-6 border rounded-lg shadow hover:shadow-lg transition cursor-pointer bg-gray-50 dark:bg-gray-800"
                  onClick={() => handleSelectBook(book)}
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
                </div>
              ))}
            </div>
          </div>

          {/* Selected Book and Cart */}
          <div className="w-full max-w-md space-y-4">
            {/* Selected Book Details */}
            {selectedBook && (
              <div className="mb-4 p-6 border rounded-lg shadow-lg bg-gray-50 dark:bg-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Selected Book: {selectedBook.title}
                </h3>
                <p className="text-gray-800 dark:text-gray-300">
                  Author: {selectedBook.author}
                </p>
                <p className="text-gray-800 dark:text-gray-300">
                  ISBN: {selectedBook.ISBN}
                </p>
                <p className="text-gray-800 dark:text-gray-300">
                  Price: €{selectedBook.price}
                </p>
                <div className="flex items-center mt-2">
                  <label className="mr-2 text-gray-800 dark:text-gray-300">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(1, Math.min(5, parseInt(e.target.value)))
                      )
                    }
                    className="w-16 px-2 py-1 border rounded text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  />
                  <button
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition dark:bg-blue-600 dark:hover:bg-blue-700"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            )}

            {/* Cart Display */}

            <div className="p-4 border rounded-lg shadow-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Your Cart
              </h3>
              <h2 className="text- font-semibold text-gray-900 dark:text-white mb-2">
                Max Quantity of 5 Per Book Allowed
              </h2>
              {cart.length === 0 && (
                <p className="text-gray-800 dark:text-gray-300">
                  Your cart is empty.
                </p>
              )}
              {cart.map((item) => (
                <div
                  key={item.book._id}
                  className="flex justify-between items-center mb-2"
                >
                  <span className="text-gray-800 dark:text-gray-300">
                    {item.quantity} x {item.book.title}
                  </span>
                  <span className="text-gray-800 dark:text-gray-300">
                    €{(item.book.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              {cart.length > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Total:
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      €{calculateTotal()}
                    </span>
                  </div>
                  <button
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition dark:bg-blue-600 dark:hover:bg-blue-700"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;

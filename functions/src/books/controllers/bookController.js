const express = require('express');
const router = express.Router();
const { 
    getBooksByUser, 
    addBook, 
    getBookDetailsById, 
    updateBookById, 
    deleteBookById 
} = require('../services/bookService');
const authMiddleware = require('../../users/middlewares/authMiddleware'); // For securing routes

router.get('/', authMiddleware, getBooksByUser);       // Get all books
router.post('/', authMiddleware, addBook);       // Add a new book
router.get('/:id', authMiddleware, getBookDetailsById);  // Get a book
router.put('/:id', authMiddleware, updateBookById);  // Update a book
router.delete('/:id', authMiddleware, deleteBookById); // Delete a book

module.exports = router;
const express = require('express');
const router = express.Router();
const authMiddleware = require('../../users/middlewares/authMiddleware'); // For securing routes
const { listReviews, addReview, deleteReview } = require('../services/reviewService.js');

router.get('/', authMiddleware, listReviews);       // Get all reviews for a book
router.post('/', authMiddleware, addReview);       // Add a new review
router.delete('/', authMiddleware, deleteReview);       // Delete a review

module.exports = router;
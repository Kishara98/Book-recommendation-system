const { getMongoDB } = require('../../../mongoConnection');
const Book = require('../../books/models/Book.js');
const Review = require('../../review/models/Review.js');
const {
  findRecordsByFieldsAndModel,
  addRecordToDB,
  deleteRecordById,
} = require('../../users/utils/document.js');

/**
 * Retrieves a list of reviews for a specific book based on the provided book ID.
 *
 * @function listReviews
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<void>}
 *
 */
async function listReviews(req, res) {
  const label = `<getReviewsByBookId ${JSON.stringify(req.query)}>`;
  console.time(label);
  try {
    const { bookId } = req.query;
    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required.' });
    }
    await getMongoDB();
    const keyAndValues = [{ field: 'bookId', value: bookId }];

    // Retrieve the list of reviews for the specified book.
    const reviews = await findRecordsByFieldsAndModel(keyAndValues, Review);

    if (reviews.length === 0) {
      return res
        .status(204)
        .json({ message: 'No reviews found for this book.' });
    } else {
      res.status(200).json(reviews);
    }
  } catch (error) {}
}

/**
 * Adds a review for a book, including a rating, and associates it with the authenticated user.
 *
 * @function addReview
 * @param {Object} req
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>}
 *
 */
async function addReview(req, res) {
  const label = `<addReview ${JSON.stringify(req.query)}>`;
  console.time(label);
  try {
    const { bookId } = req.query;
    const { review, rating } = req.body;

    const keyAndValues = [{ field: 'bookId', value: bookId }];

    if (!bookId || !review || !rating) {
      return res
        .status(400)
        .json({ message: 'Book ID, review text, and rating are required.' });
    }

    if (rating <= 1 || rating >= 5) {
      return res
        .status(400)
        .json({ message: 'Rating must be between 1 and 5.' });
    }
    await getMongoDB();

    // Retrieve the list of reviews for the specified book.
    const book = await findRecordsByFieldsAndModel(keyAndValues, Book);
    if (!book) {
      return res.status(204).json({ message: 'Book not found.' });
    }

    const reviewObject = {
      review,
      rating,
      bookId,
      userId: req.user.id, // The authenticated user's ID.
    };

    try {
      // Insert the review into the database
      await addRecordToDB(Review, reviewObject);
      console.info(
        `New review added successfully: ${review} , rate: ${rating}`
      );
      res
        .status(201)
        .json({ message: 'Review added successfully', review: reviewObject });
    } catch (error) {
      console.error(
        `Error while adding a new review: ${review} , rate: ${rating}`,
        error
      );
      res.status(500).json({ message: 'Failed to add the review' });
    }
  } catch (error) {
    console.timeEnd(label);
    console.error(`${label} Error during adding a review:`, error.message);
    res.status(500).json({ message: 'Server error during adding a review.' });
  }
}

/**
 * Deletes a review based on the provided review ID and the authenticated user.
 *
 * @function deleteReview
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<void>}
 *
 */
async function deleteReview(req, res) {
  const label = `<deleteReview ${JSON.stringify(req.query)}>`;
  console.time(label);
  try {
    const { reviewId } = req.query;
    const where = { _id: reviewId, userId: req.user.id };

    if (!reviewId) {
      return res.status(400).json({ message: 'Review ID is required.' });
    }
    await getMongoDB();
    // Delete the review from the database
    const deletedReview = await deleteRecordById(Review, where);
    if (!deletedReview) {
      return res
        .status(204)
        .json({ message: 'Review not found or unauthorized.' });
    }

    res
      .status(200)
      .json({ message: 'Review deleted successfully!', review: deleteReview });
  } catch (error) {
    console.timeEnd(label);
    console.error('Error deleting review:', error.message);
    res
      .status(500)
      .json({ message: 'Server error while deleting the review.' });
  }
}

module.exports = {
  listReviews,
  addReview,
  deleteReview,
};
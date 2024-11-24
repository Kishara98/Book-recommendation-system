const { getMongoDB } = require('../../../mongoConnection');
const {
  findRecordsByFieldsAndModel,
  addRecordToDB,
  updateRecordById,
  deleteRecordById,
} = require('../../users/utils/document');
const Book = require('../../books/models/Book.js');

/**
 * Adds a new book for the logged-in user.
 * 
 * @function addBook
 * @param {Object} req
 * @param {string} req.user.id - ID of the logged-in user.
 * @param {Object} res
 * @returns {Promise<void>}
 */
async function addBook(req, res) {
  const label = `<addBook ${JSON.stringify(req.body)}>`;
  console.time(label);
  try {
    const { title, author, genre } = req.body;
    await getMongoDB();

    // Validate input
    if (!title || !author || !genre) {
      return res
        .status(400)
        .json({ message: 'Title, author, and genre are required.' });
    }

    const bookObject = {
      title,
      author,
      genre,
      userId: req.user.id, // Associate the book with the logged-in user
    };

    // Create a new book
    try {
      await addRecordToDB(Book, bookObject);
      console.info(`New book added successfully: ${title} by ${author}`);
      res
        .status(201)
        .json({ message: 'Book added successfully', book: bookObject });
    } catch (error) {
      console.error(
        `Error while adding a new book: ${title} by ${author}`,
        error
      );
      res.status(500).json({ message: 'Failed to add the book' });
    }
  } catch (error) {
    console.timeEnd(label);
    console.error(`${label} Error during adding a book:`, error.message);
    res.status(500).json({ message: 'Server error during adding a book.' });
  }
}

/**
 * Fetches all books added by the logged-in user.
 * 
 * @function getBooksByUser
 * @param {Object} req
 * @param {string} req.user.id - ID of the logged-in user.
 * @param {Object} res
 * @returns {Promise<void>} 
 */
async function getBooksByUser(req, res) {
  const label = `<getBooksByUser ${JSON.stringify(req.user.id)}>`;
  console.time(label);
  try {
    const { title, author, genre } = req.query;
    await getMongoDB();
    const keyAndValues = [
      { field: 'userId', value: req.user.id },
    ];
    const params = { title, author, genre };
    // Loop through each parameter and add to keyAndValues if it exists
    Object.entries(params).forEach(([field, value]) => {
      if (value) keyAndValues.push({ field, value });
    });

    const books = await findRecordsByFieldsAndModel(keyAndValues, Book);
    if (books.length === 0) {
      return res.status(204).json({ message: 'Books not found or unauthorized.' });
    }
    res.status(200).json(books);
  } catch (error) {
    console.timeEnd(label);
    console.error('Error fetching books:', error.message);
    res.status(500).json({ message: 'Server error while fetching books.' });
  }
}
/**
 * Fetches specifc book added by the logged-in user.
 * 
 * @function getBookDetailsById
 * @param {Object} req
 * @param {string} req.user.id - ID of the logged-in user.
 * @param {Object} res
 * @returns {Promise<void>} 
 */
async function getBookDetailsById(req, res) {
  const label = `<getBookDetailsById ${JSON.stringify(req.user.id)} ${req.params}>`;
  console.time(label);
  try {
    await getMongoDB();
    const { id } = req.params; 
    // Find the book by ID and ensure it belongs to the logged-in user
    const keyAndValues = [
      { field: '_id', value: id },
      { field: 'userId', value: req.user.id }
    ];
    const books = await findRecordsByFieldsAndModel(keyAndValues, Book);

    if (books.length === 0) {
      return res.status(204).json({ message: 'Book not found or unauthorized.' });
    }
    res.status(200).json(books); // Return the book if found
  } catch (error) {
    console.timeEnd(label);
    console.error('Error fetching book:', error.message);
    res.status(500).json({ message: 'Server error while fetching book.' });
  }
}

/**
 * Updates a book's details by its ID.
 * 
 * This function updates a book document in the database based on the provided ID and user authorization.
 * It checks that the book belongs to the authenticated user before updating.
 * 
 * @function updateBookById
 * @param {Object} req 
 * @param {Object} res
 * @returns {Promise<void>} 
 * 
 */
async function updateBookById(req, res) {
  const label = `<updateBookById ${JSON.stringify(req.body)} ${req.params}> `;
  console.time(label);
  try {
    await getMongoDB();
    const { id } = req.params;
    const { title, author, genre } = req.body;
    const where = { _id: id, userId: req.user.id };
    const data = { title, author, genre };
    const options = { new: true, runValidators: true };

    // Find and update the book
    const updatedBook = await updateRecordById(Book, where, data, options);
    if (!updatedBook) {
      return res.status(204).json({ message: 'Book not found or unauthorized.' });
    }
    res.status(200).json({ message: 'Book updated successfully!', book: updatedBook });
  } catch (error) {
    console.timeEnd(label);
    console.error('Error updating book:', error.message);
    res.status(500).json({ message: 'Server error while updating book.' });
  }
}


/**
 * Deletes a book from the database by its ID.
 * 
 * This function ensures the authenticated user has the necessary authorization to delete the book.
 * It checks that the book belongs to the user before deleting it.
 * 
 * @function deleteBookById
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<void>}
 */
async function deleteBookById(req, res) {
  const label = `<updateBookById ${JSON.stringify(req.body)} ${req.params}> `;
  console.time(label);
  try {
    const { id } = req.params;
    const where = { _id: id, userId: req.user.id };
    await getMongoDB();

    // Find and delete the book
    const deletedBook = await deleteRecordById(Book, where);
    if (!deletedBook) {
      return res.status(204).json({ message: 'Book not found or unauthorized.' });
    }

    res.status(200).json({ message: 'Book deleted successfully!', book: deletedBook});
  } catch (error) {
    console.timeEnd(label);
    console.error('Error deleting book:', error.message);
    res.status(500).json({ message: 'Server error while deleting the book.' });
  }
}

module.exports = {
  addBook,
  getBooksByUser,
  getBookDetailsById,
  updateBookById,
  deleteBookById
};
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT  = process.env.PORT || 5000;
const authController = require('./src/users/controllers/authController.js');
const bookController = require('./src/books/controllers/bookController.js');

// Initialize env variables
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API routes
app.use('/api/auth', authController);
app.use('/api/books', bookController);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An error occured ', error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

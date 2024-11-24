const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const authController = require('./src/users/controllers/authController.js');
const bookController = require('./src/books/controllers/bookController.js');
const reviewController = require('./src/review/controllers/reviewController.js');

// Initialize env variables
dotenv.config();

const app = express();

// Configure CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS 
? process.env.ALLOWED_ORIGINS.split(',') 
: ['http://localhost:3000'];

console.log('allowedOrigins>>', allowedOrigins)
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use(bodyParser.json());

// API routes
app.use('/api/auth', authController);
app.use('/api/books', bookController);
app.use('/api/reviews', reviewController);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An error occurred', error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const router = express.Router();
const { createUserAccount, login, logoutUser } = require('../services/authService.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

router.post('/signup', createUserAccount); // User signup
router.post('/login', login); // User login
router.post('/logout', authMiddleware, logoutUser); // User logout (protected)

module.exports = router;
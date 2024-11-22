const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { hashPassword, verifyPassword, generateJwtToken } = require('../helper/helper');
const { getMongoDB } = require('../../../mongoConnection');
const { findRecordsByFieldsAndModel, addRecordToDB } = require('../utils/document');

/**
 * @function createUserAccount
 * @description Handles the creation of a new user account.
 * Validates if the email is unique, hashes the password,
 * and saves the user to the database.
 * @param {Object} req
 * @param {Object} res
 * @returns {void}
 */
async function createUserAccount(req, res) {
  const label = `<creaeUserAccount ${JSON.stringify(req.body)}>`;
  console.time(label);
  try {
    const { userName, email, password } = req.body;
    await getMongoDB();

    const keyAndValues = [
      { field: 'email', value: email }
    ];
    // Check if user already exists
    const userRecord = await findRecordsByFieldsAndModel(keyAndValues, User);
    if (userRecord.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);
    const userObject = {
      userName,
      email,
      password: hashedPassword,
    };
    // Create a new user
    try {
      await addRecordToDB(User, userObject);
      console.info(`New user created successfully: ${email}`);
      res.status(201).json({ 
        message: 'User created successfully', 
        user: {
          id: userObject._id,
          userName,
          email,
        },
      });
    } catch (error) {
      console.error(`Error while creating a new user: ${email}`, error);
      res.status(500).json({ message: 'Failed to create user' });
    } 

  } catch (error) {
    console.timeEnd(label);
    console.error(`${label} Error during signup:`, error.message);
    res.status(500).json({ message: 'Server error during signup.' });
  }
}

/**
 * Handles user login.
 *
 * @function login
 * @param {Object} req
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response containing the authentication token and user details.
 */
async function login(req, res) {
  const label = `<login}>`;
  console.time(label);
  try {
    const { email, password } = req.body;
    const expiresIn = '1h';
    await getMongoDB();
    // Find the user by email
    const keyAndValues = [
      { field: 'email', value: email }
    ];
    const userRecord = await findRecordsByFieldsAndModel(keyAndValues, User);

    if (userRecord.length === 0) {
      console.log('User not found.');
      return res.status(404).json({ message: 'User not found.' });
    }

    // Compare password
    const isMatch = await verifyPassword(password, userRecord[0].password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT token
    const jwtToken = await generateJwtToken(userRecord[0]._id, expiresIn)

    res.status(200).json({
      message: 'Login successful!',
      authorization: jwtToken,
      user: {
        id: userRecord[0]._id,
        userName: userRecord[0].userName,
        email: userRecord[0].email,
      },
    });
  } catch (error) {
    console.timeEnd(label);
    console.error(`${label} Error during login:`, error.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
}

/**
 * Logs out the user by clearing the session on the UI side.
 *
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {void}
 */
async function logoutUser(req, res) {
  const label = `<logoutUser>`;
  console.time(label);
  try {
    // Simulate removing the JWT token from the user's session (frontend action)
    res.status(200).json({ message: 'Logged out successfully!' });
  } catch (error) {
    console.timeEnd(label);
    console.error(`${label} Error during logout:`, error.message);
    res.status(500).json({ message: 'Server error during logout.' });
  }
}

module.exports = {
  createUserAccount,
  login,
  logoutUser,
};

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Hashes a given password using bcrypt with a generated salt.
 *
 * This function generates a salt with a specified number of rounds
 * and hashes the password securely using bcrypt.
 *
 * @param {string} password - The plain-text password to be hashed.
 * @returns {Promise<string>} The hashed password.
 * @throws {Error} If an error occurs during hashing.
 */
async function hashPassword(password) {
  const label = `<hashPassword>`;
  console.time();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.timeEnd(label);
    console.error(`${label} Error during password hashing:`, error.message);
    throw new Error("Failed to hash password.");
  }
}

/**
 * Verifies whether the input password matches the hashed actual password.
 *
 * @function verifyPassword
 * @param {string} inputPassword - The plain text password provided by the user.
 * @param {string} actualPassword - The hashed password stored in the database.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the passwords match, or `false` otherwise.
 * @throws {Error} Throws an error if the password verification process fails.
 */
async function verifyPassword(inputPassword, actualPassword) {
  const label = `<verifyPassword>`;
  console.time(label);
  try {
    return await bcrypt.compare(inputPassword, actualPassword);
  } catch (error) {
    console.timeEnd(label);
    console.error(`${label} Error during password verifying:`, error.message);
    throw error;
  }
}

/**
 * Generates a JSON Web Token (JWT) for a user.
 * 
 * This function signs a JWT containing the user's ID as the payload and sets an expiration time.
 * The JWT is signed using a secret key stored in the environment variables.
 * 
 * @param {Object} userRecord 
 * @param {string} expiresIn - The duration for which the JWT should remain valid (e.g., '1h', '24h').
 * @returns {Promise<string>} 
 */
async function generateJwtToken(userRecord, expiresIn) {
  const label = `<generateJwtToken ${userRecord._id}, ${expiresIn}>`;
  console.time(label);
  try {
    return jwt.sign({ id: userRecord._id }, process.env.JWT_SECRET, {
      expiresIn: expiresIn,
    });
  } catch (error) {
    console.timeEnd(label);
    console.error(`${label} Error during JWT token generation:`, error.message);
  }
}
module.exports = {
  hashPassword,
  verifyPassword,
  generateJwtToken,
};

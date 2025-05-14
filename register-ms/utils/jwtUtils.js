const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Function to generate a JWT
const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION, 
  });
  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Token no válido');
  }
};

module.exports = { generateToken, verifyToken };

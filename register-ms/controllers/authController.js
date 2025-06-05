const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

// Function to generate a unique, temporary token
const generateTempToken = (userId) => {
  // Set the expiration time to 10 minutes (600 seconds)
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '10m' });
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate a temporary token for the user
    const tempToken = generateTempToken(newUser.id);

    // Respond with the token and user data
    return res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
      tempToken,  // Send the token to the client
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Error registering user' });
  }
};

module.exports = { register };

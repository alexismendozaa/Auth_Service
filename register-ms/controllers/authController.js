const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Respond with code 201 if everything is successful
    return res.status(201).json({ message: 'Usuario registrado correctamente', user: newUser });
  } catch (error) {
    
    console.error("Error en el registro de usuario:", error);
    return res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};


module.exports = { register };

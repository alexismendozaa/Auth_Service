const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Responder con el código 201 si todo es exitoso
    return res.status(201).json({ message: 'Usuario registrado correctamente', user: newUser });
  } catch (error) {
    // Agregar un log más detallado para capturar el error en producción
    console.error("Error en el registro de usuario:", error);
    return res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};


module.exports = { register };

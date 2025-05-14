const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

// Función para manejar el login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar el usuario por el correo electrónico
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'El usuario no existe' });
    }

    // Comparar la contraseña proporcionada con la almacenada
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Generar el JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    // Responder con el token
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al autenticar el usuario' });
  }
};

module.exports = { login };

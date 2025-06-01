const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs'); 


if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error("Las variables de entorno EMAIL_USER y EMAIL_PASS deben estar definidas.");
}

// Function to start the password reset process
const initiatePasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    console.log("Buscando al usuario con el correo: ", email);
    
    // Search user by email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log("Usuario no encontrado");
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    // Generate the recovery token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // Token valid for 1 hour

    console.log("Generado resetToken: ", resetToken);
    console.log("Generada fecha de expiración: ", resetExpires);

    // Save the token and expiration date to the database
    const updatedUser = await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    });

    console.log("Usuario actualizado: ", updatedUser);

    // Get the base URL of the environment (IP or domain)
    const baseUrl = process.env.APP_URL || `http://localhost:3000`;
    console.log("Base URL para el correo: ", baseUrl);

    // Nodemailer Configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de Contraseña',
      text: `Hola, este es el código de recuperación de contraseña que solicitaste: ${resetToken}`,
    };

    // Send mail
    console.log("Enviando el correo...");
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    console.error("Error en la función initiatePasswordReset:", error);
    return res.status(500).json({ error: 'Hubo un problema al procesar la solicitud de recuperación. Intenta más tarde.' });
  }
};



module.exports = { initiatePasswordReset };

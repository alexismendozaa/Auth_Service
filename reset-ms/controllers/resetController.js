const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs'); 


if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error("Las variables de entorno EMAIL_USER y EMAIL_PASS deben estar definidas.");
}

// Function to reset the password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    console.log("Recibiendo token para restablecer la contraseña:", token);

    // Find user with the token and verify that it has not expired
    const user = await User.findOne({
      where: { 
        resetPasswordToken: token, 
        resetPasswordExpires: { [Op.gte]: new Date() } // Find user with the token and verify that it has not expired
      },
    });

    if (!user) {
      console.log("Token inválido o expirado");
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(newPassword, 10);  // El número 10 es el "salting rounds", puedes ajustarlo si es necesario

    // Update the hashed password in the database
    await user.update({
      password: hashedPassword,  // Use the hashed password
      resetPasswordToken: null,  // Clear the recovery token
      resetPasswordExpires: null,  // Clear the expiration date
    });

    console.log("Contraseña actualizada con éxito");
    return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    return res.status(500).json({ error: 'Hubo un problema al restablecer la contraseña. Intenta más tarde.' });
  }
};


module.exports = {resetPassword };
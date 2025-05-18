const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User'); // Asegúrate de que la ruta sea correcta
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs'); 


// Asegúrate de que las variables de entorno estén definidas
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error("Las variables de entorno EMAIL_USER y EMAIL_PASS deben estar definidas.");
}

// Función para iniciar el proceso de restablecimiento de contraseña
const initiatePasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    console.log("Buscando al usuario con el correo: ", email);
    
    // Buscar usuario por correo
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log("Usuario no encontrado");
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    // Generar el token de recuperación
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // Token válido por 1 hora

    console.log("Generado resetToken: ", resetToken);
    console.log("Generada fecha de expiración: ", resetExpires);

    // Guardar el token y la fecha de expiración en la base de datos
    const updatedUser = await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,  // Asigna la fecha de expiración aquí
    });

    console.log("Usuario actualizado: ", updatedUser);

    // Obtener la URL base del entorno (IP o dominio)
    const baseUrl = process.env.APP_URL || `http://localhost:3000`;
    console.log("Base URL para el correo: ", baseUrl);

    // Configuración de nodemailer
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

    // Enviar correo
    console.log("Enviando el correo...");
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    console.error("Error en la función initiatePasswordReset:", error);
    return res.status(500).json({ error: 'Hubo un problema al procesar la solicitud de recuperación. Intenta más tarde.' });
  }
};


// Función para restablecer la contraseña
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    console.log("Recibiendo token para restablecer la contraseña:", token);

    // Buscar usuario con el token y verificar que no haya expirado
    const user = await User.findOne({
      where: { 
        resetPasswordToken: token, 
        resetPasswordExpires: { [Op.gte]: new Date() }  // Verificar que el token no haya expirado
      },
    });

    if (!user) {
      console.log("Token inválido o expirado");
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    // Hashear la nueva contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(newPassword, 10);  // El número 10 es el "salting rounds", puedes ajustarlo si es necesario

    // Actualizar la contraseña hasheada en la base de datos
    await user.update({
      password: hashedPassword,  // Usar la contraseña hasheada
      resetPasswordToken: null,  // Limpiar el token de recuperación
      resetPasswordExpires: null,  // Limpiar la fecha de expiración
    });

    console.log("Contraseña actualizada con éxito");
    return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    return res.status(500).json({ error: 'Hubo un problema al restablecer la contraseña. Intenta más tarde.' });
  }
};

module.exports = { initiatePasswordReset, resetPassword };

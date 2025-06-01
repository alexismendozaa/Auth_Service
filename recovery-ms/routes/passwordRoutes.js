const express = require('express');
const router = express.Router();
const { initiatePasswordReset, resetPassword } = require('../controllers/passwordController');  // Asegúrate de que la ruta sea correcta

/**
 * @swagger
 * /api/recovery:
 *   post:
 *     summary: Inicia el proceso de restablecimiento de contraseña
 *     description: Envía un correo con el enlace para restablecer la contraseña
 *     requestBody:
 *       description: El correo electrónico del usuario para enviar el enlace de recuperación
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Correo enviado exitosamente
 *       400:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post('/recovery', initiatePasswordReset);

module.exports = router;

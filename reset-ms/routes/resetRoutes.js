const express = require('express');
const router = express.Router();
const { initiatePasswordReset, resetPassword } = require('../controllers/resetController');  // Asegúrate de que la ruta sea correcta

/**
 * @swagger
 * /api/recovery:
 *   post:
 *     summary: Restablece la contraseña de un usuario
 *     description: Permite al usuario restablecer su contraseña usando un token de recuperación
 *     requestBody:
 *       description: Token y nueva contraseña para actualizar la cuenta
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "d2d2a1b4f3c6e7f5d7c9e0c1"
 *               newPassword:
 *                 type: string
 *                 example: "NuevaContraseña123"
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *       400:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error del servidor
 */
router.post('/reset', resetPassword);

module.exports = router;

const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     description: Crea un nuevo usuario en el sistema.
 *     tags: [Auth]
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Datos del usuario
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - username
 *             - email
 *             - password
 *           properties:
 *             username:
 *               type: string
 *               description: Nombre de usuario
 *             email:
 *               type: string
 *               description: Correo electrónico del usuario
 *             password:
 *               type: string
 *               description: Contraseña del usuario
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente.
 *       400:
 *         description: Error al registrar el usuario.
 */
router.post('/register', authController.register);

module.exports = router;
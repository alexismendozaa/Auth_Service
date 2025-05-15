const express = require('express');
const { login } = require('../controllers/authController');

const router = express.Router();

/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: Login de usuario
 *     description: Autentica a un usuario con su correo electrónico y contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Token de autenticación generado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Error de autenticación o usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.post('/login', login);

module.exports = router;

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

/**
 * @openapi
 * /api/logout:
 *   post:
 *     summary: Logout de usuario
 *     description: Invalida el token del usuario y lo cierra sesión. El cliente debe eliminar el token.
 *     security:
 *       - bearerAuth: []  # Aquí definimos que el token JWT es necesario
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Token de autenticación (Bearer token)
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer <your_jwt_token>"
 *     responses:
 *       200:
 *         description: Logout exitoso, el token debe eliminarse del cliente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout exitoso. El token debe eliminarse del cliente."
 *       401:
 *         description: Token no proporcionado o inválido
 *       500:
 *         description: Error en el servidor
 */

// Ruta para logout
router.post('/logout', (req, res) => {
  // Solo confirmamos el logout, el cliente debe eliminar el token
  res.status(200).json({ message: 'Logout exitoso. El token debe eliminarse del cliente.' });
});

// Configuración de la autenticación por token (Swagger)
router.use((req, res, next) => {
  // Verificar si hay un token en las cabeceras de autorización
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  // Aquí puedes agregar la lógica para verificar si el token es válido usando JWT
  next();
});

module.exports = router;

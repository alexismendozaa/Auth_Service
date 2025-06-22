const express = require('express');
const { checkImage } = require('../controllers/userController');  // Función para analizar la imagen
const router = express.Router();

/**
 * @swagger
 * /analysis-avatar:
 *   post:
 *     summary: Analyze the avatar image for inappropriate content (nudity, violence, etc.)
 *     description: |
 *       This route analyzes the avatar image using Sightengine to check for 
 *       nudity, violence, or explicit content.
 *     tags:
 *       - Analysis
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         type: string
 *         description: |
 *           JWT Token for authentication. Example: 
 *           Authorization: Bearer <token>
 *     responses:
 *       200:
 *         description: Image is appropriate.
 *       400:
 *         description: Image contains inappropriate content and has been deleted.
 *       500:
 *         description: Error analyzing image.
 */

router.post('/analysis-avatar', checkImage);  // Nueva ruta para analizar la imagen

module.exports = router;

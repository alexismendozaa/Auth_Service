const express = require('express');
const userController = require('../controllers/userController');
const multer = require('multer');
const router = express.Router();

// Configure Multer to upload the file directly to S3
const storage = multer.memoryStorage();  
const upload = multer({ storage: storage }).single('file');

/**
 * @swagger
 * /api/users/{userId}/profile-image:
 *   post:
 *     summary: Sube una imagen de perfil
 *     description: Permite que un usuario suba su imagen de perfil.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID del usuario
 *       - in: formData
 *         name: file
 *         required: true
 *         type: file
 *         description: La imagen de perfil del usuario
 *     responses:
 *       200:
 *         description: Imagen de perfil subida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Imagen de perfil actualizada exitosamente"
 *                 imageUrl:
 *                   type: string
 *                   example: "https://s3.amazonaws.com/tu-bucket/profiles/imagen.jpg"
 *       500:
 *         description: Error al subir la imagen
 */
router.post('/:id/profile-image', upload, userController.updateProfilePicture);

module.exports = router;

const express = require('express');
const userController = require('../controllers/userController');
const multer = require('multer');
const router = express.Router();

// Configure Multer to upload the file directly to S3
const storage = multer.memoryStorage();  
const upload = multer({ storage: storage }).single('file');

/**
 * @swagger
 * /api/users/profile-image:
 *   post:
 *     summary: Upload a profile image using a temporary token
 *     description: Allows a user to upload a profile image by using a one-time token received during registration.
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Temporary token received after registration
 *       - in: formData
 *         name: file
 *         required: true
 *         type: file
 *         description: The profile image of the user
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *       400:
 *         description: Bad request, token missing or expired
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized, invalid or expired token
 */
router.post('/profile-image', upload, userController.updateProfilePicture);

module.exports = router;

const axios = require('axios');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Function to upload the image directly to the public S3 bucket
async function uploadToS3(fileBuffer, filename) {
  const bucketUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;  // URL of public bucket
  const filePath = filename;

  try {
    // Make the PUT request to the public S3 bucket with axios
    const uploadUrl = `${bucketUrl}/${filePath}`;

    const response = await axios.put(uploadUrl, fileBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'ACL': 'public-read',
      }
    });

    // Return the public URL of the file
    return `${bucketUrl}/${filePath}`;
  } catch (error) {
    throw new Error('Error uploading image to S3: ' + error.message);
  }
}

// Function to update the profile picture using a temporary token
async function updateProfilePicture(req, res) {
  const tempToken = req.headers['authorization'];  // Assuming token is sent in the header

  if (!tempToken) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    // Verify the token and extract the userId
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);

    // Find the user by userId decoded from the token
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const file = req.file;

    // Upload the image to S3
    const imageUrl = await uploadToS3(file.buffer, `${user.id}-${file.originalname}`);

    // Log the image URL to ensure it's being generated correctly
    console.log('Generated Image URL:', imageUrl);

    
    const [updatedRows] = await User.update(
      { profileImage: imageUrl }, 
      { where: { id: user.id } } // Find the user by their id
    );

    // Log to check if the update was successful
    console.log('Rows updated:', updatedRows);

    // If no rows were updated, there might be an issue with the update process
    if (updatedRows === 0) {
      return res.status(500).json({ message: 'Failed to update profile image URL in database' });
    }

    // Return the image URL after successful upload
    return res.status(200).json({ message: 'Profile picture updated successfully', imageUrl });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = { updateProfilePicture };

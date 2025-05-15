const axios = require('axios');
const fs = require('fs');
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
    throw new Error('Error al subir la imagen a S3: ' + error.message);
  }
}

// Function to update the profile picture
async function updateProfilePicture(req, res) {
  const userId = req.params.id; 
  const file = req.file; 

  if (!file) {
    return res.status(400).send('No se ha subido ninguna imagen');
  }

  try {
    const fileBuffer = file.buffer;  // We use the file loaded in memory
    const filename = file.originalname;

   // Upload the image to the public S3 bucket
    const imageUrl = await uploadToS3(fileBuffer, filename);

    // Update the image URL in the database
    await User.update({ profileImage: imageUrl }, { where: { id: userId } });

    return res.status(201).json({ message: 'Imagen de perfil actualizada', imageUrl });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


module.exports = { updateProfilePicture };

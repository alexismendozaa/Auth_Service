const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
dotenv.config();

// AWS S3 Configuration without Credentials
const s3Client = new S3Client({
  region: 'us-east-1', 
});

async function uploadToS3(fileBuffer, filename) {
  const params = {
    Bucket: 'buket-avatars', // Bucket name
    Key: 'profiles/' + filename, // Path in the bucket
    Body: fileBuffer,
    ContentType: 'image/jpg', 
    ACL: 'public-read', 
  };

  try {
    const command = new PutObjectCommand(params);
    const uploadResult = await s3Client.send(command);
    return `${params.Bucket}.s3.amazonaws.com/${params.Key}`;
  } catch (error) {
    throw new Error('Error al subir la imagen a S3: ' + error.message);
  }
}

module.exports = {
  uploadToS3,
};

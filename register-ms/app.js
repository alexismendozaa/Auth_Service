const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const dotenv = require('dotenv');
const multer = require('multer');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');

dotenv.config();
const app = express();

// Configuración crucial para el Load Balancer
app.set('trust proxy', true);

// Middleware para servir archivos estáticos (NUEVA LÍNEA)
app.use(express.static('public'));

// Middleware to parse JSON in the request body
app.use(express.json()); 

// CORS configuration
app.use(cors());

// Rutas de autenticación
const authRoutes = require('./routes/authRoutes');  
app.use('/api/auth', authRoutes);

// Multer configuration for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Swagger configuration (MODIFICACIÓN MÍNIMA)
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'API para el manejo de usuarios',
    },
    servers: [{
      url: process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`,
      description: 'Servidor principal'
    }],
    tags: [{
      name: 'Users',
      description: 'Operaciones relacionadas con los usuarios',
    }],
    produces: ['application/json'],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Configuración Swagger UI (MODIFICACIÓN MÍNIMA)
const swaggerUiOptions = {
  customCssUrl: '/swagger-ui/swagger-ui.css',
  customJs: [
    '/swagger-ui/swagger-ui-bundle.js',
    '/swagger-ui/swagger-ui-standalone-preset.js'
  ],
  swaggerOptions: {
    persistAuthorization: true
  }
};

app.use('/api-docs-register', 
  swaggerUi.serveFiles(swaggerDocs, swaggerUiOptions),
  (req, res) => {
    res.send(swaggerUi.generateHTML(swaggerDocs, swaggerUiOptions));
  }
);

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// S3 Client Configuration (AWS SDK v3)
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

// Function to upload the image to S3
async function uploadToS3(fileBuffer, filename) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `profiles/${filename}`,
    Body: fileBuffer,
    ACL: 'public-read', 
  };

  try {
    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);
    console.log('Imagen subida a S3:', data);
    return `${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/profiles/${filename}`;
  } catch (err) {
    console.error('Error al subir la imagen a S3:', err);
    throw new Error('Error al subir la imagen a S3: ' + err.message);
  }
}

// Path to update the profile picture
app.post('/api/users/:userId/profile-picture', upload.single('file'), async (req, res) => {
  const { userId } = req.params;
  const { file } = req;

  if (!file) {
    return res.status(400).send('No se ha proporcionado una imagen.');
  }

  try {
    const imageUrl = await uploadToS3(file.buffer, file.originalname);

    await sequelize.models.User.update(
      { profileImage: imageUrl },
      { where: { id: userId } }
    );

    return res.status(201).send({ message: 'Imagen actualizada correctamente', imageUrl });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
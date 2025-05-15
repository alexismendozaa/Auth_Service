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

const app = express(); // Inicialización de app antes de usarla

// Servir archivos estáticos de Swagger UI
app.use('/api-docs-register', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist')));

// Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(express.json()); 

const authRoutes = require('./routes/authRoutes');  
app.use('/api/auth', authRoutes);  

// Configuración de CORS
app.use(cors());

// Configuración de Multer para el manejo de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'API para el manejo de usuarios',
    },
    tags: [
      {
        name: 'Users',
        description: 'Operaciones relacionadas con los usuarios',
      },
    ],
    produces: ['application/json'],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Ruta para Swagger UI
app.use('/api-docs-register', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Configuración del cliente de S3 (AWS SDK v3)
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

// Función para subir la imagen a S3
async function uploadToS3(fileBuffer, filename) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME, // Nombre del bucket
    Key: `profiles/${filename}`, // Ruta del archivo dentro del bucket
    Body: fileBuffer, // Contenido del archivo
    ACL: 'public-read', 
  };

  try {
    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command); // Subir la imagen a S3
    console.log('Imagen subida a S3:', data);
    return `${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/profiles/${filename}`;
  } catch (err) {
    console.error('Error al subir la imagen a S3:', err);
    throw new Error('Error al subir la imagen a S3: ' + err.message);
  }
}

// Ruta para actualizar la imagen de perfil
app.post('/api/users/:userId/profile-picture', upload.single('file'), async (req, res) => {
  const { userId } = req.params;
  const { file } = req;

  if (!file) {
    return res.status(400).send('No se ha proporcionado una imagen.');
  }

  try {
    const imageUrl = await uploadToS3(file.buffer, file.originalname);

    // Actualizar la URL de la imagen en la base de datos (actualiza el modelo de Usuario)
    await sequelize.models.User.update(
      { profileImage: imageUrl },
      { where: { id: userId } }
    );

    return res.status(201).send({ message: 'Imagen actualizada correctamente', imageUrl });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

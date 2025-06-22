const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();  // Cargar variables de entorno desde .env
const userRoutes = require('./routes/userRoutes');  // Asegúrate de que la ruta sea correcta
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3029; // Puerto solicitado

// Middleware para permitir el acceso desde cualquier origen
app.use(cors());

// Middleware para manejar los datos JSON y los formularios con archivos
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use( userRoutes);  // Las rutas que hemos creado en userRoutes.js, como '/analysis-avatar'

// Configuración de Swagger para la nueva ruta
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'API para Análisis de Imágenes',
      description: 'Análisis de imágenes para detectar contenido inapropiado',
      contact: {
        name: 'Desarrollador',
      },
      servers: ['http://localhost:3029'],
    },
    securityDefinitions: {
      BearerAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer <token>"',
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./routes/userRoutes.js'],  // Asegúrate de que Swagger reconozca las rutas desde userRoutes.js
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs-analysis-avatar', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

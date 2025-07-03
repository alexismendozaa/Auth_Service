const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();  
const userRoutes = require('./routes/userRoutes'); 
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3029; 


app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/health', (req, res) => {
  res.status(200).send('ok');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use( userRoutes); 

// Swagger
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
        BearerAuth: []
      },
    ],
  },
  apis: ['./routes/userRoutes.js'],  
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs-analysis-avatar', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.listen(port, () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
});

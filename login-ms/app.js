const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/authRoutes');
const { sequelize } = require('./config/db'); 
const path = require('path');
dotenv.config();
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: '*',  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Login Microservice API',
      version: '1.0.0',
      description: 'API para la autenticación de usuarios',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/authRoutes.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs-login', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', authRoutes);

// Check the connection to the database
sequelize.authenticate()
  .then(() => {
    console.log('¡Conexión exitosa a la base de datos!');
    
    // Sync models after checking connection
    sequelize.sync({ force: false }) 
      .then(() => {
        console.log('Modelos sincronizados correctamente con la base de datos.');

        // Start the server only after connection and synchronization are successful
        const PORT = process.env.PORT || 3001; 
        app.listen(PORT, () => {
          console.log(`Servidor corriendo en puerto ${PORT}`);
        });
      })
      .catch((error) => {
        console.error('Error al sincronizar los modelos:', error);
      });
  })
  .catch((error) => {
    console.error('No se pudo conectar a la base de datos:', error);
  });

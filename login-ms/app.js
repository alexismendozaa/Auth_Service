const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/authRoutes');
const { sequelize } = require('./config/db');
const path = require('path');
dotenv.config();

const app = express();

// Configuración para trabajar detrás de proxy (NUEVA LÍNEA)
app.set('trust proxy', true);  // Esto es crucial para el Load Balancer

app.use(bodyParser.json());

// Configuración de Swagger (MODIFICACIÓN SEGURA)
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Login Microservice API',
      version: '1.0.0',
      description: 'API para la autenticación de usuarios',
    },
    servers: [  // NUEVO: Ayuda con las URLs absolutas
      {
        url: process.env.APP_URL || 'http://localhost:3001',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Local server'
      }
    ]
  },
  apis: ['./routes/authRoutes.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Configuración Swagger UI (MODIFICACIÓN SEGURA)
const swaggerUiOptions = {
  customSiteTitle: "Login Microservice API",
  swaggerOptions: {
    persistAuthorization: true,
    validatorUrl: null  // Desactiva el validador para evitar problemas
  }
};

app.use('/api-docs-login', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Rutas existentes (SIN MODIFICACIONES)
app.use('/api', authRoutes);

// Conexión a la base de datos (SIN MODIFICACIONES)
sequelize.authenticate()
  .then(() => {
    console.log('¡Conexión exitosa a la base de datos!');
    
    sequelize.sync({ force: false })
      .then(() => {
        console.log('Modelos sincronizados correctamente con la base de datos.');

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
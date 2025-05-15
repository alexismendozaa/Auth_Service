FROM node:16

WORKDIR /usr/src/app

# Copiar solo los archivos necesarios para instalar dependencias primero
COPY package*.json ./

RUN npm install

# Copiar el resto de los archivos
COPY . .

# Asegurar que los archivos estáticos de Swagger UI estén disponibles
RUN cp -r node_modules/swagger-ui-dist public/ || echo "Swagger UI files not found, continuing..."

EXPOSE 3000

CMD ["node", "app.js"]
FROM node:16

WORKDIR /app

# 1. Copiar archivos de dependencias primero para aprovechar caché de Docker
COPY package*.json ./

# 2. Instalar dependencias exactas (mejor para producción)
RUN npm ci

# 3. Copiar el resto de los archivos
COPY . .

# 4. Asegurar que los archivos estáticos de Swagger UI estén disponibles
RUN mkdir -p public/swagger-ui && \
    cp -r node_modules/swagger-ui-dist/* public/swagger-ui/ || echo "Swagger UI files copied"

# 5. Exponer el puerto que ya estás usando
EXPOSE 3001

# 6. Comando de inicio (igual al tuyo actual)
CMD ["node", "app.js"]
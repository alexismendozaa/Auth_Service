FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copia explícita de los archivos de Swagger UI
RUN mkdir -p public/swagger-ui && \
    cp -r node_modules/swagger-ui-dist/* public/swagger-ui/

COPY . .

EXPOSE 3001

CMD ["node", "app.js"]
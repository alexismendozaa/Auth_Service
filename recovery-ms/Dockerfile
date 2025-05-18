FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3002

# Comando para ejecutar la aplicación
CMD ["node", "app.js"]

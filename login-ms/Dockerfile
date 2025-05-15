FROM node:16

WORKDIR /app

COPY package*.json ./

# Primero intenta npm ci, si falla usa npm install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

EXPOSE 3001

CMD ["node", "app.js"]
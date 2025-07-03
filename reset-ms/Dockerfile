FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3003

CMD ["node", "app.js"]
# Etapa 1: Construcción (instala dependencias y prepara app)
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Etapa 2: Imagen de solo ejecución
FROM node:18-slim
WORKDIR /app
COPY package*.json ./
COPY --from=build /app/app.js ./
COPY --from=build /app/config ./config
COPY --from=build /app/controllers ./controllers
COPY --from=build /app/models ./models
COPY --from=build /app/routes ./routes

RUN npm ci --omit=dev

EXPOSE 3003
CMD ["node", "app.js"]
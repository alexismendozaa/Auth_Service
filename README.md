
# 🛡️ Auth Service System

This repository contains a modular **Auth system** built with Node.js using a microservices architecture. It includes two independent services:

- 🔐 **Login Microservice** – Handles user authentication.
- 📝 **Register Microservice** – Handles new user registration.

Each microservice runs independently and communicates via HTTP.

---

## 🧱 Architecture Overview

The LOGIN system is split into two microservices:

```
LOGIN
│
├── login/       # Authentication logic
│   ├── app.js
│   ├── routes/
│   ├── controllers/
│   └── models/
│
└── registro/    # User registration logic
    ├── app.js
    ├── routes/
    ├── controllers/
    └── models/
```

---

## 🚀 Getting Started

### Requirements

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Docker](https://www.docker.com/) (optional)

---

## ▶️ How to Run

### 🧪 Run Locally

Install dependencies and start each service using `npm`:

#### 1. Register Microservice

```bash
cd register-ms
npm install
npm run dev
```

- Runs on `http://localhost:3000`
- Example endpoint: `POST http://localhost:3000/register`

#### 2. Login Microservice

```bash
cd login-ms
npm install
npm run dev
```

- Runs on `http://localhost:3001`
- Example endpoint: `POST http://localhost:3001/login`

> The default ports can be changed in the `.env` file of each service.

---

### 🐳 Run with Docker

Each microservice has its own `Dockerfile`.

#### Step 1: Build the images

```bash
docker build -t login-service ./login
docker build -t register-service ./registro
```

#### Step 2: Run the containers

```bash
docker run -d -p 3001:3001 --name login login-ms
docker run -d -p 3000:3000 --name register register-ms
```

---

## 🔌 API Endpoints

### Login Microservice

- `POST /login` – Authenticate a user

### Register Microservice

- `POST /register` – Register a new user

> Both microservices follow RESTful conventions and include modular route, controller, and model structures.

---

## 📦 Technologies Used

- Node.js
- Express.js
- Amazon RDS 
- Docker
- Swagger (for API documentation in `register/swagger.json`)

---

## 📁 Project Status

✅ Basic login and registration features  
🧪 Swagger docs available (for registration)  
🔐 JWT integration optional  
📈 Scalable microservice layout

---


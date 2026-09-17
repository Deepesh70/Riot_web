# 🛠️ Setup & Running Guide: Riot ReImagined

This guide provides end-to-end instructions for running **Riot ReImagined** locally using **npm Workspaces** or fully containerized with **Docker Compose**.

---

## 1. Prerequisites

Before getting started, make sure you have the following installed:
* **Node.js**: `v20.x` or `v22.x` LTS
* **npm**: `v10.x` or higher
* **Git**
* **Docker & Docker Compose** *(optional, for containerized execution)*
* **MongoDB** *(optional, if running locally without Docker)*

---

## 2. Quickstart via npm Workspaces (Recommended for Dev)

### Step 1: Clone & Install Dependencies
From the root of the repository:
```bash
# Clone the repository
git clone https://github.com/Deepesh70/Riot_web.git
cd Riot_web

# Install all monorepo dependencies in one command
npm install
```

### Step 2: Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
cp .env.example backend/.env
cp .env.example frontend/.env
```

Edit `backend/.env` with your credentials:
```ini
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
MONGO_URI=mongodb://localhost:27017/riot_reimagined
JWT_SECRET=your_super_secret_jwt_key_here
# Optional external keys:
RIOT_API_KEY=RGAPI-your-key-here
HENRIK_DEV_API_KEY=HDEV-your-key-here
```

### Step 3: Start Development Servers Concurrently
From the repository root, start both the backend API and Vite frontend simultaneously:
```bash
npm run dev
# or
npm run dev:all
```
* **Frontend**: http://localhost:5173
* **Backend API**: http://localhost:5000
* **API Health Check**: http://localhost:5000/api/health

### Individual Service Commands
```bash
# Run only frontend
npm run dev:frontend

# Run only backend
npm run dev:backend

# Run full monorepo tests
npm test

# Run backend test suite
npm run test:backend

# Run frontend tests
npm run test:frontend

# Run ESLint validation
npm run lint

# Build production bundle
npm run build
```

---

## 3. Containerized Setup via Docker Compose

Run the entire production-grade topology (MongoDB, Redis, Backend API, and Nginx Web Proxy) with one command:

```bash
# Build and start all 4 services in the background
docker compose up --build -d
```

### Inspecting Running Services
```bash
# Check container status
docker compose ps

# View real-time logs
docker compose logs -f api
docker compose logs -f web

# Stop all containers
docker compose down
```

### Access URLs in Docker
* **Frontend Web App**: http://localhost (Port 80 via Nginx reverse proxy)
* **Backend API direct**: http://localhost:5000
* **MongoDB**: `localhost:27017`
* **Redis**: `localhost:6379`

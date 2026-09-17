<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/GSAP-3.13-0AE448?style=for-the-badge&logo=greensock&logoColor=white" />
</p>

# 🎮 Riot ReImagined - Enterprise Gaming Portal & Community Hub

A production-grade, full-stack gaming portal and analytics hub celebrating the Riot Games universe. Built as an **npm Workspaces Monorepo** featuring a high-performance **React 19** frontend with **GSAP** scroll-triggered animations, an **Express.js BFF (Backend-For-Frontend)**, multi-tier caching with **Redis**, on-demand **K-Means ML smurf detection**, and full **Docker Compose** containerization.

---

## 🏗️ System Architecture

```
                                [Web Browser / Client]
                                          │
                         (JWT Auth Token / Guest Session)
                                          │
                                          ▼
                         [Nginx Reverse Proxy & Static Host]
                                          │
                        /api/*            │        Static SPA Assets
                                          ▼
                      [Riot ReImagined API Server (Node.js)]
                 ┌────────────────────────┴────────────────────────┐
                 ▼                                                 ▼
        [Security & Resilience]     [Persistence & ML Engine]    [External Integrations]
        - Helmet, Strict CORS       - MongoDB (Mongoose ODM)     - Upstash / Local Redis
        - Express Rate Limiting     - K-Means Smurf Clustering   - Riot Games API
        - Structured JSON Logs      - User Auth (JWT & Bcrypt)   - HenrikDev Valorant API
        - Non-root Docker User
```

---

## ⭐ Production Highlights

| Feature | Description |
| :--- | :--- |
| 🛡️ **Zero Secret Exposure** | Riot Games and HenrikDev private API keys live strictly on the backend service. |
| ⚡ **Multi-Tier Caching** | Redis caching layer prevents third-party API rate limit spikes and optimizes repeated stat queries. |
| 🤖 **AI-Driven Smurf Detector** | Unsupervised K-Means clustering algorithm evaluates KD, ACS, and round deviations to flag smurf accounts. |
| 🎬 **Cinematic Hero Experience** | Live background video carousel with audio protocol toggle, GSAP scroll triggers, and 3D tilt interactions. |
| 📊 **Real-Time Match Analytics** | Live player search fetching current rank badges, match history, and performance stats across Valorant and LoL. |
| 🐳 **Full Containerization** | Multi-stage Dockerfiles and `docker-compose.yml` orchestrating MongoDB, Redis, API, and Nginx. |
| 🤖 **Automated CI Pipeline** | GitHub Actions validating backend tests, ESLint rules, and 100% frontend production builds on PR/push. |

---

## 📂 Clean Monorepo Directory Structure

```
Riot_web/
├── .github/
│   ├── workflows/ci.yml         # Fullstack GitHub Actions CI pipeline
│   └── PULL_REQUEST_TEMPLATE.md # Standard PR checklist & change categorization
├── frontend/                    # 🌐 React 19 Client Application
│   ├── src/                     # Components, pages, context, and styles
│   │   ├── components/          # Hero, Navbar, Footer, AgentDetails, UI
│   │   ├── context/             # AudioContext and AuthContext
│   │   ├── pages/               # Home, Games, ValorantPage, PlayerStats, SmurfDetector
│   │   └── __tests__/           # Frontend smoke & integrity tests
│   ├── public/                  # Media assets (audio, images, videos)
│   ├── Dockerfile               # Multi-stage production Nginx container
│   ├── nginx.conf               # Nginx reverse proxy & gzip configuration
│   └── package.json             # Frontend dependencies & scripts
├── backend/                     # ⚙️ Node.js/Express BFF & API Server
│   ├── Controllers/             # Auth, News, Riot, and Valorant controllers
│   ├── Middleware/              # Auth, RateLimiter, Security, ErrorHandler, Validator
│   ├── Models/                  # Mongoose User model & schemas
│   ├── Routes/                  # Auth, News, Riot, Valorant, and Health endpoints
│   ├── Utils/                   # Redis client, logger, K-Means clustering
│   ├── tests/                   # Backend integration & unit tests
│   ├── Dockerfile               # Multi-stage production backend container (non-root)
│   └── package.json             # Backend dependencies & scripts
├── docs/                        # 📚 Technical documentation suite
│   ├── README.md                # Documentation index
│   ├── project-overview.md      # System goals, tech stack, and user flows
│   ├── setup-guide.md           # Local development & Docker Compose guide
│   ├── architecture-guide.md    # Topology, BFF pattern, and caching design
│   ├── feature-walkthrough.md   # Tour of key platform capabilities
│   └── github-workflows-guide.md# Universal CI/CD pipeline and PR standards
├── docker-compose.yml           # Production stack (MongoDB + Redis + API + Web)
├── package.json                 # Root monorepo workspaces orchestrator
├── package-lock.json            # Monorepo lockfile
├── .gitignore                   # Multi-tier ignore rules (DBs, envs, logs)
└── .env.example                 # Unified monorepo environment template
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v20.x` or `v22.x` LTS
* **npm**: `v10.x` or higher
* **Docker & Docker Compose** *(optional, for containerized run)*

### Quickstart (Local Monorepo)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Deepesh70/Riot_web.git
   cd Riot_web
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   cp .env.example backend/.env
   cp .env.example frontend/.env
   ```

4. **Start Development Servers (Concurrently):**
   ```bash
   npm run dev
   # or
   npm run dev:all
   ```
   * **Frontend Application**: http://localhost:5173
   * **Backend API**: http://localhost:5000
   * **API Health Check**: http://localhost:5000/api/health

---

## 🐳 Running with Docker Compose

Spin up MongoDB, Redis, the Express API, and Nginx Web with a single command:

```bash
docker compose up --build -d
```

* **Frontend Web App**: http://localhost (Port 80 via Nginx proxy)
* **Backend API**: http://localhost:5000

---

## 🛠 Available Monorepo Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` / `npm run dev:all` | Runs backend and frontend concurrently with colored prefixes |
| `npm run dev:frontend` | Runs only the Vite frontend dev server |
| `npm run dev:backend` | Runs only the Express backend dev server |
| `npm test` | Executes both backend tests and frontend smoke tests |
| `npm run test:backend` | Runs the Node test runner on backend test suites |
| `npm run test:frontend` | Runs frontend asset and architecture integrity tests |
| `npm run lint` | Validates frontend code with ESLint |
| `npm run build` | Compiles the production bundle for the frontend |

---

## 📄 License & Contributing

Contributions are welcome! Please open an issue or pull request adhering to [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md).

Licensed under the **ISC License**.

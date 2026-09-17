# 📖 Project Overview: Riot ReImagined

## 1. Executive Summary

**Riot ReImagined** is a modern, reimagined web portal and community hub celebrating the Riot Games gaming ecosystem (Valorant, League of Legends, and Esports). It merges an immersive, cinematic frontend powered by **React 19** and **GSAP** with a resilient **Express.js** Backend-For-Frontend (BFF) integrating Riot Games and HenrikDev APIs.

---

## 2. Core Value Proposition

* **Immersive Audio-Visual Experience**: Custom video backdrops, smooth scroll-triggered 3D-tilt animations, and ambient soundscapes that evoke the cinematic aesthetic of Riot titles.
* **Unified Gaming Hub**: Deep agent rosters, ability breakdowns, competitive map callouts, and esports schedules in a unified responsive UI.
* **Real-Time Performance Analytics**: Real-time Riot ID search providing ranked tiers, MMR history, and match breakdowns.
* **AI-Assisted Smurf Detection**: Statistical K-Means clustering algorithm that evaluates KD ratios, combat scores, and match deviations to detect potential smurf accounts.
* **Zero Client Secret Exposure**: All upstream third-party API keys remain strictly confined to the backend server environment.

---

## 3. Technology Stack

### Frontend Application (`/frontend`)
* **Framework**: React 19 (Vite build engine)
* **Styling**: Tailwind CSS v3 / v4 PostCSS pipeline, custom glitch and cinematic CSS
* **Animations**: GSAP v3 (`@gsap/react`, ScrollTrigger)
* **Routing**: React Router DOM v7
* **Icons**: React Icons, Lucide React
* **State & Audio**: Custom AudioContext, AuthContext, LocalStorage persistence

### Backend API Service (`/backend`)
* **Runtime**: Node.js 20 LTS (ES Modules)
* **Framework**: Express.js
* **Persistence**: MongoDB via Mongoose ODM
* **Caching Layer**: Redis (Upstash REST API client + standalone container fallback)
* **Security & Hardening**: Helmet, CORS origin control, express-rate-limit, bcryptjs password hashing, JWT tokens
* **ML / Analytics**: Multidimensional K-Means clustering utility (`Utils/kmeans.js`)

### DevOps & Infrastructure
* **Containerization**: Multi-stage Dockerfiles for both services + Alpine Nginx reverse proxy
* **Orchestration**: Docker Compose (`mongo`, `redis`, `api`, `web`)
* **CI/CD**: GitHub Actions workflow running automated linting, backend test suites, and frontend build verification on push and PR.

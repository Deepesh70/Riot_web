# 🎮 Riot ReImagined - Technical Documentation

Welcome to the comprehensive technical documentation for **Riot ReImagined**, a production-grade gaming portal and community platform built with **React 19**, **GSAP**, **Express.js**, **MongoDB**, and **Redis**.

---

## 📑 Documentation Index

| Document | Purpose |
| :--- | :--- |
| 📖 **[Project Overview](./project-overview.md)** | High-level summary of the application, goals, technology stack, and user personas. |
| 🛠️ **[Setup & Running Guide](./setup-guide.md)** | Step-by-step instructions for local development (npm workspaces) and containerized deployment (Docker Compose with MongoDB & Redis). |
| 🏛️ **[Architecture Guide](./architecture-guide.md)** | Deep dive into the monorepo design, BFF API, Redis caching, K-Means clustering engine, and security middlewares. |
| 🚀 **[Feature Walkthrough](./feature-walkthrough.md)** | Detailed breakdown of core features: Hero video carousel, interactive Valorant hub, LoL match tracker, Smurf detector, and ambient audio engine. |
| 🤖 **[GitHub Actions CI/CD Guide](./github-workflows-guide.md)** | Blueprint for automated fullstack CI workflows, linting, test suites, build gates, and PR checklists. |
| 🔌 **[API Reference](./api-reference.md)** | Detailed documentation for all backend REST endpoints and external API integrations. |
| 🧭 **[Frontend Routes Guide](./frontend-routes.md)** | Map of client-side React Router pages and user navigation journeys. |

---

## 🏗️ Quick Architecture Snapshot

```
Riot ReImagined Monorepo/
├── 🌐 frontend/     # React 19 Client (GSAP, Tailwind, Vite, Nginx Dockerfile)
├── ⚙️ backend/      # Express.js BFF (MongoDB, Upstash/Redis, Security, Dockerfile)
├── 📚 docs/         # Architectural, setup, and feature specifications
├── 🐳 compose/      # Docker Compose topology (MongoDB 7, Redis 7, API, Web)
└── 🤖 .github/      # Automated CI workflow & PR template
```

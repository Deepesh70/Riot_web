# 🏛️ Architecture Guide: Riot ReImagined

This document details the engineering design, system topology, security layers, and data workflows powering **Riot ReImagined**.

---

## 1. System Topology

```
                                [Browser / Client]
                                         │
                         (JWT Auth Token / Guest Session)
                                         │
                                         ▼
                     [Nginx Reverse Proxy & Static Host (Port 80)]
                                         │
                          /api/*         │     Static SPA Assets
                                         ▼
                    [Express.js BFF API Server (Port 5000)]
                     ┌───────────────────┴───────────────────┐
                     ▼                                       ▼
           [Security & Cache Layer]               [Persistence & Analytics]
           - Helmet, Strict CORS                  - MongoDB (Users, Accounts)
           - Express Rate Limiting                - Mongoose ODM
           - Upstash / Local Redis Caching        - K-Means Smurf Clustering
           - Input Sanitization & Validators      - External API Proxies
                                                    (Riot Games & HenrikDev)
```

---

## 2. Monorepo Organization (npm Workspaces)

The codebase is organized into isolated, independently testable workspaces:

* **`frontend/`**: Pure Single Page Application (SPA). Zero knowledge of database credentials or external API private keys. Interacts strictly via `/api/*` endpoints.
* **`backend/`**: Node.js/Express BFF and data service. Handles upstream third-party calls, JWT verification, rate limiting, and database operations.
* **`docs/`**: Comprehensive specifications, architecture decision records, setup manuals, and workflow blueprints.

---

## 3. Backend-For-Frontend (BFF) Pattern

### Why a BFF?
Direct browser-to-Riot API calls violate third-party security requirements, expose private API keys in client network bundles, and trigger aggressive rate limits. The BFF acts as an intelligent intermediary:

1. **Secret Shielding**: `RIOT_API_KEY` and `HENRIK_DEV_API_KEY` never touch the client.
2. **Data Normalization**: Raw upstream payloads from HenrikDev and Riot Games are reshaped into clean, UI-ready data models.
3. **Resilient Degradation**: If third-party APIs experience downtime or quota exhaustion, cached responses are returned to keep the user interface functional.

---

## 4. Multi-Tier Caching with Redis

To protect upstream rate limits and deliver sub-millisecond response times, the backend integrates a layered caching strategy:

1. **In-Memory / Redis Probe**: Inspects Redis client (`@upstash/redis` or local `redis:7-alpine`).
2. **TTL Strategy**:
   * Agent / Map static data: **24 hours**
   * Player rank & match statistics: **15 minutes**
   * News & Esports schedules: **1 hour**
3. **Graceful Fallback**: If Redis is unavailable, the application logs a warning and proceeds with live fetches without throwing uncaught exceptions.

---

## 5. Smurf Detection Algorithm (K-Means Clustering)

The Smurf Detector (`backend/Utils/kmeans.js`) applies unsupervised K-Means clustering across player match metrics:
* **Features**: Kill/Death Ratio ($KD$), Average Combat Score ($ACS$), Headshot Percentage ($HS\%$), and Win/Loss Rate ($WR$).
* **Convergence**: Iteratively partitions matches into $K$ centroids until centroid movement falls below threshold $\epsilon$ or reaches maximum iterations.
* **Verdict**: Outliers positioned in high-performance clusters significantly above tier medians are flagged for potential smurf activity.

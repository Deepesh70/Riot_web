# Riot_web

Riot_web is a full-stack web project with:

- **front/**: React + Vite frontend (landing pages and UI)
- **backend/**: Node.js + Express API backend

## Project Structure

```text
Riot_web/
├── front/
└── backend/
```

## Prerequisites

- Node.js 16+ (18+ recommended)
- npm

## Run Frontend

```bash
cd front
npm install
npm run dev
```

Frontend scripts:

- `npm run dev` - Start Vite development server
- `npm run build` - Build production assets
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Run Backend

```bash
cd backend
npm install
npm run dev
```

Backend scripts:

- `npm run start` - Start API server with Node.js
- `npm run dev` - Start API server with nodemon
- `npm run data:import` - Import seed data
- `npm run data:destroy` - Destroy seed data

## Notes

- The backend `npm test` script is currently a placeholder and exits with an error by default.
- Frontend and backend can be developed independently in separate terminals.

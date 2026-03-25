# Riot ReImagined

![Riot ReImagined Banner](https://img.shields.io/badge/Status-Development-green) ![License](https://img.shields.io/badge/License-ISC-blue)

**Riot ReImagined** is a cutting-edge, full-stack web application that serves as a modern, reimagined landing and community hub for the Riot Games universe. It combines a visually stunning, high-performance frontend with a robust backend API to deliver an immersive experience for gamers.

The project features a sleek UI with advanced animations powered by GSAP, comprehensive game information (Valorant, League of Legends), esports updates, and a personalized user profile system integrating directly with Riot Games APIs.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [API Documentation](#-api-documentation)
- [Frontend Pages](#-frontend-pages)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎨 Frontend Experience
- **Immersive UI/UX:** Built with **React 19** and **Tailwind CSS** for a responsive, modern design.
- **Advanced Animations:** Utilizes **GSAP (GreenSock Animation Platform)** for scroll-triggered animations, seamless transitions, and interactive elements.
- **Dynamic Routing:** Client-side routing with **React Router v7** for smooth navigation between pages.
- **Rich Media:** Integration of high-quality videos, audio, and imagery to capture the essence of Riot Games.
- **Player Stats:** Real-time lookup of player statistics for Valorant and League of Legends which are fetched using Riot and HenrikDev APIs.

### 🔐 Backend & Security
- **Secure Authentication:** User registration and login protected by **JWT (JSON Web Tokens)** and **bcrypt** password hashing.
- **RESTful API:** A scalable **Express.js** API handling user data and external API requests.
- **Database Integration:** **MongoDB** (via Mongoose) for persistent user storage.
- **External API Integration:**
  - **Riot Games API:** For fetching League of Legends match history and account data.
  - **HenrikDev Valorant API:** For retrieving Valorant MMR and match history.

---

## 🛠 Tech Stack

### Frontend (`/front`)
*   **Framework:** [React 19](https://react.dev/) via [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS v3](https://tailwindcss.com/), PostCSS
*   **Animations:** [GSAP v3](https://greensock.com/gsap/) (@gsap/react)
*   **Routing:** React Router DOM v6/v7
*   **Icons:** React Icons
*   **Utilities:** clsx (class name utility)

### Backend (`/backend`)
*   **Runtime:** [Node.js](https://nodejs.org/)
*   **Framework:** [Express.js v5](https://expressjs.com/) (Beta)
*   **Database:** MongoDB with [Mongoose](https://mongoosejs.com/)
*   **Authentication:** `jsonwebtoken` (JWT), `bcryptjs`
*   **Security:** `cors`, `dotenv`
*   **Dev Tools:** `nodemon`

---

## 📂 Project Structure

```plaintext
Riot_ReImagined/
├── backend/                  # Express.js API Server
│   ├── Middleware/           # Custom middleware
│   │   └── authMiddleware.js # JWT verification middleware
│   ├── Models/               # Mongoose Data Models
│   │   └── user.js           # User schema (name, email, password, riot IDs)
│   ├── Routes/               # API Route Handlers
│   │   └── user.js           # Auth & Riot API routes
│   ├── index.js              # Server entry point & config
│   ├── package.json          # Backend dependencies
│   └── vercel.json           # Backend deployment config
│
├── front/                    # React Frontend Application
│   ├── public/               # Static Assets
│   │   ├── audio/            # Sound effects & background music
│   │   ├── fonts/            # Custom typefaces (Zentry, etc.)
│   │   ├── img/              # Images & sprites
│   │   └── videos/           # Hero & background videos
│   ├── src/                  # Source Code
│   │   ├── components/       # Reusable UI Components & Pages
│   │   │   ├── Hero.jsx      # Main landing hero section
│   │   │   ├── Navbar.jsx    # Navigation bar
│   │   │   ├── About.jsx     # About section
│   │   │   ├── Games.jsx     # Games hub
│   │   │   ├── Login.jsx     # Auth forms
│   │   │   └── ...           # Many more feature components
│   │   ├── App.jsx           # Main App component & Routing
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global styles & Tailwind directives
│   ├── package.json          # Frontend dependencies
│   ├── vite.config.cjs       # Vite configuration
│   └── tailwind.config.cjs   # Tailwind configuration
│
└── README.md                 # Project Documentation
```

---

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16.14.0 or higher)
- **npm** (Node Package Manager)
- **MongoDB** (Local instance or [MongoDB Atlas](https://www.mongodb.com/atlas/database) URI)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/riot-reimagined.git
    cd Riot_ReImagined
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    Open a new terminal window:
    ```bash
    cd front
    npm install
    ```

### Environment Variables

You must configure environment variables for the backend to function correctly.

1.  Create a `.env` file in the `backend/` directory.
2.  Add the following keys:

    ```env
    # Server Configuration
    PORT=5000
    ALLOWED_ORIGINS=http://localhost:5173

    # Database
    MONGO_URI=mongodb+srv://<your_user>:<your_password>@cluster.mongodb.net/riot_db?retryWrites=true&w=majority

    # Security
    JWT_SECRET=your_super_secret_jwt_key_here

    # External APIs (Required for Player Stats)
    RIOT_API_KEY=your_riot_games_api_key
    HENRIK_DEV_API_KEY=your_henrikdev_valorant_api_key
    ```
    > **Note:** Get your Riot API key from the [Riot Developer Portal](https://developer.riotgames.com/) and HenrikDev key from [Unofficial Valorant API](https://docs.henrikdev.xyz/).

---

## 🖥️ Running the Application

### 1. Start the Backend Server
From the `backend/` directory:
```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```
The server will start on `http://localhost:5000`.

### 2. Start the Frontend Client
From the `front/` directory:
```bash
cd front
npm run dev
```
The application will launch at `http://localhost:5173`.

---

## 📡 API Documentation

Base URL: `http://localhost:5000`

### Authentication
| Method | Endpoint | Description | Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Register a new user | `{ email, password, name, riotGameName?, riotTagLine? }` |
| `POST` | `/login` | Authenticate user & get token | `{ email, password }` |
| `GET` | `/profile` | Get current user info (Protected) | **Headers:** `Authorization: Bearer <token>` |

### Riot Games Data
| Method | Endpoint | Description | Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/riot/account/:gameName/:tagLine` | Fetch Riot Account PUUID & Region | `gameName`, `tagLine` |
| `GET` | `/riot/matches/lol/:puuid` | Get last 5 LoL matches | `puuid` |
| `GET` | `/riot/matches/val/:name/:tag` | Get Valorant MMR History | `name`, `tag` (Riot ID) |

---

## 🌐 Frontend Pages

- **`/` (Home):** The main landing page featuring the Hero section, animated story elements, and feature highlights.
- **`/esport`:** Dedicated page for esports news and updates.
- **`/games`:** A hub showcasing Riot's game portfolio.
  - **`/games/valorant/agents/:id`:** Detailed view of a specific Valorant agent.
  - **`/games/valorant/maps/:id`:** Interactive map details.
- **`/login` & `/signup`:** User authentication pages.
- **`/profile`:** User dashboard displaying saved preferences and linked Riot accounts.
- **`/player/:game/:gameName/:tagLine`:** A dynamic stats page that fetches and displays live data for a specific player.
- **`/news`:** Latest updates and articles.
- **`/about`:** Information about the "Riot ReImagined" project vision.

---

## 📦 Deployment

The project is configured for deployment on **Vercel**.

1.  **Frontend:** Connect your GitHub repo to Vercel and set the Root Directory to `front`.  
    *   *Build Command:* `vite build`
    *   *Output Directory:* `dist`
2.  **Backend:** Deploy as a separate project or serverless functions.
    *   Ensure all Environment Variables from your `.env` are added to the Vercel project settings.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure that you adhere to the existing code style and linting rules.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📜 License

This project is licensed under the **ISC License**.

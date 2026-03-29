import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'

// Lazy loading all top-level route pages for structural optimization / web speed
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const News = lazy(() => import('./pages/News'))
const UserProfile = lazy(() => import('./pages/UserProfile'))
const Esport = lazy(() => import('./pages/Esport'))
const PlayerStats = lazy(() => import('./pages/PlayerStats'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const Games = lazy(() => import('./pages/Games'))
const AgentDetails = lazy(() => import('./components/valorant/AgentDetails'))
const MapDetails = lazy(() => import('./components/valorant/MapDetails'))
const SmurfDetector = lazy(() => import('./pages/SmurfDetector'))

const App = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/esport" element={<Esport />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/:game" element={<Games />} />
        <Route path="/games/valorant/agents/:id" element={<AgentDetails />} />
        <Route path="/games/valorant/maps/:id" element={<MapDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/news" element={<News />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/player/:game/:gameName/:tagLine" element={<PlayerStats />} />
        <Route path="/smurf-detector" element={<SmurfDetector />} />
      </Routes>
    </Suspense>
  )
}

export default App;
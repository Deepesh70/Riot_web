import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import News from './components/News'
import UserProfile from './components/UserProfile'
import Esport from './components/Esport'
import PlayerStats from './components/PlayerStats'
import AboutPage from './components/AboutPage'
import Games from './components/Games'
import AgentDetails from './components/AgentDetails'
import MapDetails from './components/MapDetails'

const App = () => {
  return (
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
    </Routes>
  )
}

export default App;
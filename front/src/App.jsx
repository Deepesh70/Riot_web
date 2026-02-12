import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import News from './components/News'
import UserProfile from './components/UserProfile'
import Esport from './components/Esport'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/esport" element={<Esport />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/news" element={<News />} />
      <Route path="/profile" element={<UserProfile />} />
    </Routes>
  )
}

export default App;
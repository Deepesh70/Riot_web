import React from 'react'
// Imports from original App.jsx


import Hero from './Hero'
import About from './About'
import Navbar from './Navbar'
import Feature from './Feature'
import Story from './Story'
import Contact from './Contact'
import Footer from './Footer'

const Home = () => {
    return (
        <main className="min-h-screen overflow-x-hidden">
            <Navbar />
            <Hero />
            <About />
            <Feature />
            <Story />
            <Contact />
            <Footer />
        </main>
    )
}

export default Home

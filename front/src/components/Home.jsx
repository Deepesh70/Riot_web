import React from 'react'



import Hero from './Hero'
import About from './About'
import Navbar from './Navbar'
import Story from './Story'
import Contact from './Contact'
import Footer from './Footer'

const Home = () => {
    return (
        <main className="min-h-screen overflow-x-hidden">
            <Navbar />
            <Hero />
            <About />
            <Story />
            <Contact />
            <Footer />
        </main>
    )
}

export default Home

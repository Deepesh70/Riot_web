import React from 'react'



import Hero from '../components/home/Hero'
import About from '../components/home/About'
import Navbar from '../components/common/Navbar'
import Story from '../components/home/Story'
import Contact from '../components/home/Contact'
import Footer from '../components/common/Footer'

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

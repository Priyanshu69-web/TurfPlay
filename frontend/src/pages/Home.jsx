import React from 'react'

import HeroSection from '../components/HeroSection'
import AvailableSlots from '../components/AvailableSlots'
import ContactSection from '../components/ContactSection'
import Navbar from '../components/Layouts/Navbar'

const Home = () => {
    return (
        <>
            <Navbar />
            <HeroSection />
            <AvailableSlots />
            <ContactSection />
        </>
    )
}

export default Home

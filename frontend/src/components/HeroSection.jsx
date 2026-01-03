import React from 'react'


const HeroSection = () => {
    return (
        <section className="bg-[url('/turf-bg.jpg')] bg-center h-[80vh] flex flex-col justify-center items-center text-white text-center px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Book Your Turf Instantly</h2>
            <p className="text-lg md:text-xl mb-6 max-w-xl">Enjoy stress-free turf booking with real-time slot availability and quick confirmation.</p>
            <a href="#slots" className="bg-green-600 px-6 py-3 rounded-xl text-white hover:bg-green-700 transition">Check Available Slots</a>
        </section>
    );
}


export default HeroSection

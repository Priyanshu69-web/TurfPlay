import { useState } from 'react';

export default function PopularTurfs() {
    const [activeTab, setActiveTab] = useState('football');

    const turfs = {
        football: [
            {
                id: 1,
                name: 'Elite Football Arena',
                location: 'Downtown Sports Complex',
                price: '$45/hour',
                rating: 4.9,
                image: 'https://readdy.ai/api/search-image?query=Premium%20football%20soccer%20turf%20with%20modern%20stadium%20lighting%2C%20artificial%20grass%20field%20with%20white%20line%20markings%2C%20goal%20posts%2C%20professional%20sports%20facility%20with%20glass%20architecture%2C%20evening%20lighting%20with%20dramatic%20shadows%2C%20clean%20minimal%20design%2C%20high-end%20sports%20complex&width=400&height=300&seq=turf-1&orientation=landscape',
                features: ['Floodlights', 'Parking', 'Changing Rooms', 'Referee']
            },
            {
                id: 2,
                name: 'Champions League Ground',
                location: 'Sports City Center',
                price: '$55/hour',
                rating: 4.8,
                image: 'https://readdy.ai/api/search-image?query=Modern%20football%20stadium%20turf%20with%20professional%20lighting%2C%20artificial%20grass%20soccer%20field%2C%20goal%20posts%20with%20nets%2C%20stadium%20seating%20in%20background%2C%20dramatic%20evening%20lighting%2C%20high-tech%20sports%20facility%20design%2C%20clean%20professional%20aesthetic&width=400&height=300&seq=turf-2&orientation=landscape',
                features: ['HD Cameras', 'Sound System', 'VIP Lounge', 'Cafe']
            },
            {
                id: 3,
                name: 'Victory Sports Ground',
                location: 'West End District',
                price: '$40/hour',
                rating: 4.7,
                image: 'https://readdy.ai/api/search-image?query=Football%20turf%20field%20with%20modern%20design%2C%20artificial%20grass%20with%20white%20markings%2C%20goal%20posts%2C%20stadium%20lights%2C%20contemporary%20sports%20complex%20architecture%2C%20professional%20lighting%20setup%2C%20clean%20minimal%20background&width=400&height=300&seq=turf-3&orientation=landscape',
                features: ['Equipment Rental', 'First Aid', 'Coaching', 'Snacks']
            }
        ],
        cricket: [
            {
                id: 4,
                name: 'Lords Cricket Ground',
                location: 'Cricket Plaza',
                price: '$60/hour',
                rating: 4.9,
                image: 'https://readdy.ai/api/search-image?query=Professional%20cricket%20turf%20ground%20with%20pitch%2C%20wickets%2C%20boundary%20ropes%2C%20stadium%20seating%2C%20modern%20sports%20facility%20with%20glass%20architecture%2C%20professional%20lighting%2C%20clean%20minimal%20design%2C%20high-end%20cricket%20complex&width=400&height=300&seq=cricket-1&orientation=landscape',
                features: ['Professional Pitch', 'Scoreboard', 'Practice Nets', 'Equipment']
            },
            {
                id: 5,
                name: 'MCG Sports Arena',
                location: 'Central Sports Hub',
                price: '$50/hour',
                rating: 4.8,
                image: 'https://readdy.ai/api/search-image?query=Cricket%20ground%20with%20professional%20turf%2C%20wickets%2C%20boundary%20markers%2C%20stadium%20lights%2C%20modern%20sports%20complex%20with%20contemporary%20architecture%2C%20evening%20lighting%2C%20professional%20sports%20facility%20design&width=400&height=300&seq=cricket-2&orientation=landscape',
                features: ['Match Analysis', 'Live Streaming', 'Coaching', 'Catering']
            }
        ],
        tennis: [
            {
                id: 6,
                name: 'Wimbledon Court',
                location: 'Tennis Center',
                price: '$35/hour',
                rating: 4.9,
                image: 'https://readdy.ai/api/search-image?query=Professional%20tennis%20court%20with%20artificial%20grass%20surface%2C%20white%20line%20markings%2C%20tennis%20net%2C%20stadium%20seating%2C%20modern%20sports%20facility%20with%20glass%20architecture%2C%20professional%20lighting%2C%20clean%20minimal%20design&width=400&height=300&seq=tennis-1&orientation=landscape',
                features: ['Ball Machine', 'Coaching', 'Towel Service', 'Refreshments']
            },
            {
                id: 7,
                name: 'Grand Slam Arena',
                location: 'Sports District',
                price: '$42/hour',
                rating: 4.8,
                image: 'https://readdy.ai/api/search-image?query=Tennis%20court%20with%20modern%20design%2C%20artificial%20grass%20surface%2C%20tennis%20net%2C%20professional%20lighting%2C%20contemporary%20sports%20complex%20architecture%2C%20evening%20lighting%2C%20high-end%20sports%20facility&width=400&height=300&seq=tennis-2&orientation=landscape',
                features: ['Video Analysis', 'Pro Shop', 'Locker Rooms', 'Spa']
            }
        ]
    };

    return (
        <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-12">
                    <h2 className="text-5xl font-bold text-white mb-6">
                        Popular
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600"> Turfs</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Discover premium sports facilities equipped with state-of-the-art amenities and professional-grade equipment.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-12">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-1 flex space-x-1">
                        {Object.keys(turfs).map((sport) => (
                            <button
                                key={sport}
                                onClick={() => setActiveTab(sport)}
                                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${activeTab === sport
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                    }`}
                            >
                                <i className={`${sport === 'football' ? 'ri-football-line' : sport === 'cricket' ? 'ri-basketball-line' : 'ri-ping-pong-line'} mr-2`}></i>
                                {sport.charAt(0).toUpperCase() + sport.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Turfs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(turfs).map((turf) => (
                        <div key={turf.id} className="group relative bg-gray-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-green-500/30 transition-all duration-500 cursor-pointer">
                            {/* Image */}
                            <div className="relative overflow-hidden">
                                <img
                                    src={turf.image}
                                    alt={turf.name}
                                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                                {/* Rating Badge */}
                                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                                    <i className="ri-star-fill text-yellow-400 text-sm"></i>
                                    <span className="text-white text-sm font-medium">{turf.rating}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                                    {turf.name}
                                </h3>
                                <p className="text-gray-400 mb-4 flex items-center">
                                    <i className="ri-map-pin-line mr-2"></i>
                                    {turf.location}
                                </p>

                                {/* Features */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {turf.features?.slice(0, 3).map((feature, index) => (
                                        <span key={index} className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-sm">
                                            {feature}
                                        </span>
                                    ))}
                                </div>

                                {/* Price and Action */}
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold text-green-400">
                                        {turf.price}
                                    </div>
                                    <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 cursor-pointer whitespace-nowrap">
                                        Book Now
                                    </button>
                                </div>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <button className="border-2 border-green-500 text-green-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-500 hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap">
                        <i className="ri-grid-line mr-2"></i>
                        View All Turfs
                    </button>
                </div>
            </div>
        </section>
    );
}
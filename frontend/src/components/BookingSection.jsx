import { useState } from 'react';

export default function BookingSection() {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedSport, setSelectedSport] = useState('football');

    const timeSlots = [
        '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM',
        '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
        '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
    ];

    const sports = [
        { id: 'football', name: 'Football', icon: 'ri-football-line' },
        { id: 'cricket', name: 'Cricket', icon: 'ri-basketball-line' },
        { id: 'tennis', name: 'Tennis', icon: 'ri-ping-pong-line' }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-white mb-6">
                        Quick
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600"> Booking</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Book your preferred turf in seconds with our streamlined booking system. Select your sport, date, and time.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Booking Form */}
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
                        <h3 className="text-2xl font-bold text-white mb-8">Reserve Your Slot</h3>

                        <form className="space-y-6">
                            {/* Sport Selection */}
                            <div>
                                <label className="block text-white font-medium mb-4">Select Sport</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {sports.map((sport) => (
                                        <button
                                            key={sport.id}
                                            type="button"
                                            onClick={() => setSelectedSport(sport.id)}
                                            className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer whitespace-nowrap ${selectedSport === sport.id
                                                ? 'border-green-500 bg-green-500/10 text-green-400'
                                                : 'border-gray-600 hover:border-gray-500 text-gray-300'
                                                }`}
                                        >
                                            <i className={`${sport.icon} text-2xl block mb-2`}></i>
                                            <span className="text-sm font-medium">{sport.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date Selection */}
                            <div>
                                <label className="block text-white font-medium mb-4">Select Date</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-green-500 focus:outline-none transition-colors"
                                />
                            </div>

                            {/* Time Slots */}
                            <div>
                                <label className="block text-white font-medium mb-4">Available Time Slots</label>
                                <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => setSelectedTime(time)}
                                            className={`p-3 rounded-lg border transition-all duration-300 cursor-pointer whitespace-nowrap ${selectedTime === time
                                                ? 'border-green-500 bg-green-500/10 text-green-400'
                                                : 'border-gray-600 hover:border-gray-500 text-gray-300'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Player Count */}
                            <div>
                                <label className="block text-white font-medium mb-4">Number of Players</label>
                                <select className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-green-500 focus:outline-none transition-colors pr-8">
                                    <option>Select players</option>
                                    <option>1-5 players</option>
                                    <option>6-10 players</option>
                                    <option>11-15 players</option>
                                    <option>16-20 players</option>
                                    <option>20+ players</option>
                                </select>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 cursor-pointer whitespace-nowrap"
                            >
                                <i className="ri-calendar-check-line mr-2"></i>
                                Book Now - $45/hour
                            </button>
                        </form>
                    </div>

                    {/* Booking Benefits */}
                    <div className="space-y-8">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                                <i className="ri-lightning-line text-white text-xl"></i>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white mb-2">Instant Confirmation</h4>
                                <p className="text-gray-300">Get immediate booking confirmation with QR code access to your reserved turf.</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                <i className="ri-shield-check-line text-white text-xl"></i>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white mb-2">Secure Payment</h4>
                                <p className="text-gray-300">Safe and encrypted payment processing with multiple payment options available.</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                                <i className="ri-refresh-line text-white text-xl"></i>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white mb-2">Flexible Cancellation</h4>
                                <p className="text-gray-300">Cancel or reschedule your booking up to 2 hours before without any charges.</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                                <i className="ri-customer-service-line text-white text-xl"></i>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white mb-2">24/7 Support</h4>
                                <p className="text-gray-300">Round-the-clock customer support to assist you with any booking queries.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
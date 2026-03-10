import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetTurfsQuery } from '../redux/api/turfApi';
import { MapPin, Loader2 } from 'lucide-react';

const FACILITY_ICONS = {
  lights: '💡',
  parking: '🅿️',
  washroom: '🚻',
  canteen: '🍽️',
  changeroom: '👕',
  drinkingWater: '💧',
};

export default function PopularTurfs() {
  const { data, isLoading } = useGetTurfsQuery();
  const turfs = data?.data || [];

  return (
    <section id="popular-turfs" className="py-20 bg-gradient-to-b from-gray-900 to-black scroll-mt-20">
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

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
          </div>
        ) : turfs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>No turfs available yet. Check back soon!</p>
            <Link to="/booking" className="mt-4 inline-block text-green-400 hover:text-green-300 font-medium">
              Go to Booking
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {turfs.map((turf) => {
                const facilities = turf.facilities || [];
                const amenities = turf.amenities
                  ? Object.entries(turf.amenities || {})
                      .filter(([, v]) => v)
                      .map(([k]) => k)
                  : [];
                const allFacilities = [...new Set([...facilities, ...amenities])];

                return (
                  <div
                    key={turf._id}
                    className="group relative bg-gray-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-green-500/30 transition-all duration-500"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden h-48 bg-gray-800">
                      {turf.images?.[0] ? (
                        <img
                          src={turf.images[0]}
                          alt={turf.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-900/30 to-gray-800">
                          <span className="text-6xl opacity-50">🏟️</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                        {turf.name}
                      </h3>
                      <p className="text-gray-400 mb-4 flex items-center gap-1">
                        <MapPin size={14} />
                        {turf.location}
                      </p>

                      {/* Facilities */}
                      {allFacilities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {allFacilities.slice(0, 4).map((f) => (
                            <span
                              key={f}
                              className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-xs capitalize"
                            >
                              {FACILITY_ICONS[f] || '•'} {f.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Price and Action */}
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-green-400">
                          ₹{turf.pricePerSlot || 0}/hr
                        </div>
                        <Link
                          to="/booking"
                          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 text-sm font-medium whitespace-nowrap"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 border-2 border-green-500 text-green-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-500 hover:text-white transition-all duration-300"
              >
                <span>View All Turfs & Book</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { useGetTurfsQuery } from '../redux/api/turfApi';
import { MapPin, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FACILITY_ICONS = {
  lights: '💡',
  parking: '🅿️',
  washroom: '🚻',
  canteen: '🍽️',
  changeroom: '👕',
  drinkingWater: '💧',
};

export default function PopularTurfs() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading } = useGetTurfsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const turfs = data?.data || [];

  return (
    <section id="popular-turfs" className="scroll-mt-20 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="mb-6 text-4xl font-bold sm:text-5xl">
            Popular
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600"> Turfs</span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-muted sm:text-xl">
            Discover premium sports facilities equipped with state-of-the-art amenities and professional-grade equipment.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
          </div>
        ) : !isAuthenticated ? (
          <div className="py-16 text-center text-muted">
            <p>Sign in to view your organization&apos;s turf catalog and live availability.</p>
            <Link to="/login" className="mt-4 inline-block text-green-400 hover:text-green-300 font-medium">
              Sign in to continue
            </Link>
          </div>
        ) : turfs.length === 0 ? (
          <div className="py-16 text-center text-muted">
            <p>No turfs available yet. Check back soon!</p>
            <Link to="/booking" className="mt-4 inline-block text-green-400 hover:text-green-300 font-medium">
              Go to Booking
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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
                    className="soft-panel group relative overflow-hidden rounded-[1.5rem] transition-all duration-500 hover:border-green-500/30"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-slate-200/60 dark:bg-slate-800">
                      {turf.images?.[0] ? (
                        <img
                          src={turf.images[0]}
                          alt={turf.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-500/10 to-slate-700/20">
                          <span className="text-6xl opacity-50">🏟️</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="mb-2 text-xl font-bold text-[var(--app-text)] transition-colors group-hover:text-green-500">
                        {turf.name}
                      </h3>
                      <p className="mb-4 flex items-center gap-1 text-muted">
                        <MapPin size={14} />
                        {turf.location}
                      </p>

                      {/* Facilities */}
                      {allFacilities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {allFacilities.slice(0, 4).map((f) => (
                            <span
                              key={f}
                              className="rounded-full border border-[var(--app-border)] bg-white/10 px-3 py-1 text-xs capitalize text-muted"
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
                          className="brand-gradient whitespace-nowrap rounded-full px-6 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02]"
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
                className="inline-flex items-center gap-2 rounded-full border-2 border-green-500 px-8 py-4 text-lg font-semibold text-green-500 transition-all duration-300 hover:bg-green-500 hover:text-white"
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

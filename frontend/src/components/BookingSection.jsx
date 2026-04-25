import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, CheckCircle2, CircleDollarSign, Clock3, LifeBuoy, ShieldCheck, Sparkles, Trophy } from 'lucide-react';

export default function BookingSection() {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedSport, setSelectedSport] = useState('football');

    const timeSlots = [
        '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM',
        '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
        '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
    ];

    const sports = [
        { id: 'football', name: 'Football', icon: Trophy },
        { id: 'cricket', name: 'Cricket', icon: Sparkles },
        { id: 'tennis', name: 'Tennis', icon: CheckCircle2 }
    ];

    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Navigate to booking page with pre-filled data
        navigate('/booking', {
            state: {
                sport: selectedSport,
                date: selectedDate || today,
                preferredTime: selectedTime,
            }
        });
    };

    return (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="surface-card-strong mx-auto max-w-7xl overflow-hidden p-5 sm:p-8 lg:p-10">
                <div className="text-center mb-10 sm:mb-16">
                    <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500">
                        Fast reservations
                    </span>
                    <h2 className="mt-5 text-3xl font-semibold text-[var(--app-text)] sm:text-4xl lg:text-5xl">
                        Quick booking,
                        <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent"> premium experience</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted sm:text-lg">
                        Book your preferred turf in seconds with our streamlined booking system. Select your sport, date, and time.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    {/* Booking Form */}
                    <div className="rounded-[1.75rem] border border-[var(--app-border)] bg-white/6 p-5 sm:p-8">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <h3 className="text-xl sm:text-2xl font-semibold text-[var(--app-text)]">Reserve your slot</h3>
                                <p className="mt-1 text-sm text-muted">Fast selections, smooth on mobile, clear pricing.</p>
                            </div>
                            <div className="brand-gradient hidden h-12 w-12 items-center justify-center rounded-2xl text-white sm:flex flex-shrink-0">
                                <CalendarDays size={20} />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Sport selector */}
                            <div>
                                <label className="mb-3 block font-medium text-[var(--app-text)]">Select sport</label>
                                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                    {sports.map((sport) => (
                                        <button
                                            key={sport.id}
                                            type="button"
                                            onClick={() => setSelectedSport(sport.id)}
                                            className={`rounded-2xl border p-3 sm:p-4 transition-all duration-300 ${selectedSport === sport.id
                                                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                                                : 'border-[var(--app-border)] bg-white/5 text-muted hover:border-emerald-500/50 hover:text-[var(--app-text)]'
                                            }`}
                                        >
                                            <sport.icon size={20} className="mx-auto mb-1.5" />
                                            <span className="text-xs sm:text-sm font-medium block">{sport.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date picker */}
                            <div>
                                <label className="mb-3 block font-medium text-[var(--app-text)]">Select date</label>
                                <input
                                    type="date"
                                    min={today}
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full rounded-2xl border border-[var(--app-border)] bg-white/10 p-3.5 text-[var(--app-text)] outline-none transition focus:border-emerald-500"
                                />
                            </div>

                            {/* Time slots */}
                            <div>
                                <label className="mb-3 block font-medium text-[var(--app-text)]">Preferred time <span className="text-muted font-normal text-sm">(optional)</span></label>
                                <div className="premium-scrollbar grid max-h-44 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => setSelectedTime(selectedTime === time ? '' : time)}
                                            className={`rounded-xl border px-2 py-2.5 text-sm transition-all duration-300 ${selectedTime === time
                                                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                                                : 'border-[var(--app-border)] bg-white/5 text-muted hover:border-emerald-500/50 hover:text-[var(--app-text)]'
                                            }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="brand-gradient inline-flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base sm:text-lg font-semibold text-white transition duration-300 hover:-translate-y-0.5"
                            >
                                <Clock3 size={20} />
                                Check Availability & Book
                            </button>
                        </form>
                    </div>

                    {/* Feature list */}
                    <div className="space-y-5 sm:space-y-8">
                        {[
                            {
                                icon: CheckCircle2,
                                color: 'from-emerald-500 to-green-600',
                                title: 'Instant confirmation',
                                text: 'Get immediate booking confirmation with a clean checkout flow and rapid feedback.',
                            },
                            {
                                icon: ShieldCheck,
                                color: 'from-sky-500 to-cyan-500',
                                title: 'Secure payments',
                                text: 'Safe and encrypted payment processing with multiple payment methods available.',
                            },
                            {
                                icon: CircleDollarSign,
                                color: 'from-violet-500 to-fuchsia-500',
                                title: 'Flexible changes',
                                text: 'Cancel or reschedule your booking with clear slot states and lower friction.',
                            },
                            {
                                icon: LifeBuoy,
                                color: 'from-amber-500 to-orange-500',
                                title: 'Responsive support',
                                text: 'Round-the-clock support when plans shift or you need help with a booking.',
                            },
                        ].map((item) => (
                            <div key={item.title} className="flex items-start space-x-4">
                                <div className={`flex h-11 w-11 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r ${item.color} text-white shadow-lg`}>
                                    <item.icon size={20} />
                                </div>
                                <div>
                                    <h4 className="text-lg sm:text-xl font-semibold text-[var(--app-text)] mb-1">{item.title}</h4>
                                    <p className="text-muted text-sm sm:text-base">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

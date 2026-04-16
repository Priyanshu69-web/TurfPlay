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

    return (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="surface-card-strong mx-auto max-w-7xl overflow-hidden p-6 sm:p-8 lg:p-10">
                <div className="text-center mb-16">
                    <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500">
                        Fast reservations
                    </span>
                    <h2 className="mt-5 text-4xl font-semibold text-[var(--app-text)] sm:text-5xl">
                        Quick booking,
                        <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent"> premium experience</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted sm:text-lg">
                        Book your preferred turf in seconds with our streamlined booking system. Select your sport, date, and time.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="rounded-[1.75rem] border border-[var(--app-border)] bg-white/6 p-6 sm:p-8">
                        <div className="mb-8 flex items-center justify-between gap-4">
                            <div>
                                <h3 className="text-2xl font-semibold text-[var(--app-text)]">Reserve your slot</h3>
                                <p className="mt-2 text-sm text-muted">Fast selections, smooth on mobile, clear pricing.</p>
                            </div>
                            <div className="brand-gradient hidden h-12 w-12 items-center justify-center rounded-2xl text-white sm:flex">
                                <CalendarDays size={20} />
                            </div>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); navigate('/booking'); }} className="space-y-6">
                            <div>
                                <label className="mb-4 block font-medium text-[var(--app-text)]">Select sport</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {sports.map((sport) => (
                                        <button
                                            key={sport.id}
                                            type="button"
                                            onClick={() => setSelectedSport(sport.id)}
                                            className={`rounded-2xl border p-4 transition-all duration-300 ${selectedSport === sport.id
                                                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                                                : 'border-[var(--app-border)] bg-white/5 text-muted hover:border-emerald-500/50 hover:text-[var(--app-text)]'
                                                }`}
                                        >
                                            <sport.icon size={22} className="mx-auto mb-2" />
                                            <span className="text-sm font-medium">{sport.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="mb-4 block font-medium text-[var(--app-text)]">Select date</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full rounded-2xl border border-[var(--app-border)] bg-white/10 p-4 text-[var(--app-text)] outline-none transition focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="mb-4 block font-medium text-[var(--app-text)]">Preferred time</label>
                                <div className="premium-scrollbar grid max-h-60 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => setSelectedTime(time)}
                                            className={`rounded-xl border px-3 py-3 text-sm transition-all duration-300 ${selectedTime === time
                                                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                                                : 'border-[var(--app-border)] bg-white/5 text-muted hover:border-emerald-500/50 hover:text-[var(--app-text)]'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="mb-4 block font-medium text-[var(--app-text)]">Number of players</label>
                                <select className="w-full rounded-2xl border border-[var(--app-border)] bg-white/10 p-4 pr-8 text-[var(--app-text)] outline-none transition focus:border-emerald-500">
                                    <option>Select players</option>
                                    <option>1-5 players</option>
                                    <option>6-10 players</option>
                                    <option>11-15 players</option>
                                    <option>16-20 players</option>
                                    <option>20+ players</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="brand-gradient inline-flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 text-lg font-semibold text-white transition duration-300 hover:-translate-y-0.5"
                            >
                                <Clock3 size={20} />
                                Book Now
                            </button>
                        </form>
                    </div>

                    <div className="space-y-8">
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
                                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r ${item.color} text-white shadow-lg`}>
                                    <item.icon size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-[var(--app-text)] mb-2">{item.title}</h4>
                                    <p className="text-muted">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

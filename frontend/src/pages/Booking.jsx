import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import Skeleton from "../components/ui/Skeleton";
import Spinner from "../components/ui/Spinner";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { useAuth } from "../context/AuthContext";
import { loadRazorpayScript } from "../utils/razorpay";

const Booking = () => {
  const [turfs, setTurfs] = useState([]);
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [preferredTime, setPreferredTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [slotLoading, setSlotLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    playerName: "",
    playerPhone: "",
    playerCount: 1,
    notes: "",
    paymentMethod: "online",
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (user) {
      setBookingDetails((prev) => ({
        ...prev,
        playerName: user.name || "",
        playerPhone: user.phone || "",
      }));
    }
  }, [user]);

  const slotSectionRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setTurfs([]);
      setSelectedTurf(null);
      return;
    }

    const fetchTurfs = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(API_PATHS.TURF.GET_ALL);
        const nextTurfs = response.data.data || [];
        setTurfs(nextTurfs);
        if (nextTurfs.length > 0) {
          setSelectedTurf(nextTurfs[0]);
        }
      } catch (error) {
        toast.error("Failed to fetch turfs");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTurfs();
  }, [user]);

  // Pre-fill from navigation state (when coming from BookingSection quick-book)
  useEffect(() => {
    const todayDate = new Date().toISOString().split("T")[0];
    const state = location.state;
    if (state?.date) {
      setSelectedDate(state.date);
    } else {
      setSelectedDate(todayDate);
    }
    if (state?.preferredTime) {
      setPreferredTime(state.preferredTime);
    }
  }, [location.state]);

  useEffect(() => {
    if (!selectedTurf || !selectedDate) return;

    const fetchSlots = async () => {
      try {
        setSlotLoading(true);
        setSlots([]);
        setSelectedSlot(null);

        const response = await axiosInstance.get(API_PATHS.SLOTS.GET_AVAILABLE, {
          params: {
            turfId: selectedTurf._id,
            date: selectedDate,
          },
        });

        const fetchedSlots = response.data.data || [];
        setSlots(fetchedSlots);

        // Auto-select a slot matching preferred time from quick-book
        if (preferredTime && fetchedSlots.length > 0) {
          // preferredTime is like "06:00 AM" – convert to 24h for matching
          const match = fetchedSlots.find((s) => {
            try {
              const [timePart, ampm] = preferredTime.split(' ');
              const [h, m] = timePart.split(':').map(Number);
              const hour24 = ampm === 'PM' && h !== 12 ? h + 12 : (ampm === 'AM' && h === 12 ? 0 : h);
              const formatted = `${String(hour24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
              return s.startTime === formatted && s.status === 'available';
            } catch { return false; }
          });
          if (match) setSelectedSlot(match);
          // Scroll to slot section
          setTimeout(() => slotSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400);
        }
      } catch (error) {
        toast.error("Failed to fetch available slots");
        console.error(error);
      } finally {
        setSlotLoading(false);
      }
    };

    fetchSlots();
  }, [selectedTurf, selectedDate, preferredTime]);

  const slotStats = useMemo(() => ({
    total: slots.length,
    available: slots.filter((slot) => slot.status === "available").length,
    booked: slots.filter((slot) => slot.status === "booked").length,
    blocked: slots.filter((slot) => slot.status === "blocked").length,
  }), [slots]);

  const today = new Date().toISOString().split("T")[0];

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login to book a slot");
      navigate("/login");
      return;
    }

    if (!selectedSlot || selectedSlot.status !== "available") {
      toast.error("Please select an available slot");
      return;
    }

    if (!bookingDetails.playerName.trim()) {
      toast.error("Please enter player name");
      return;
    }

    if (!bookingDetails.playerPhone.trim() || bookingDetails.playerPhone.length !== 10) {
      toast.error("Please enter valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        slotId: selectedSlot._id,
        turfId: selectedTurf._id,
        playerName: bookingDetails.playerName,
        playerPhone: bookingDetails.playerPhone,
        playerCount: bookingDetails.playerCount,
        notes: bookingDetails.notes,
        paymentMethod: bookingDetails.paymentMethod,
        date: selectedDate, // Backend createOrder needs date and time if it wants to re-validate, but let's just pass slot info as we did
      };

      const response = await axiosInstance.post(API_PATHS.BOOKINGS.CREATE_ORDER, payload);

      if (response.data.success) {
        if (bookingDetails.paymentMethod === 'online' && response.data.data.razorpayOrderId) {
            // Razorpay flow
            const { order, amount, razorpayOrderId } = response.data.data;
            const res = await loadRazorpayScript();
            
            if (!res) {
                toast.error("Razorpay SDK failed to load. Are you online?");
                setLoading(false);
                return;
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "", 
                amount: amount.toString(),
                currency: "INR",
                name: "TurfPlay",
                description: `Booking for ${selectedTurf.name}`,
                order_id: razorpayOrderId,
                handler: async function (res) {
                    try {
                        const verifyRes = await axiosInstance.post(API_PATHS.BOOKINGS.VERIFY_PAYMENT, {
                            razorpayOrderId: res.razorpay_order_id,
                            razorpayPaymentId: res.razorpay_payment_id,
                            razorpaySignature: res.razorpay_signature,
                            bookingId: order._id
                        });
                        if (verifyRes.data.success) {
                            toast.success("Payment successful! Booking confirmed.");
                            navigate("/user/dashboard");
                        }
                    } catch (err) {
                        toast.error(err.response?.data?.message || "Payment verification failed");
                        await axiosInstance.post(API_PATHS.BOOKINGS.PAYMENT_FAILED, { bookingId: order._id });
                    }
                },
                prefill: {
                    name: bookingDetails.playerName,
                    contact: bookingDetails.playerPhone,
                },
                theme: {
                    color: "#10b981", // Emerald 500
                },
                modal: {
                    ondismiss: async function () {
                        toast.error("Payment cancelled");
                        await axiosInstance.post(API_PATHS.BOOKINGS.PAYMENT_FAILED, { bookingId: order._id });
                        setLoading(false);
                    }
                }
            };
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } else {
            // Offline flow (cash/upi)
            toast.success("Booking confirmed!");
            navigate("/user/dashboard");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
        if (bookingDetails.paymentMethod !== 'online') setLoading(false);
    }
  };

  const statusConfig = {
    available: {
      label: "Available",
      className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:border-emerald-500",
      icon: CheckCircle2,
      legendClassName: "bg-emerald-500",
    },
    booked: {
      label: "Booked",
      className: "border-amber-500/20 bg-amber-500/10 text-amber-500 opacity-80 cursor-not-allowed",
      icon: AlertCircle,
      legendClassName: "bg-amber-500",
    },
    blocked: {
      label: "Blocked",
      className: "border-rose-500/20 bg-rose-500/10 text-rose-500 opacity-80 cursor-not-allowed",
      icon: XCircle,
      legendClassName: "bg-rose-500",
    },
  };

  return (
    <div className="app-shell overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        <section className="surface-card-strong hero-grid overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500">
                Smooth slot booking
              </span>
              <h1 className="mt-5 text-4xl font-semibold text-[var(--app-text)] sm:text-5xl">
                Book the right turf
                <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent"> without second guessing availability</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                Clear slot states, polished mobile interactions, and a premium booking summary help players move from discovery to confirmation faster.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Available today", value: slotStats.available, icon: CheckCircle2, tone: "text-emerald-500 bg-emerald-500/10" },
                { label: "Already booked", value: slotStats.booked, icon: AlertCircle, tone: "text-amber-500 bg-amber-500/10" },
                { label: "Admin blocked", value: slotStats.blocked, icon: XCircle, tone: "text-rose-500 bg-rose-500/10" },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-[var(--app-border)] bg-white/6 p-5">
                  <div className={`inline-flex rounded-2xl p-3 ${item.tone}`}>
                    <item.icon size={20} />
                  </div>
                  <p className="mt-4 text-sm text-muted">{item.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-[var(--app-text)]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="space-y-6">
            <div className="surface-card p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--app-text)]">Choose your venue</h2>
                  <p className="mt-1 text-sm text-muted">Pick a turf, then a date to load live slot states.</p>
                </div>
                <div className="brand-gradient hidden h-12 w-12 items-center justify-center rounded-2xl text-white sm:flex">
                  <MapPin size={18} />
                </div>
              </div>

              {loading ? (
                <div className="grid gap-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton.TurfCard key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid gap-3">
                  {turfs.map((turf) => {
                    const isSelected = selectedTurf?._id === turf._id;
                    return (
                      <button
                        key={turf._id}
                        type="button"
                        onClick={() => setSelectedTurf(turf)}
                        className={`rounded-[1.35rem] border p-4 text-left transition ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-[var(--app-border)] bg-white/5 hover:border-emerald-500/40 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-lg font-semibold text-[var(--app-text)]">{turf.name}</p>
                            <div className="mt-2 flex items-center gap-2 text-sm text-muted">
                              <MapPin size={15} />
                              {turf.location}
                            </div>
                          </div>
                          <div className="rounded-2xl border border-[var(--app-border)] bg-white/8 px-4 py-2 text-sm font-semibold text-[var(--app-text)]">
                            ₹{turf.pricePerSlot}
                            <span className="ml-1 font-normal text-muted">/ slot</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="surface-card p-6">
              <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--app-text)]">Select booking date</label>
                  <div className="relative">
                    <CalendarDays size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="date"
                      min={today}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full rounded-2xl border border-[var(--app-border)] bg-white/10 py-3 pl-12 pr-4 text-[var(--app-text)] outline-none transition focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {["available", "booked", "blocked"].map((status) => (
                    <div key={status} className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-white/6 px-3 py-2 text-sm text-muted">
                      <span className={`h-2.5 w-2.5 rounded-full ${statusConfig[status].legendClassName}`}></span>
                      {statusConfig[status].label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div ref={slotSectionRef} className="surface-card p-6">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--app-text)]">Select your slot</h2>
                  <p className="text-sm text-muted">
                    {selectedDate ? `Showing slots for ${selectedDate}` : "Select a date first"}
                  </p>
                </div>
                <div className="rounded-full border border-[var(--app-border)] bg-white/6 px-3 py-2 text-sm text-muted">
                  {slotStats.total} total slots
                </div>
              </div>

              {slotLoading ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton.Slot key={i} />
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <div className="rounded-[1.4rem] border border-amber-500/20 bg-amber-500/10 p-6 text-sm text-amber-600 dark:text-amber-400">
                  No slots are available for this date yet. Try another turf or generate future availability from the admin panel.
                </div>
              ) : (
                <div className="premium-scrollbar grid max-h-[30rem] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">
                  {slots.map((slot) => {
                    const isActive = selectedSlot?._id === slot._id;
                    const config = statusConfig[slot.status] || statusConfig.available;
                    const SlotIcon = config.icon;
                    const isDisabled = slot.status !== "available";

                    return (
                      <button
                        key={slot._id}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => setSelectedSlot(slot)}
                        className={`slot-status-ring rounded-[1.35rem] border p-4 text-left transition ${config.className} ${
                          isActive ? "ring-2 ring-emerald-400" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                              <Clock3 size={16} />
                              {slot.startTime} - {slot.endTime}
                            </div>
                            <p className="mt-2 text-xs uppercase tracking-[0.22em]">{config.label}</p>
                          </div>
                          <SlotIcon size={18} />
                        </div>
                        {slot.status === "blocked" && slot.blockedReason ? (
                          <p className="mt-3 text-xs leading-5 opacity-90">{slot.blockedReason}</p>
                        ) : null}
                        {slot.status === "booked" ? (
                          <p className="mt-3 text-xs leading-5 opacity-90">This slot is already reserved and cannot be booked.</p>
                        ) : null}
                        {slot.status === "available" ? (
                          <p className="mt-3 text-xs leading-5 opacity-90">Ready to book now.</p>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <section className="surface-card-strong p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--app-text)]">Booking summary</h2>
                  <p className="mt-1 text-sm text-muted">Review your selection before confirming.</p>
                </div>
                <div className="brand-gradient hidden h-12 w-12 items-center justify-center rounded-2xl text-white sm:flex">
                  <Sparkles size={18} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.35rem] border border-[var(--app-border)] bg-white/6 p-4">
                  <p className="text-sm text-muted">Selected turf</p>
                  <p className="mt-1 text-lg font-semibold text-[var(--app-text)]">{selectedTurf?.name || "Choose a turf"}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted">
                    <MapPin size={15} />
                    {selectedTurf?.location || "Location will appear here"}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.35rem] border border-[var(--app-border)] bg-white/6 p-4">
                    <p className="text-sm text-muted">Date</p>
                    <p className="mt-1 font-semibold text-[var(--app-text)]">{selectedDate || "Not selected"}</p>
                  </div>
                  <div className="rounded-[1.35rem] border border-[var(--app-border)] bg-white/6 p-4">
                    <p className="text-sm text-muted">Time</p>
                    <p className="mt-1 font-semibold text-[var(--app-text)]">
                      {selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : "Select a slot"}
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.35rem] border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted">Amount payable</p>
                      <p className="mt-1 text-2xl font-semibold text-[var(--app-text)]">₹{selectedTurf?.pricePerSlot || 0}</p>
                    </div>
                    <div className="rounded-2xl bg-white/20 p-3 text-emerald-600 dark:text-emerald-300">
                      <CreditCard size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="surface-card p-6">
              <h3 className="text-lg font-semibold text-[var(--app-text)]">Player details</h3>
              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--app-text)]">
                    <Users size={15} />
                    Player name
                  </span>
                  <input
                    type="text"
                    placeholder="Player Name"
                    value={bookingDetails.playerName}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, playerName: e.target.value })}
                    className="w-full rounded-2xl border border-[var(--app-border)] bg-white/10 px-4 py-3 text-[var(--app-text)] outline-none transition focus:border-emerald-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--app-text)]">
                    <Phone size={15} />
                    Phone number
                  </span>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    maxLength="10"
                    value={bookingDetails.playerPhone}
                    onChange={(e) =>
                      setBookingDetails({
                        ...bookingDetails,
                        playerPhone: e.target.value.replace(/\D/g, "").slice(0, 10),
                      })
                    }
                    className="w-full rounded-2xl border border-[var(--app-border)] bg-white/10 px-4 py-3 text-[var(--app-text)] outline-none transition focus:border-emerald-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--app-text)]">
                    <Users size={15} />
                    Player count
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={bookingDetails.playerCount}
                    onChange={(e) =>
                      setBookingDetails({
                        ...bookingDetails,
                        playerCount: Math.max(1, parseInt(e.target.value || "1", 10)),
                      })
                    }
                    className="w-full rounded-2xl border border-[var(--app-border)] bg-white/10 px-4 py-3 text-[var(--app-text)] outline-none transition focus:border-emerald-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--app-text)]">
                    <CreditCard size={15} />
                    Payment method
                  </span>
                  <select
                    value={bookingDetails.paymentMethod}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, paymentMethod: e.target.value })}
                    className="w-full rounded-2xl border border-[var(--app-border)] bg-white/10 px-4 py-3 text-[var(--app-text)] outline-none transition focus:border-emerald-500"
                  >
                    <option value="online">Online payment</option>
                    <option value="cash">Cash on site</option>
                    <option value="upi">UPI</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--app-text)]">
                    <ShieldCheck size={15} />
                    Notes
                  </span>
                  <textarea
                    placeholder="Special requests (optional)"
                    value={bookingDetails.notes}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, notes: e.target.value })}
                    className="min-h-28 w-full rounded-2xl border border-[var(--app-border)] bg-white/10 px-4 py-3 text-[var(--app-text)] outline-none transition focus:border-emerald-500"
                  />
                </label>
              </div>

              <button
                onClick={handleBooking}
                disabled={!selectedSlot || !user || selectedSlot.status !== "available" || !bookingDetails.playerName || !bookingDetails.playerPhone || loading}
                className="brand-gradient mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold text-white transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? <Spinner size="sm" /> : <CheckCircle2 size={18} />}
                {loading ? "Processing..." : (bookingDetails.paymentMethod === 'online' ? "Pay & Confirm Booking" : "Confirm Booking")}
              </button>


              {!user ? (
                <p className="mt-3 text-sm text-amber-500">
                  Please <a href="/login" className="font-semibold underline">login</a> to complete your booking.
                </p>
              ) : null}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Booking;

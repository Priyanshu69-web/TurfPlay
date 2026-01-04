import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Booking = () => {
  const [turfs, setTurfs] = useState([]);
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [slotLoading, setSlotLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch turfs on mount
  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(API_PATHS.TURF.GET_ALL);
        setTurfs(response.data.data || []);
        if (response.data.data && response.data.data.length > 0) {
          setSelectedTurf(response.data.data[0]);
        }
      } catch (error) {
        toast.error("Failed to fetch turfs");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTurfs();
  }, []);

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  // Fetch slots when date or turf changes
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

        setSlots(response.data.data || []);
      } catch (error) {
        toast.error("Failed to fetch available slots");
        console.error(error);
      } finally {
        setSlotLoading(false);
      }
    };

    fetchSlots();
  }, [selectedTurf, selectedDate]);

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login to book a slot");
      navigate("/login");
      return;
    }

    if (!selectedSlot) {
      toast.error("Please select a slot");
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATHS.BOOKINGS.CREATE, {
        slotId: selectedSlot._id,
        turfId: selectedTurf._id,
      });

      if (response.data.success) {
        toast.success("Booking confirmed!");
        navigate("/user/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <div className="min-h-screen bg-base-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Book Your Turf</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Selection */}
            <div className="space-y-6">
              {/* Turf Selection */}
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Select Turf</h2>
                  {loading ? (
                    <div className="flex justify-center py-4">
                      <span className="loading loading-spinner"></span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {turfs.map((turf) => (
                        <button
                          key={turf._id}
                          onClick={() => setSelectedTurf(turf)}
                          className={`btn btn-block text-left ${selectedTurf?._id === turf._id
                            ? "btn-primary"
                            : "btn-ghost"
                            }`}
                        >
                          <div className="text-left w-full">
                            <p className="font-bold">{turf.name}</p>
                            <p className="text-sm opacity-75">{turf.location}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Date Selection */}
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Select Date</h2>
                  <input
                    type="date"
                    min={today}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Slots */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">
                  Available Slots - {selectedDate}
                </h2>

                {slotLoading ? (
                  <div className="flex justify-center py-8">
                    <span className="loading loading-spinner"></span>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="alert alert-warning">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4v2m0 4v2M7.08 6.47A9 9 0 1119.02 19.95M9 9h.01M15 9h.01M9 15h.01M15 15h.01"
                      />
                    </svg>
                    <span>No available slots for this date</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                    {slots
                      .filter((slot) => slot.status === "available")
                      .map((slot) => (
                        <button
                          key={slot._id}
                          onClick={() => setSelectedSlot(slot)}
                          className={`btn btn-sm ${selectedSlot?._id === slot._id
                            ? "btn-primary"
                            : "btn-outline"
                            }`}
                        >
                          {slot.startTime} - {slot.endTime}
                        </button>
                      ))}
                  </div>
                )}

                {/* Booking Details */}
                {selectedSlot && selectedTurf && (
                  <div className="alert alert-info mt-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="stroke-current shrink-0 w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <div>
                      <p className="font-bold">Amount: ₹{selectedTurf.pricePerSlot}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  disabled={!selectedSlot || !user}
                  className="btn btn-primary btn-block mt-4"
                >
                  Confirm Booking
                </button>

                {!user && (
                  <p className="text-sm text-warning mt-2">
                    Please{" "}
                    <a href="/login" className="link">
                      login
                    </a>{" "}
                    to book
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Booking;


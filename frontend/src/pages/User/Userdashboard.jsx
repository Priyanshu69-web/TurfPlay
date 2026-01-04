import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const [upcomingRes, historyRes] = await Promise.all([
        axiosInstance.get(API_PATHS.BOOKINGS.GET_UPCOMING),
        axiosInstance.get(API_PATHS.BOOKINGS.GET_HISTORY),
      ]);

      setUpcomingBookings(upcomingRes.data.data || []);
      setBookingHistory(historyRes.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch bookings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.BOOKINGS.CANCEL, { bookingId });
      toast.success("Booking cancelled successfully");
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const BookingCard = ({ booking, isUpcoming }) => (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{booking.turfId.name}</h2>
        <div className="divider my-2"></div>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-bold">Location:</span> {booking.turfId.location}
          </p>
          <p>
            <span className="font-bold">Date:</span>{" "}
            {new Date(booking.date).toLocaleDateString()}
          </p>
          <p>
            <span className="font-bold">Time:</span> {booking.startTime} -{" "}
            {booking.endTime}
          </p>
          <p>
            <span className="font-bold">Amount:</span> ₹{booking.amount}
          </p>
          <p>
            <span className="font-bold">Status:</span>
            <span className="badge badge-success ml-2">{booking.status}</span>
          </p>
        </div>

        {isUpcoming && (
          <div className="card-actions justify-end mt-4">
            <button
              onClick={() => handleCancelBooking(booking._id)}
              className="btn btn-sm btn-outline btn-error"
            >
              Cancel Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Section */}
          <div className="card bg-base-200 shadow-xl mb-8">
            <div className="card-body">
              <h2 className="card-title text-3xl">Welcome, {user?.name}!</h2>
              <p className="text-sm opacity-75">{user?.email}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs tabs-lifted mb-8">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`tab ${activeTab === "upcoming" ? "tab-active" : ""}`}
            >
              Upcoming Bookings ({upcomingBookings.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`tab ${activeTab === "history" ? "tab-active" : ""}`}
            >
              Booking History ({bookingHistory.length})
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div>
              {activeTab === "upcoming" && (
                <div>
                  {upcomingBookings.length === 0 ? (
                    <div className="alert alert-info">
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
                        <p>No upcoming bookings</p>
                        <p className="text-sm">
                          <a href="/booking" className="link">
                            Book a slot now!
                          </a>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {upcomingBookings.map((booking) => (
                        <BookingCard
                          key={booking._id}
                          booking={booking}
                          isUpcoming={true}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "history" && (
                <div>
                  {bookingHistory.length === 0 ? (
                    <div className="alert alert-info">
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
                      <span>No booking history yet</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {bookingHistory.map((booking) => (
                        <BookingCard
                          key={booking._id}
                          booking={booking}
                          isUpcoming={false}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;


import React, { useState } from "react";
import DashboardHeader from "../../../components/Dashboard/DashboardHeader";
import StatusBadge from "../../../components/Dashboard/StatusBadge";
import { useGetBookingsQuery, useCancelBookingMutation } from "../../../redux/api/adminApi";
import toast from "react-hot-toast";

const ManageBookings = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    date: "",
  });

  const { data: bookingsData, isLoading, refetch } = useGetBookingsQuery(filters);
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const handleCancelBooking = async () => {
    try {
      await cancelBooking({ id: selectedBooking._id, reason: cancelReason }).unwrap();
      toast.success("Booking cancelled successfully");
      setSelectedBooking(null);
      setCancelReason("");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to cancel booking");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const bookings = bookingsData?.data || [];
  const total = bookingsData?.total || 0;
  const pages = bookingsData?.pages || 1;

  return (
    <div className="space-y-6">
      <DashboardHeader title="Manage Bookings" subtitle="View and manage all bookings" />

      {/* Filters */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-lg mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange("date", e.target.value)}
              className="input input-bordered"
              placeholder="Date"
            />
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="select select-bordered"
            >
              <option value="">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input
              type="number"
              value={filters.limit}
              onChange={(e) => handleFilterChange("limit", parseInt(e.target.value))}
              className="input input-bordered"
              placeholder="Items per page"
            />
            <button
              onClick={() => setFilters({ page: 1, limit: 10, status: "", date: "" })}
              className="btn btn-ghost"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card bg-base-200 shadow-xl overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-base-300">
            <tr>
              <th>Customer</th>
              <th>Turf</th>
              <th>Date & Time</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-base-300">
                  <td>
                    <div>
                      <p className="font-bold">{booking.userId?.name || "N/A"}</p>
                      <p className="text-sm opacity-75">{booking.userId?.email || "N/A"}</p>
                    </div>
                  </td>
                  <td>
                    <p className="font-semibold">{booking.turfId?.name || "N/A"}</p>
                    <p className="text-sm opacity-75">{booking.turfId?.location || "N/A"}</p>
                  </td>
                  <td>
                    <p className="font-semibold">{new Date(booking.date).toLocaleDateString()}</p>
                    <p className="text-sm">{booking.startTime} - {booking.endTime}</p>
                  </td>
                  <td className="font-bold">₹{booking.amount}</td>
                  <td>
                    <StatusBadge status={booking.status} size="sm" />
                  </td>
                  <td>
                    {booking.status !== "cancelled" && (
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="btn btn-sm btn-error"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => handleFilterChange("page", Math.max(1, filters.page - 1))}
          disabled={filters.page === 1}
          className="btn btn-sm"
        >
          Previous
        </button>
        <span className="flex items-center px-4">
          Page {filters.page} of {pages}
        </span>
        <button
          onClick={() => handleFilterChange("page", Math.min(pages, filters.page + 1))}
          disabled={filters.page === pages}
          className="btn btn-sm"
        >
          Next
        </button>
      </div>

      {/* Cancel Booking Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card bg-base-100 shadow-2xl max-w-md w-full mx-4">
            <div className="card-body">
              <h2 className="card-title">Cancel Booking</h2>
              <p className="text-sm opacity-75 mb-4">
                Booking ID: {selectedBooking._id.slice(0, 8)}...
              </p>
              <textarea
                placeholder="Cancellation reason (optional)"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="textarea textarea-bordered w-full"
                rows="3"
              />
              <div className="card-actions justify-end mt-6">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={isCancelling}
                  className="btn btn-error"
                >
                  {isCancelling ? "Cancelling..." : "Confirm Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;

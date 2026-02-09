import React, { useState } from "react";
import DashboardHeader from "../../../components/Dashboard/DashboardHeader";
import StatusBadge from "../../../components/Dashboard/StatusBadge";
import { useGetUsersQuery, useBlockUserMutation } from "../../../redux/api/adminApi";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const { data: usersData, isLoading, refetch } = useGetUsersQuery(filters);
  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
  const [selectedUser, setSelectedUser] = useState(null);
  const [blockReason, setBlockReason] = useState("");
  const [isBlockingUser, setIsBlockingUser] = useState(false);

  const handleBlockUser = async () => {
    try {
      setIsBlockingUser(true);
      await blockUser({
        id: selectedUser._id,
        isBlocked: !selectedUser.isBlocked,
        reason: blockReason,
      }).unwrap();
      toast.success(
        selectedUser.isBlocked ? "User unblocked successfully" : "User blocked successfully"
      );
      setSelectedUser(null);
      setBlockReason("");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update user");
    } finally {
      setIsBlockingUser(false);
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

  const users = usersData?.data || [];
  const total = usersData?.total || 0;
  const pages = usersData?.pages || 1;

  return (
    <div className="space-y-6">
      <DashboardHeader title="Manage Users" subtitle="View and manage user access" />

      {/* Search & Filters */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-lg mb-4">Search & Filter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="input input-bordered"
            />
            <input
              type="number"
              value={filters.limit}
              onChange={(e) => handleFilterChange("limit", parseInt(e.target.value))}
              className="input input-bordered"
              placeholder="Items per page"
            />
            <button
              onClick={() => setFilters({ page: 1, limit: 10, search: "" })}
              className="btn btn-ghost"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card bg-base-200 shadow-xl overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-base-300">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Bookings</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-base-300">
                  <td className="font-semibold">{user.name}</td>
                  <td className="text-sm">{user.email}</td>
                  <td className="text-sm">{user.phone || "N/A"}</td>
                  <td className="text-center font-bold">{user.bookingCount || 0}</td>
                  <td>
                    <StatusBadge status={user.isBlocked ? "inactive" : "active"} size="sm" />
                  </td>
                  <td className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => setSelectedUser(user)}
                      className={`btn btn-sm ${
                        user.isBlocked ? "btn-success" : "btn-warning"
                      }`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
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

      {/* Block/Unblock User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card bg-base-100 shadow-2xl max-w-md w-full mx-4">
            <div className="card-body">
              <h2 className="card-title">
                {selectedUser.isBlocked ? "Unblock" : "Block"} User
              </h2>
              <p className="text-sm opacity-75 mb-4">
                User: <span className="font-semibold">{selectedUser.name}</span>
              </p>

              {!selectedUser.isBlocked && (
                <textarea
                  placeholder="Reason for blocking (optional)"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="textarea textarea-bordered w-full"
                  rows="3"
                />
              )}

              <div className="card-actions justify-end mt-6">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBlockUser}
                  disabled={isBlockingUser}
                  className={isBlockingUser ? "btn" : selectedUser.isBlocked ? "btn btn-success" : "btn btn-error"}
                >
                  {isBlockingUser
                    ? "Processing..."
                    : selectedUser.isBlocked
                    ? "Unblock User"
                    : "Block User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;

import React, { useState } from "react";
import DashboardHeader from "../../../components/Dashboard/DashboardHeader";
import StatusBadge from "../../../components/Dashboard/StatusBadge";
import { useGetMessagesQuery, useUpdateMessageMutation } from "../../../redux/api/adminApi";
import toast from "react-hot-toast";

const ManageMessages = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
  });

  const { data: messagesData, isLoading, refetch } = useGetMessagesQuery(filters);
  const [updateMessage] = useUpdateMessageMutation();
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleUpdateStatus = async (messageId, newStatus) => {
    try {
      await updateMessage({ id: messageId, status: newStatus }).unwrap();
      toast.success("Message status updated");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update message");
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

  const messages = messagesData?.data || [];
  const total = messagesData?.total || 0;
  const pages = messagesData?.pages || 1;

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Contact Messages"
        subtitle="View and manage contact form submissions"
      />

      {/* Filters */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-lg mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="select select-bordered"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="responded">Responded</option>
            </select>
            <input
              type="number"
              value={filters.limit}
              onChange={(e) => handleFilterChange("limit", parseInt(e.target.value))}
              className="input input-bordered"
              placeholder="Items per page"
            />
            <button
              onClick={() => setFilters({ page: 1, limit: 10, status: "" })}
              className="btn btn-ghost"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="card bg-base-200 shadow-xl overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-base-300">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No messages found
                </td>
              </tr>
            ) : (
              messages.map((message) => (
                <tr key={message._id} className="hover:bg-base-300">
                  <td className="font-semibold">{message.name}</td>
                  <td className="text-sm">{message.email}</td>
                  <td className="text-sm max-w-xs truncate">{message.message}</td>
                  <td>
                    <StatusBadge status={message.status || "pending"} size="sm" />
                  </td>
                  <td className="text-sm">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </td>
                  <td className="space-x-2">
                    <button
                      onClick={() => setSelectedMessage(message)}
                      className="btn btn-sm btn-info"
                    >
                      View
                    </button>
                    {message.status !== "responded" && (
                      <button
                        onClick={() => handleUpdateStatus(message._id, "responded")}
                        className="btn btn-sm btn-success"
                      >
                        Mark Responded
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

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card bg-base-100 shadow-2xl max-w-2xl w-full mx-4">
            <div className="card-body">
              <h2 className="card-title">Message Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-sm opacity-75">Name</p>
                    <p className="font-bold">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm opacity-75">Email</p>
                    <p className="font-bold">{selectedMessage.email}</p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm opacity-75">Message</p>
                  <p className="whitespace-pre-wrap mt-2 p-3 bg-base-200 rounded">
                    {selectedMessage.message}
                  </p>
                </div>
                <div className="text-xs opacity-75">
                  Sent: {new Date(selectedMessage.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="card-actions justify-end mt-6">
                <button onClick={() => setSelectedMessage(null)} className="btn btn-ghost">
                  Close
                </button>
                {selectedMessage.status !== "responded" && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedMessage._id, "responded");
                      setSelectedMessage(null);
                    }}
                    className="btn btn-success"
                  >
                    Mark Responded
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMessages;

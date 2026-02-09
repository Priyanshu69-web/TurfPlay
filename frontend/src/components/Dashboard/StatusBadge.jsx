const StatusBadge = ({ status, size = "md" }) => {
  const baseClass = "font-semibold rounded-full inline-block";
  const sizeClass = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  }[size];

  const statusClass = {
    confirmed: "bg-green-500/20 text-green-300 border border-green-500/30",
    pending: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
    cancelled: "bg-red-500/20 text-red-300 border border-red-500/30",
    completed: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    failed: "bg-red-500/20 text-red-300 border border-red-500/30",
    available: "bg-green-500/20 text-green-300 border border-green-500/30",
    booked: "bg-red-500/20 text-red-300 border border-red-500/30",
    blocked: "bg-gray-500/20 text-gray-300 border border-gray-500/30",
    pending_response: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
    responded: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    active: "bg-green-500/20 text-green-300 border border-green-500/30",
    inactive: "bg-gray-500/20 text-gray-300 border border-gray-500/30",
  }[status] || "bg-gray-500/20 text-gray-300 border border-gray-500/30";

  const displayText = {
    confirmed: "Confirmed",
    pending: "Pending",
    cancelled: "Cancelled",
    completed: "Completed",
    failed: "Failed",
    available: "Available",
    booked: "Booked",
    blocked: "Blocked",
    pending_response: "Pending",
    responded: "Responded",
    active: "Active",
    inactive: "Inactive",
  }[status] || status;

  return (
    <span className={`${baseClass} ${sizeClass} ${statusClass}`}>
      {displayText}
    </span>
  );
};

export default StatusBadge;

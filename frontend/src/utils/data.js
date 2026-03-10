import {
    LayoutDashboard,
    Users,
    ClipboardCheck,
    SquarePlus,
    LogOut,
} from "lucide-react";

export const ADMIN_MENU_DATA = [
    { id: "01", label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { id: "02", label: "Manage Turfs", icon: SquarePlus, path: "/admin/dashboard/turfs" },
    { id: "03", label: "Manage Slots", icon: ClipboardCheck, path: "/admin/dashboard/slots" },
    { id: "04", label: "Manage Bookings", icon: Users, path: "/admin/dashboard/bookings" },
    { id: "05", label: "Logout", icon: LogOut, path: "logout" },
];

export const USER_MENU_DATA = [
    { id: "01", label: "Dashboard", icon: LayoutDashboard, path: "/user/dashboard" },
    { id: "02", label: "My Bookings", icon: ClipboardCheck, path: "/user/dashboard/bookings" },
    { id: "03", label: "My Profile", icon: Users, path: "/user/dashboard/profile" },
    { id: "04", label: "Logout", icon: LogOut, path: "logout" },
];
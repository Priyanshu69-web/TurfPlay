import {
    LayoutDashboard,
    Users,
    ClipboardCheck,
    SquarePlus,
    LogOut,
} from "lucide-react";

export const ADMIN_MENU_DATA = [
    {
        id: "01",
        label: "Profile",
        icon: LayoutDashboard,
        path: "/admin/dashboard",
    },

    {
        id: "02",
        label: "Manage-Slots ",
        icon: ClipboardCheck,
        path: "/admin/tasks",
    },
    {
        id: "03",
        label: "Create Slots",
        icon: SquarePlus,
        path: "/admin/create-slot",
    },
    {
        id: "04",
        label: "Bookings",
        icon: Users,
        path: "/admin/users",
    },
    {
        id: "05",
        label: "Logout",
        icon: LogOut,
        path: "logout",
    },
];

export const USER_MENU_DATA = [
    {
        id: "01",
        label: "Profile",
        icon: Users,
        path: "/user/profile",
    },

    {
        id: "02",
        label: "My Bookings",
        icon: LayoutDashboard,
        path: "/user/bookings",
    },

    {
        id: "03",
        label: "Logout",
        icon: LogOut,
        path: "logout",
    },
];
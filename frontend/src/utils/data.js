import {
    LuLayoutDashboard,
    LuUsers,
    LuClipboardCheck,
    LuSquarePlus,
    LuLogOut,
} from "react-icons/lu";

export const ADMIN_MENU_DATA = [
    {
        id: "01",
        label: "Profile",
        icon: LuLayoutDashboard,
        path: "/admin/dashboard",
    },

    {
        id: "02",
        label: "Manage-Slots ",
        icon: LuClipboardCheck,
        path: "/admin/tasks",
    },
    {
        id: "03",
        label: "Create Slots",
        icon: LuSquarePlus,
        path: "/admin/create-slot",
    },
    {
        id: "04",
        label: "Bookings",
        icon: LuUsers,
        path: "/admin/users",
    },
    {
        id: "05",
        label: "Logout",
        icon: LuLogOut,
        path: "logout",
    },
];

export const USER_MENU_DATA = [
    {
        id: "01",
        label: "Profile",
        icon: LuUsers,
        path: "/profile",
    },

    {
        id: "02",
        label: "My Slots",
        icon: LuLayoutDashboard,
        path: "/user/slots",
    },

];
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, IndianRupee, UserCircle, Users, ClipboardList } from 'lucide-react';

export const COOK_NAV = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/cook/dashboard' },
    { label: 'My Menu', icon: UtensilsCrossed, path: '/cook/menu' },
    { label: 'Orders', icon: ShoppingBag, path: '/cook/orders' },
    { label: 'Earnings', icon: IndianRupee, path: '/cook/earnings' },
    { label: 'Profile', icon: UserCircle, path: '/cook/profile' },
];

export const ADMIN_NAV = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Users', icon: Users, path: '/admin/users' },
    { label: 'Cook Requests', icon: ClipboardList, path: '/admin/requests' },
    { label: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
];
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { History, ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import { logout } from "../../rtk/slices/authSlice.js";
import { notify } from "../../utils/toast.jsx";
import { selectCartCount } from "../../rtk/slices/cartSlice.js";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { token, user, role } = useSelector((state) => state.auth);
    const cartCount = useSelector(selectCartCount);
    const isUser = token && role === "user";

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        notify.success("Logged out successfully.");
        setProfileOpen(false);
        setMenuOpen(false);
        navigate("/login");
    };
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/60 backdrop-blur-md">
            <div className="container-custom flex h-20 items-center justify-between">
                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        to="/"
                        className="pr-8 font-heading text-2xl font-bold text-[var(--color-primary-dark)] hover:text-primary"
                    >
                        HomeFeast
                    </Link>
                    <Link to="/cooks" className="font-medium text-text hover:text-primary transition-colors">
                        Browse Cooks
                    </Link>
                    <Link to="/menu" className="font-medium text-text hover:text-primary transition-colors">
                        Browse Menu
                    </Link>
                </nav>
                <div className="hidden md:flex items-center gap-3">
                    {isUser ? (
                        <>
                            <Link
                                to="/place-order"
                                className="relative flex items-center gap-2 rounded-md px-3 py-2 text-text hover:text-primary hover:bg-white/50 transition"
                                title="My Cart"
                            >
                                <div className="relative">
                                    <ShoppingCart size={18} />
                                    {cartCount > 0 && (
                                        <span className="bg-primary absolute -top-2 -right-2 min-w-[15px] h-[15px] px-0.5 flex items-center justify-center rounded-full text-white text-[10px] font-bold leading-none">
                                            {cartCount > 99 ? "99+" : cartCount}
                                        </span>
                                    )}
                                </div>
                                <span className="font-medium">Cart</span>
                            </Link>

                            <Link
                                to="/orders"
                                className="flex items-center gap-2 rounded-md px-3 py-2 text-text hover:text-primary hover:bg-white/50 transition"
                            >
                                <History size={18} />
                                <span className="font-medium">My Orders</span>
                            </Link>

                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setProfileOpen((prev) => !prev)}
                                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/50 transition"
                                >
                                    {user?.image ? (
                                        <img
                                            src={user.image}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full object-cover border border-[var(--color-border)] cursor-pointer"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary-dark)] flex items-center justify-center text-white text-sm font-bold">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </button>

                                {profileOpen && (
                                    <div
                                        className="absolute right-0 mt-3 w-56 bg-white rounded-2xl overflow-hidden z-50"
                                        style={{
                                            boxShadow: "0 8px 32px rgba(38,24,20,0.12)",
                                            border: "1px solid var(--color-border)",
                                        }}
                                    >
                                        <div className="py-1.5">
                                            <Link
                                                to="/profile"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-low)] transition-colors"
                                            >
                                                <div className="w-7 h-7 rounded-lg bg-[var(--color-surface-container)] flex items-center justify-center shrink-0">
                                                    <User size={14} className="text-[var(--color-primary-dark)]" />
                                                </div>
                                                My Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0 cursor-pointer">
                                                    <LogOut size={14} className="text-red-500" />
                                                </div>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="rounded-md px-4 py-2 font-medium text-text hover:bg-white/50 transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-md bg-[var(--color-primary-dark)] hover:bg-primary px-5 py-2.5 font-medium text-white transition"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* ── Mobile hamburger ── */}
                <button
                    className="md:hidden p-2 rounded-md text-text hover:bg-white/50 transition"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* ── Mobile menu ── */}
            {menuOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-[var(--color-border)] px-6 py-4 flex flex-col gap-4">
                    <Link
                        to="/cooks"
                        onClick={() => setMenuOpen(false)}
                        className="font-medium text-text hover:text-primary transition-colors py-2"
                    >
                        Browse Cooks
                    </Link>
                    <Link
                        to="/menu"
                        onClick={() => setMenuOpen(false)}
                        className="font-medium text-text hover:text-primary transition-colors py-2"
                    >
                        Browse Menu
                    </Link>

                    <div className="border-t border-[var(--color-border)] pt-4 flex flex-col gap-1">
                        {isUser ? (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    {user?.image ? (
                                        <img
                                            src={user.image}
                                            alt={user.name}
                                            className="w-9 h-9 rounded-full object-cover border border-[var(--color-border)]"
                                        />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-[var(--color-primary-dark)] flex items-center justify-center text-white font-bold">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-semibold text-[var(--color-text)]">{user?.name}</p>
                                        <p className="text-xs text-[var(--color-text-muted)]">{user?.email}</p>
                                    </div>
                                </div>

                                <Link
                                    to="/place-order"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 py-2 font-medium text-text hover:text-primary transition-colors"
                                >
                                    <div className="relative">
                                        <ShoppingCart size={18} />
                                        {cartCount > 0 && (
                                            <span className="bg-primary absolute -top-2 -right-2 min-w-[16px] h-[16px] px-0.5 flex items-center justify-center rounded-full text-white text-[10px] font-bold leading-none">
                                                {cartCount > 99 ? "99+" : cartCount}
                                            </span>
                                        )}
                                    </div>
                                    Cart
                                    {cartCount > 0 && (
                                        <span className="ml-auto text-xs font-semibold" style={{ color: "var(--color-primary-dark)" }}>
                                            {cartCount} item{cartCount !== 1 ? "s" : ""}
                                        </span>
                                    )}
                                </Link>

                                <Link
                                    to="/orders"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 py-2 font-medium text-text hover:text-primary transition-colors"
                                >
                                    <History size={18} />
                                    My Orders
                                </Link>

                                <Link
                                    to="/profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 py-2 font-medium text-text hover:text-primary transition-colors"
                                >
                                    <User size={18} />
                                    My Profile
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 py-2 font-medium text-red-600 hover:text-red-700 transition-colors w-full"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3 mt-2">
                                <Link
                                    to="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="w-full text-center rounded-md px-4 py-2.5 font-medium text-text border border-[var(--color-border)] hover:bg-white/50 transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMenuOpen(false)}
                                    className="w-full text-center rounded-md bg-[var(--color-primary-dark)] hover:bg-primary px-5 py-2.5 font-medium text-white transition"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
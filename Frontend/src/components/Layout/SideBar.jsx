import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, LogOut, Star, ShieldAlert } from 'lucide-react';

const DashboardSidebar = ({ navItems, user, role, sidebarOpen, setSidebarOpen, onLogout }) => {
    const location = useLocation();
    return (
        <>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[var(--color-border)]/50 flex flex-col
                transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-auto
            `}>
                <div className="flex items-center justify-between px-6 h-20 border-b border-[var(--color-border)]/40 shrink-0">
                    <Link to="/" className="text-[var(--color-primary-dark)] hover:text-[var(--color-primary)] transition-colors"
                        style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700 }}>
                        HomeFeast  {role === 'admin' ? `Admin` : `Cook`}
                    </Link>
                    <button className="lg:hidden p-1 rounded-md hover:bg-[var(--color-surface-low)]"
                        onClick={() => setSidebarOpen(false)}>
                        <X size={20} className="text-[var(--color-text-muted)]" />
                    </button>
                </div>
                
                <div className="px-6 py-5 border-b border-[var(--color-border)]/40 shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Profile Image / Fallback Container */}
                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary-dark)] flex items-center justify-center text-white font-bold shrink-0 overflow-hidden">
                            {user?.image ? (
                                <img 
                                    src={user.image} 
                                    alt={user?.name || 'Profile'} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span>{user?.name?.charAt(0).toUpperCase() || (role === 'admin' ? 'A' : 'C')}</span>
                            )}
                        </div>
                        
                        <div className="min-w-0">
                            <p className="font-bold text-md text-[var(--color-text)] truncate">{user?.name}</p>
                            <p className="text-xs text-[var(--color-text-muted)] truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>
                
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map(({ label, icon: Icon, path }) => {
                        const isActive = location.pathname === path;
                        return (
                            <Link key={path} to={path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all
                                    ${isActive
                                        ? 'bg-[var(--color-primary-dark)] hover:bg-primary text-white shadow-sm'
                                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-low)] hover:text-[var(--color-text)]'
                                    }`}>
                                <Icon size={18} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>
                
                <div className="px-3 pb-6 shrink-0">
                    <button onClick={onLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-all cursor-pointer">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default DashboardSidebar;
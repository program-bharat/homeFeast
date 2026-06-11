import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../rtk/slices/authSlice.js';
import { loginUser } from '../api/authAPI.js';
import { notify } from '../utils/toast.jsx';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const imgRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const img = imgRef.current;
        if (!img) return;
        img.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        img.style.transform = 'scale(1.05)';
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 10;
            const y = (e.clientY / window.innerHeight - 0.5) * 10;
            img.style.transform = `scale(1.05) translate(${x}px, ${y}px)`;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend validation
        if (!form.email || !form.password) {
            return notify.error('Email and password are required.');
        }
        if (!/\S+@\S+\.\S+/.test(form.email)) {
            return notify.error('Please enter a valid email address.');
        }
        if (form.password.length < 6) {
            return notify.error('Password must be at least 6 characters.');
        }
        try {
            setLoading(true);
            const response = await loginUser({ email: form.email, password: form.password });
            dispatch(setCredentials({ user: response.data.data, token: response.data.token, }));
            notify.success('Welcome back!');
            navigate('/');
        } catch (err) {
            notify.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen overflow-hidden">
            <section className="hidden lg:flex lg:w-3/5 relative h-screen bg-[#3c2d27] overflow-hidden">
                <img
                    ref={imgRef}
                    src="https://plus.unsplash.com/premium_photo-1675252369719-dd52bc69c3df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D"
                    alt="A bountiful home-cooked feast"
                    className="absolute inset-0 w-full h-screen object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#390c00]/60 via-transparent to-transparent" />
                <div className="relative z-10 flex flex-col justify-end p-20 h-full w-full">
                    <div className="mb-4">
                        <span
                            className="text-white block"
                            style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '48px',
                                lineHeight: '56px',
                                letterSpacing: '-0.02em',
                                fontWeight: 700,
                            }}
                        >
                            HomeFeast
                        </span>
                        <p
                            className="text-white/90 max-w-md mt-4"
                            style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '24px',
                                lineHeight: '32px',
                                fontWeight: 600,
                            }}
                        >
                            Authentic flavors, cooked with love, delivered to your doorstep.
                        </p>
                    </div>
                    <div
                        className="flex items-center gap-4 text-white/80"
                        style={{ fontSize: '14px', lineHeight: '16px', letterSpacing: '0.01em', fontWeight: 600 }}
                    >
                        <span className="w-12 h-px bg-white/40" />
                        <span>Join over 5,000 local cooks today</span>
                    </div>
                </div>
            </section>
            {/* Right: Login Form  */}
            <section className="w-full lg:w-2/5 flex flex-col justify-center items-center bg-[var(--color-background)] py-12 pt-20 md:px-20">
                <div className="w-full max-w-sm flex flex-col items-center">
                    <div className="lg:hidden mb-12 flex flex-col items-center">
                        <span
                            className="text-[var(--color-primary)]"
                            style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '32px',
                                lineHeight: '40px',
                                letterSpacing: '-0.01em',
                                fontWeight: 600,
                            }}
                        >
                            HomeFeast
                        </span>
                    </div>
                    {/* Form header */}
                    <div className="w-full mb-10 text-center lg:text-left">
                        <h1
                            className="text-[var(--color-text)] mb-2"
                            style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '32px',
                                lineHeight: '40px',
                                letterSpacing: '-0.01em',
                                fontWeight: 600,
                            }}
                        >
                            Welcome Back
                        </h1>
                        <p
                            className="text-[var(--color-text-muted)]"
                            style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 400 }}
                        >
                            Please enter your details to sign in.
                        </p>
                    </div>
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="w-full space-y-6">
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="block text-[var(--color-text-muted)]"
                                style={{ fontSize: '14px', lineHeight: '16px', letterSpacing: '0.01em', fontWeight: 600 }}
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="michelin@homefeast.com"
                                className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] outline-none transition-all focus:border-[var(--color-primary)]"
                                style={{
                                    fontSize: '16px',
                                    lineHeight: '24px',
                                    boxShadow: 'none',
                                }}
                                onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255,107,53,0.2)')}
                                onBlur={(e) => (e.target.style.boxShadow = 'none')}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label
                                    htmlFor="password"
                                    className="block text-[var(--color-text-muted)]"
                                    style={{ fontSize: '14px', lineHeight: '16px', letterSpacing: '0.01em', fontWeight: 600 }}
                                >
                                    Password
                                </label>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] outline-none transition-all focus:border-[var(--color-primary)]"
                                style={{ fontSize: '16px', lineHeight: '24px', boxShadow: 'none' }}
                                onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255,107,53,0.2)')}
                                onBlur={(e) => (e.target.style.boxShadow = 'none')}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 bg-[var(--color-primary-dark)] text-white rounded-lg shadow-sm hover:bg-[var(--color-primary)] active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                            style={{ fontSize: '14px', lineHeight: '16px', letterSpacing: '0.01em', fontWeight: 600 }}
                        >
                            Login
                            <ArrowRight size={18} />
                        </button>
                    </form>
                    <div className="mt-12 text-center">
                        <p
                            className="text-[var(--color-text-muted)]"
                            style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 400 }}
                        >
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-[var(--color-primary)] hover:underline ml-1"
                                style={{ fontSize: '14px', lineHeight: '16px', letterSpacing: '0.01em', fontWeight: 600 }}
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
                <footer className="mt-auto pt-10">
                    <nav className="flex gap-4 items-center justify-center">
                        <Link
                            to="#"
                            className="text-[var(--color-outline)] hover:text-[var(--color-primary)] transition-colors"
                            style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}
                        >
                            Privacy Policy
                        </Link>
                        <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                        <Link
                            to="#"
                            className="text-[var(--color-outline)] hover:text-[var(--color-primary)] transition-colors"
                            style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}
                        >
                            Terms of Service
                        </Link>
                    </nav>
                    <p
                        className="text-center mt-4 text-[var(--color-outline)] opacity-60"
                        style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}
                    >
                        © 2024 HomeFeast. All rights reserved.
                    </p>
                </footer>
            </section>
        </main>
    );
};

export default Login;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, UtensilsCrossed } from 'lucide-react';
import { useScrollReveal } from "../hooks/UseScrollRevel.jsx";

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../rtk/slices/authSlice.js';
import { registerUser } from '../api/authAPI.js';
import { notify } from '../utils/toast.jsx';

const inputCls = 'w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] outline-none transition-all focus:border-[var(--color-primary)]';
const labelCls = 'block text-[var(--color-text-muted)]';
const labelStyle = { fontSize: '14px', lineHeight: '16px', letterSpacing: '0.01em', fontWeight: 600 };
const inputStyle = { fontSize: '16px', lineHeight: '24px', fontWeight: 400 };

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [role, setRole] = useState('customer');
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        bio: '',
        serviceArea: '',
        deliveryTimings: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.fullName || !form.email || !form.phone || !form.password || !form.confirmPassword) {
            return notify.error('All fields are required.');
        }
        if (!/\S+@\S+\.\S+/.test(form.email)) {
            return notify.error('Please enter a valid email address.');
        }
        if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
            return notify.error('Please enter a valid 10-digit phone number.');
        }
        if (form.password.length < 6) {
            return notify.error('Password must be at least 6 characters.');
        }
        if (form.password !== form.confirmPassword) {
            return notify.error('Passwords do not match.');
        }
        if (role === 'cook' && !form.bio) {
            return notify.error('Please add a culinary bio.');
        }
        try {
            const payload = {
                name: form.fullName,
                email: form.email,
                phone: form.phone,
                password: form.password,
                role: role === 'customer' ? 'user' : 'cook',
                ...(role === 'cook' && {
                    bio: form.bio,
                    serviceArea: form.serviceArea,
                    deliveryTimings: form.deliveryTimings,
                }),
            };
            const response = await registerUser(payload);
            if (role === 'cook') {
                notify.success('Registration successful! Awaiting admin approval.');
                navigate('/login');
            } else {
                notify.success('Account created successfully!');
                navigate('/login');
            }
        } catch (err) {
            notify.error(err);
        }
    };
    useScrollReveal();
    return (
        <main className="flex h-screen overflow-hidden">
            <section className="hidden md:flex w-1/2 relative bg-[var(--color-primary-dark)] overflow-hidden h-screen">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#ab3500]/60 via-transparent to-transparent" />
                {/* 2-column photo grid */}
                <div className="absolute inset-0 grid grid-cols-2 gap-4 p-8">
                    {/* col 1 */}
                    <div className="space-y-4">
                        <div className="group aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl -rotate-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl">
                            <img
                                src="https://images.unsplash.com/photo-1590915063357-4cd7e69899ca?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTl8NDcwNDE5OXx8ZW58MHx8fHx8"
                                alt="Herb-crusted salmon"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="group aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl -rotate-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl">
                            <img
                                src="https://images.unsplash.com/photo-1609672655400-c509bdbcf7e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fG5vb2RsZXN8ZW58MHx8MHx8fDA%3D"
                                alt="Pasta in tomato sauce"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    {/* col 2 — offset down */}
                    <div className="space-y-4 pt-12">
                        <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl rotate-1">
                            <img
                                src="https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw0NzA0MTk5fHxlbnwwfHx8fHw%3D"
                                alt="Artisan sourdough bread"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl -rotate-3">
                            <img
                                src="https://images.unsplash.com/photo-1594488506255-a8bbfdeedbaf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzd8fGljZSUyMGNyZWFtfGVufDB8fDB8fHwwurl"
                                alt="Mediterranean feast"
                                className="w-full h-full object-cover group-hover:scale-110"
                            />
                        </div>
                    </div>
                </div>
                {/* bottom headline */}
                <div className="reveal delay-1 absolute bottom-16 left-12 right-12 z-20 text-white">
                    <h1
                        style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '48px',
                            lineHeight: '56px',
                            letterSpacing: '-0.02em',
                            fontWeight: 700,
                        }}
                        className="mb-4 leading-tight"
                    >
                        Taste the heart of every home.
                    </h1>
                    <p style={{ fontSize: '18px', lineHeight: '28px', opacity: 0.9 }} className="max-w-md">
                        Connect with local culinary masters or share your own kitchen creations with your community.
                    </p>
                </div>
            </section>

            {/* ── Right: Registration form  */}
            <section className="w-full md:w-1/2 h-screen overflow-y-auto px-4 md:px-8 py-6">
                <header className="flex justify-between items-center mb-20">
                    <div
                        className="text-[var(--color-primary-dark)] hover:text-primary "
                        style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', lineHeight: '32px', fontWeight: 700 }}
                    >
                        <Link to="/">HomeFeast</Link>
                    </div>
                    <div className="flex gap-2 items-center">
                        <span
                            className="text-[var(--color-text-muted)]"
                            style={{ fontSize: '14px', lineHeight: '16px', letterSpacing: '0.01em', fontWeight: 600 }}
                        >
                            Already have an account?
                        </span>
                        <Link
                            to="/login"
                            className="text-[var(--color-primary)] font-bold hover:underline"
                            style={{ fontSize: '14px', lineHeight: '16px', letterSpacing: '0.01em', fontWeight: 600 }}
                        >
                            Login
                        </Link>
                    </div>
                </header>
                <div className="max-w-md mx-auto w-full flex-grow">
                    <div className="mb-4 text-center md:text-left">
                        <h2
                            className="text-[var(--color-text)] mb-2"
                            style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '32px',
                                lineHeight: '40px',
                                letterSpacing: '-0.01em',
                                fontWeight: 600,
                            }}
                        >
                            Create Account
                        </h2>
                        <p className="text-[var(--color-text-muted)]" style={{ fontSize: '16px', lineHeight: '24px' }}>
                            Join the community of food lovers and creators.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <label className={labelCls} style={labelStyle}>Full Name</label>
                                <input
                                    name="fullName"
                                    type="text"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    placeholder="Jane Doe"
                                    className={inputCls}
                                    style={inputStyle}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls} style={labelStyle}>Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="jane@example.com"
                                    className={inputCls}
                                    style={inputStyle}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls} style={labelStyle}>Phone Number</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 000-0000"
                                    className={inputCls}
                                    style={inputStyle}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className={labelCls} style={labelStyle}>Password</label>
                                    <input
                                        name="password"
                                        type="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className={inputCls}
                                        style={inputStyle}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelCls} style={labelStyle}>Confirm Password</label>
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className={inputCls}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="py-4">
                            <label className={labelCls} style={{ ...labelStyle, display: 'block', marginBottom: '8px' }}>
                                I want to join as a...
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="relative group cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="customer"
                                        checked={role === 'customer'}
                                        onChange={() => setRole('customer')}
                                        className="sr-only peer"
                                    />
                                    <div
                                        className={`p-4 rounded-md border-2 flex flex-col items-center text-center gap-2 transition-all
                                            ${role === 'customer'
                                                ? 'border-[var(--color-primary)] bg-[#ffdbd0]'
                                                : 'border-[var(--color-border)] bg-white group-hover:bg-[var(--color-surface-container)]'
                                            }`}
                                    >
                                        <User size={24} className="text-[var(--color-primary)]" strokeWidth={1.5} />
                                        <span style={labelStyle} className="text-[var(--color-text)]">Customer</span>
                                    </div>
                                </label>
                                <label className="relative group cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="cook"
                                        checked={role === 'cook'}
                                        onChange={() => setRole('cook')}
                                        className="sr-only peer"
                                    />
                                    <div
                                        className={`p-4 rounded-md border-2 flex flex-col items-center text-center gap-2 transition-all
                                            ${role === 'cook'
                                                ? 'border-[var(--color-primary)] bg-[#ffdbd0]'
                                                : 'border-[var(--color-border)] bg-white group-hover:bg-[var(--color-surface-container)]'
                                            }`}
                                    >
                                        <UtensilsCrossed size={24} className="text-[var(--color-primary)]" strokeWidth={1.5} />
                                        <span style={labelStyle} className="text-[var(--color-text)]">Cook</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                        {/* Cook-only fields */}
                        <div
                            className="space-y-4 overflow-hidden transition-all duration-[400ms] ease-out"
                            style={{
                                maxHeight: role === 'cook' ? '800px' : '0px',
                                opacity: role === 'cook' ? 1 : 0,
                            }}
                        >
                            {/* Culinary Bio */}
                            <div className="space-y-2">
                                <label className={labelCls} style={labelStyle}>Culinary Bio</label>
                                <textarea
                                    name="bio"
                                    value={form.bio}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Tell us about your signature dishes and experience..."
                                    className={`${inputCls} resize-none`}
                                    style={inputStyle}
                                />
                            </div>
                            {/* Service Area + Delivery Timings */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className={labelCls} style={labelStyle}>Service Area</label>
                                    <input
                                        name="serviceArea"
                                        type="text"
                                        value={form.serviceArea}
                                        onChange={handleChange}
                                        placeholder="e.g. Brooklyn, NY"
                                        className={inputCls}
                                        style={inputStyle}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelCls} style={labelStyle}>Delivery Timings</label>
                                    <input
                                        name="deliveryTimings"
                                        type="text"
                                        value={form.deliveryTimings}
                                        onChange={handleChange}
                                        placeholder="e.g. 5pm - 9pm"
                                        className={inputCls}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-[var(--color-primary-dark)] hover:bg-primary text-white py-4 rounded-md shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                                style={{ fontSize: '14px', lineHeight: '16px', letterSpacing: '0.01em', fontWeight: 600 }}
                            >
                                Join HomeFeast
                            </button>
                        </div>
                        <p
                            className="text-center text-[var(--color-text-muted)] mt-4"
                            style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}
                        >
                            By clicking "Join HomeFeast", you agree to our{' '}
                            <a href="#" className="text-[var(--color-primary)] hover:underline">Terms of Service</a>{' '}
                            and{' '}
                            <a href="#" className="text-[var(--color-primary)] hover:underline">Privacy Policy</a>.
                        </p>
                    </form>
                </div>
                {/* Footer */}
                <footer className="mt-20 border-t border-[var(--color-border)] pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p
                        className="text-[var(--color-text-muted)]"
                        style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}
                    >
                        © 2024 HomeFeast. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <Link
                            to="/about"
                            className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                            style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}
                        >
                            About Us
                        </Link>
                        <Link
                            to="/contact"
                            className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                            style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}
                        >
                            Contact
                        </Link>
                        <Link
                            to="/help"
                            className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                            style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}
                        >
                            Help
                        </Link>
                    </div>
                </footer>
            </section>
        </main >
    );
};

export default Register;
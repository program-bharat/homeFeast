import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { User, MapPin, Edit2, Globe, Share2, CheckCircle2, AlertCircle, KeyRound, X } from 'lucide-react';
import { getProfile, updateProfile, changePassword } from '../../api/userAPI.js';
import { notify } from '../../utils/toast.jsx';
import { useScrollReveal } from '../../hooks/UseScrollRevel.jsx';

const inputCls = 'w-full bg-white border border-[var(--color-border)] rounded-lg p-3 outline-none transition-all duration-300 focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)]';
const labelCls = 'block text-[var(--color-text-muted)] uppercase tracking-wider';
const labelStyle = { fontSize: '12px', lineHeight: '16px', fontWeight: 600 };

const LiftCard = ({ children, className = '' }) => (
    <section
        className={`reveal delay-1 bg-white p-6 rounded-md shadow-sm border border-[var(--color-border)]/30 transition-all duration-300 hover:shadow-md ${className}`}
    >
        {children}
    </section>
);

const ProfilePanel = () => {
    const { user } = useSelector((state) => state.auth);
    const fileInputRef = useRef(null);

    const [isSaving, setIsSaving] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Password Modal States
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const [address, setAddress] = useState({
        street: '',
        apartment: '',
        city: '',
        state: '',
        pincode: '',
    });

    const fetchUserData = async () => {
        try {
            const response = await getProfile();
            const dbUser = response.data.data;
            setForm({
                name: dbUser.name || '',
                email: dbUser.email || '',
                phone: dbUser.phone || '',
            });
            setAddress({
                street: dbUser.address?.street || '',
                apartment: dbUser.address?.apartment || '',
                city: dbUser.address?.city || '',
                state: dbUser.address?.state || '',
                pincode: dbUser.address?.pincode || '',
            });
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('phone', form.phone);
            formData.append('street', address.street);
            formData.append('city', address.city);
            formData.append('state', address.state);
            formData.append('pincode', address.pincode);

            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            await updateProfile(formData);
            await fetchUserData();
            setSelectedImage(null);
            setImagePreview(null);
            notify.success('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating profile:", error);
            notify.error('Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            return notify.error('New passwords do not match!');
        }
        setIsChangingPassword(true);
        try {
            await changePassword({
                oldPassword: passwordForm.oldPassword,
                newPassword: passwordForm.newPassword,
                confirmPassword: passwordForm.confirmPassword
            });
            notify.success('Password updated successfully!');
            setIsPasswordModalOpen(false);
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error("Error changing password:", error);
            notify.error(error);
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleDiscard = () => {
        setForm({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
        });
        setAddress({
            street: user?.address?.street || '',
            apartment: '',
            city: user?.address?.city || '',
            state: user?.address?.state || '',
            pincode: user?.address?.pincode || '',
        });
        setSelectedImage(null);
        setImagePreview(null);
    };

    const displayImage = imagePreview || user?.image;
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    useScrollReveal();

    return (
        <>
            <div className="w-full pb-10">
                <header className="mb-10 flex flex-col md:flex-row items-center md:items-end gap-6">
                    <div className="relative group shrink-0">
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        {displayImage ? (
                            <img
                                src={displayImage}
                                alt={user?.name || "Profile"}
                                className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow-lg group-hover:opacity-90 transition-opacity"
                            />
                        ) : (
                            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-[var(--color-surface-container)] border-4 border-white shadow-lg flex items-center justify-center">
                                <span
                                    className="text-[var(--color-primary-dark)] font-bold"
                                    style={{ fontFamily: 'var(--font-heading)', fontSize: '48px' }}
                                >
                                    {form.name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>
                        )}
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="absolute bottom-1 right-1 bg-[var(--color-primary-dark)] text-white p-2 rounded-full shadow-lg hover:scale-110 hover:brightness-110 active:scale-95 transition-all z-10"
                            title="Update Profile Picture"
                        >
                            <Edit2 size={14} />
                        </button>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h1
                            className="text-[var(--color-text)] mb-1"
                            style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(28px, 3vw, 40px)',
                                lineHeight: '1.1',
                                letterSpacing: '-0.02em',
                                fontWeight: 700,
                            }}
                        >
                            {form.name || 'Your Name'}
                        </h1>
                        <p className="text-[var(--color-text-muted)] text-sm mt-1">Manage your cook profile and details</p>
                    </div>

                    {/* Header Actions */}
                    <div className="flex flex-wrap gap-3 justify-center md:justify-end shrink-0">
                        <button
                            onClick={handleDiscard}
                            disabled={isSaving}
                            className="px-6 py-2.5 rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-low)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontSize: '14px', lineHeight: '16px', letterSpacing: '0.01em', fontWeight: 600 }}
                        >
                            Discard
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center justify-center min-w-[140px] px-6 py-2.5 rounded-md bg-[var(--color-primary)] text-white shadow-md hover:brightness-110 hover:scale-[1.02] hover:shadow-lg active:scale-95 transition-all disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-wait"
                            style={{ fontSize: '14px', lineHeight: '16px', letterSpacing: '0.01em', fontWeight: 600 }}
                        >
                            {isSaving ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                            ) : (
                                'Save Changes'
                            )}
                        </button>

                        {/* Change Password Button Trigger */}
                        <button
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-gray-800 text-white shadow-md hover:bg-gray-900 hover:scale-[1.02] transition-all active:scale-95"
                            style={{ fontSize: '14px', lineHeight: '16px', letterSpacing: '0.01em', fontWeight: 600 }}
                        >
                            <KeyRound size={16} />
                            Change Password
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-6">
                    <LiftCard>
                        <div className="flex items-center gap-3 mb-6">
                            <User size={20} className="text-[var(--color-primary)]" />
                            <h2
                                className="text-[var(--color-text)]"
                                style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', lineHeight: '32px', fontWeight: 600 }}
                            >
                                Personal Information
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className={labelCls} style={labelStyle}>Full Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    value={form.name}
                                    onChange={handleFormChange}
                                    className={inputCls}
                                    style={{ fontSize: '16px', lineHeight: '24px' }}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls} style={labelStyle}>Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    readOnly
                                    className={`${inputCls} bg-gray-50 cursor-not-allowed`}
                                    style={{ fontSize: '16px', lineHeight: '24px' }}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className={labelCls} style={labelStyle}>Phone Number</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={handleFormChange}
                                    placeholder="+1 (555) 000-0000"
                                    className={inputCls}
                                    style={{ fontSize: '16px', lineHeight: '24px' }}
                                />
                            </div>
                        </div>
                    </LiftCard>

                    <LiftCard>
                        <div className="flex items-center gap-3 mb-6">
                            <MapPin size={20} className="text-[var(--color-primary)]" />
                            <h2
                                className="text-[var(--color-text)]"
                                style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', lineHeight: '32px', fontWeight: 600 }}
                            >
                                Kitchen Address
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                            <div className="space-y-2 md:col-span-6">
                                <label className={labelCls} style={labelStyle}>Street Address</label>
                                <input
                                    name="street"
                                    type="text"
                                    value={address.street}
                                    onChange={handleAddressChange}
                                    placeholder="123 Culinary Drive"
                                    className={inputCls}
                                    style={{ fontSize: '16px', lineHeight: '24px' }}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-3">
                                <label className={labelCls} style={labelStyle}>City</label>
                                <input
                                    name="city"
                                    type="text"
                                    value={address.city}
                                    onChange={handleAddressChange}
                                    placeholder="Brooklyn"
                                    className={inputCls}
                                    style={{ fontSize: '16px', lineHeight: '24px' }}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className={labelCls} style={labelStyle}>State</label>
                                <input
                                    name="state"
                                    type="text"
                                    value={address.state}
                                    onChange={handleAddressChange}
                                    placeholder="NY"
                                    className={inputCls}
                                    style={{ fontSize: '16px', lineHeight: '24px' }}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-1">
                                <label className={labelCls} style={labelStyle}>ZIP</label>
                                <input
                                    name="pincode"
                                    type="text"
                                    value={address.pincode}
                                    onChange={handleAddressChange}
                                    placeholder="11232"
                                    className={inputCls}
                                    style={{ fontSize: '16px', lineHeight: '24px' }}
                                />
                            </div>
                            <div className="md:col-span-6 flex justify-end mt-4">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-6 py-2.5 rounded-md bg-[var(--color-primary)] text-white shadow-md hover:brightness-110 hover:scale-[1.02] hover:shadow-lg active:scale-95 transition-all disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-wait min-w-[140px] flex justify-center"
                                    style={{ fontSize: '14px', lineHeight: '16px', letterSpacing: '0.01em', fontWeight: 600 }}
                                >
                                    {isSaving ? 'Saving...' : 'Save Address'}
                                </button>
                            </div>
                        </div>
                    </LiftCard>
                </div>
            </div>

            {/* Change Password Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white w-full max-w-md rounded-md shadow-xl border border-[var(--color-border)]/50 overflow-hidden transform transition-all scale-100">
                        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]/50">
                            <div className="flex items-center gap-2.5">
                                <KeyRound size={20} className="text-[var(--color-primary)]" />
                                <h3 className="text-lg font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
                                    Update Password
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsPasswordModalOpen(false)}
                                className="p-1 rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-surface-low)] transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="p-5 space-y-4">
                            <div className="space-y-1.5">
                                <label className={labelCls} style={labelStyle}>Old Password</label>
                                <input
                                    required
                                    type="password"
                                    name="oldPassword"
                                    value={passwordForm.oldPassword}
                                    onChange={handlePasswordChange}
                                    className={inputCls}
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className={labelCls} style={labelStyle}>New Password</label>
                                <input
                                    required
                                    type="password"
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    className={inputCls}
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className={labelCls} style={labelStyle}>Confirm New Password</label>
                                <input
                                    required
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className={inputCls}
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex gap-3 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordModalOpen(false)}
                                    className="px-4 py-2 rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-low)] transition-all"
                                    style={{ fontSize: '14px', fontWeight: 600 }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isChangingPassword}
                                    className="flex items-center justify-center min-w-[140px] px-5 py-2 rounded-md bg-[var(--color-primary)] text-white shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-wait"
                                    style={{ fontSize: '14px', fontWeight: 600 }}
                                >
                                    {isChangingPassword ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </span>
                                    ) : (
                                        'Change Password'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfilePanel;

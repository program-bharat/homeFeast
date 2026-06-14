import React, { useEffect, useState } from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedOrder } from '../rtk/slices/orderSlice.js';
import { getOrderDetails } from '../api/orderAPI.js';
import { notify } from '../utils/toast.jsx';

const OrderDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const order = useSelector((state) => state.order.selectedOrder);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const response = await getOrderDetails(id);
                if (response.success) {
                    dispatch(setSelectedOrder(response.data));
                } else {
                    const errMsg = response.message || "Failed to fetch order";
                    setError(errMsg);
                    notify.error(errMsg); // Toast notification for backend errors
                }
            } catch (err) {
                console.error("Error fetching order details:", err);
                const fallbackMsg = "An error occurred while fetching the order details.";
                setError(fallbackMsg);
                notify.error(fallbackMsg);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id, dispatch]);

    const formatAddress = (address) => {
        if (!address) return "No delivery address provided";

        if (typeof address === 'object') {
            const { street, city, state, pincode } = address;
            return [street, city, state, pincode].filter(Boolean).join(', ');
        }

        return address;
    };

    if (loading) {
        return (
            <main className="pt-10 pb-20 px-4 flex justify-center items-center min-h-[50vh]">
                <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-heading)' }}>Loading order details...</p>
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className="pt-10 pb-20 px-4 flex justify-center items-center min-h-[50vh]">
                <p style={{ color: 'red', fontFamily: 'var(--font-heading)' }}>{error || "Order not found."}</p>
            </main>
        );
    }

    return (
        <main className="pt-10 pb-20 px-4">
            <div className="max-w-[1280px] mx-auto">
                <h1
                    className="mb-8"
                    style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(24px, 4vw, 36px)',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                    }}
                >
                    Order Details
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 space-y-6">
                        {/* Cook Information */}
                        <section
                            className="rounded-md p-6 shadow-sm"
                            style={{ background: 'white', border: '1px solid var(--color-border)' }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2
                                    style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: 'var(--color-text)' }}
                                >
                                    Your Cook
                                </h2>
                                <a
                                    href={`/cooks/₹{order.cookId?._id}`}
                                    className="flex items-center gap-1 hover:underline transition-colors"
                                    style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)' }}
                                >
                                    View Profile
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                                    </svg>
                                </a>
                            </div>
                            <div
                                className="flex items-center gap-4 p-4 rounded-lg"
                                style={{ background: 'var(--color-surface-low)' }}
                            >
                                <img
                                    className="w-16 h-16 rounded-full object-cover shrink-0"
                                    style={{ border: '2px solid var(--color-border)' }}
                                    src={order.cookId?.image || "https://via.placeholder.com/150"}
                                    alt={order.cookId?.name || "Cook"}
                                />
                                <div>
                                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>
                                        {order.cookId?.name || "Unknown Chef"}
                                    </h3>
                                    <div className="mt-2 space-y-1">
                                        {order.cookId?.email && (
                                            <div className="flex items-center gap-2" style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                                                <Mail size={14} className="shrink-0" style={{ color: 'var(--color-outline)' }} />
                                                <span>{order.cookId.email}</span>
                                            </div>
                                        )}
                                        {order.cookId?.phone && (
                                            <div className="flex items-center gap-2" style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                                                <Phone size={14} className="shrink-0" style={{ color: 'var(--color-outline)' }} />
                                                <span>{order.cookId.phone}</span>
                                            </div>
                                        )}
                                        {!order.cookId?.email && !order.cookId?.phone && (
                                            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                                No contact info available
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Order Items */}
                        <section
                            className="rounded-md p-6 shadow-sm"
                            style={{ background: 'white', border: '1px solid var(--color-border)' }}
                        >
                            <h2
                                className="mb-6"
                                style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: 'var(--color-text)' }}
                            >
                                Order Items
                            </h2>

                            <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                                <div className="py-4 flex gap-4 items-center">
                                    <img
                                        className="w-20 h-20 rounded-lg object-cover shrink-0"
                                        src={order.menuId?.image || "https://via.placeholder.com/150"}
                                        alt={order.menuId?.name || "Menu Item"}
                                    />
                                    <div className="flex-grow min-w-0">
                                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text)' }}>
                                            {order.menuId?.name || "Unknown Item"}
                                        </h3>
                                        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                                            {order.menuId?.category || "Standard"}
                                        </p>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)', marginTop: '4px' }}>
                                            {order.quantity} × ₹{order.menuId?.price?.toFixed(2) || "0.00"}
                                            {order.orderType === 'subscription' ? ` (${Math.ceil(order.totalPrice / (order.quantity * (order.menuId?.price || 1)))} Days)` : ''}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text)' }}>
                                            ₹{(order.quantity * (order.menuId?.price || 0)).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="mt-6 pt-6 space-y-2"
                                style={{ borderTop: '1px solid var(--color-border)' }}
                            >
                                <div className="flex justify-between">
                                    <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Subtotal</span>
                                    <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>₹{order.totalPrice?.toFixed(2) || "0.00"}</span>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)' }}>Total</span>
                                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: 'var(--color-primary)' }}>
                                        ₹{order.totalPrice?.toFixed(2) || "0.00"}
                                    </span>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <section
                            className="rounded-md p-6 shadow-sm"
                            style={{ background: 'white', border: '1px solid var(--color-border)' }}
                        >
                            <h2
                                className="mb-4"
                                style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: 'var(--color-text)' }}
                            >
                                Delivery Address
                            </h2>

                            <div className="flex gap-3 items-start">
                                <MapPin
                                    size={20}
                                    className="shrink-0 mt-0.5"
                                    style={{ color: 'var(--color-primary)' }}
                                />
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>Delivery Destination</p>
                                    <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: '1.6', marginTop: '2px', whiteSpace: 'pre-wrap' }}>
                                        {formatAddress(order.deliveryAddress)}
                                    </p>

                                    {order.note && (
                                        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '8px', fontStyle: 'italic' }}>
                                            "{order.note}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default OrderDetails;
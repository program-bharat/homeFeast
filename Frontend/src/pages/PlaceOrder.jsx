import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ChevronRight, MapPin, StickyNote, Calendar } from 'lucide-react';
import { selectCartItems, removeFromCart, clearCart } from '../rtk/slices/cartSlice.js';
import { createOrder } from '../api/orderAPI.js';
import { notify } from '../utils/toast.jsx';

const TODAY = new Date().toISOString().split('T')[0];

const PlaceOrder = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector(selectCartItems);
    const { token } = useSelector((state) => state.auth);

    const [orderType, setOrderType] = useState('one-time');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [note, setNote] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState({
        street: '',
        city: '',
        state: '',
        pincode: '',
    });
    const [loading, setLoading] = useState(false);

    const subscriptionDays =
        orderType === 'subscription' && startDate && endDate
            ? Math.max(
                0,
                Math.ceil(
                    (new Date(endDate).getTime() - new Date(startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
            )
            : 1;

    const grandTotal = cartItems.reduce((sum, { menuItem, quantity }) => {
        const itemPrice =
            orderType === 'subscription'
                ? menuItem.price * subscriptionDays * quantity
                : menuItem.price * quantity;
        return sum + itemPrice;
    }, 0);

    const handleRemove = (menuItemId) => {
        dispatch(removeFromCart(menuItemId));
        notify.success('Item removed from cart.');
    };

    const handleAddressChange = (e) => {
        setDeliveryAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validate = () => {
        if (cartItems.length === 0) {
            notify.error('Your cart is empty.');
            return false;
        }
        if (!token) {
            notify.error('Please log in to place an order.');
            navigate('/login');
            return false;
        }
        if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.pincode) {
            notify.error('Please fill in your delivery address.');
            return false;
        }
        if (orderType === 'subscription') {
            if (!startDate || !endDate) {
                notify.error('Please select start and end dates for subscription.');
                return false;
            }
            if (new Date(startDate) >= new Date(endDate)) {
                notify.error('End date must be after start date.');
                return false;
            }
        }
        return true;
    };

    const handlePlaceOrder = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await createOrder({
                items: cartItems.map(({ menuItem, quantity }) => ({
                    menuId: menuItem._id,
                    quantity,
                })),
                orderType,
                startDate: orderType === 'subscription' ? startDate : undefined,
                endDate: orderType === 'subscription' ? endDate : undefined,
                deliveryAddress,
                note,
            });
            dispatch(clearCart());
            notify.success('Order placed successfully!');
            navigate('/orders');
        } catch (err) {
            const msg = err?.response?.data?.message || 'Failed to place order. Please try again.';
            notify.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center pb-20 px-4">
                <div className="text-center max-w-sm">
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                        style={{ background: 'var(--color-surface-container)' }}
                    >
                        <ShoppingBag size={36} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <h2
                        className="mb-2"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '24px',
                            fontWeight: 700,
                            color: 'var(--color-text)',
                        }}
                    >
                        Your cart is empty
                    </h2>
                    <p
                        className="mb-6"
                        style={{ fontSize: '15px', color: 'var(--color-text-muted)' }}
                    >
                        Add some delicious meals before checking out.
                    </p>
                    <button
                        onClick={() => navigate('/menu')}
                        className="inline-flex items-center gap-2 rounded-md px-6 py-3 font-semibold text-white transition-all active:scale-95 cursor-pointer"
                        style={{ background: 'var(--color-primary-dark)', fontSize: '14px' }}
                    >
                        Browse Menu <ChevronRight size={16} />
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="pt-10 pb-20 px-4">
            <div className="max-w-[1100px] mx-auto">
                <h1
                    className="mb-8"
                    style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(24px, 4vw, 36px)',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                    }}
                >
                    Your Order
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
                    <div className="flex flex-col gap-6">
                        <section
                            className="rounded-xl p-6"
                            style={{
                                background: 'white',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            <h2
                                className="mb-4"
                                style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    color: 'var(--color-text)',
                                }}
                            >
                                Items ({cartItems.length})
                            </h2>

                            <div className="flex flex-col divide-y" style={{ borderColor: 'var(--color-border)' }}>
                                {cartItems.map(({ menuItem, quantity }) => {
                                    const lineTotal =
                                        orderType === 'subscription'
                                            ? menuItem.price * subscriptionDays * quantity
                                            : menuItem.price * quantity;
                                    return (
                                        <div
                                            key={menuItem._id}
                                            className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                                        >
                                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[var(--color-surface-container)]">
                                                <img
                                                    src={
                                                        menuItem.image ||
                                                        'https://placehold.co/64x64/ffe9e2/ab3500?text=🍛'
                                                    }
                                                    alt={menuItem.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className="truncate font-semibold"
                                                    style={{
                                                        fontFamily: 'var(--font-heading)',
                                                        fontSize: '15px',
                                                        color: 'var(--color-text)',
                                                    }}
                                                >
                                                    {menuItem.name}
                                                </p>
                                                <p
                                                    style={{
                                                        fontSize: '13px',
                                                        color: 'var(--color-text-muted)',
                                                        marginTop: '2px',
                                                    }}
                                                >
                                                    {menuItem.cookId?.name || 'Home Cook'} &middot; Qty: {quantity}
                                                </p>
                                                <p
                                                    style={{
                                                        fontSize: '14px',
                                                        fontWeight: 600,
                                                        color: 'var(--color-primary)',
                                                        marginTop: '4px',
                                                    }}
                                                >
                                                    ₹{lineTotal.toFixed(2)}
                                                    {orderType === 'subscription' && subscriptionDays > 1 && (
                                                        <span
                                                            style={{
                                                                fontWeight: 400,
                                                                color: 'var(--color-text-muted)',
                                                                fontSize: '12px',
                                                                marginLeft: '6px',
                                                            }}
                                                        >
                                                            (₹{menuItem.price} × {subscriptionDays} days × {quantity})
                                                        </span>
                                                    )}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleRemove(menuItem._id)}
                                                title="Remove item"
                                                className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50 group"
                                                style={{ border: '1px solid var(--color-border)' }}
                                            >
                                                <Trash2
                                                    size={16}
                                                    className="text-[var(--color-text-muted)] group-hover:text-red-500 transition-colors cursor-pointer "
                                                />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <section
                            className="rounded-xl p-6"
                            style={{
                                background: 'white',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            <h2
                                className="mb-4 flex items-center gap-2"
                                style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    color: 'var(--color-text)',
                                }}
                            >
                                <Calendar size={18} style={{ color: 'var(--color-primary)' }} />
                                Order Type
                            </h2>
                            <div className="flex gap-3 mb-4">
                                {['one-time', 'subscription'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setOrderType(type)}
                                        className="flex-1 py-2.5 rounded-md font-semibold transition-all active:scale-95 cursor-pointer "
                                        style={{
                                            fontSize: '14px',
                                            background:
                                                orderType === type
                                                    ? 'var(--color-primary-dark)'
                                                    : 'var(--color-surface-low)',
                                            color:
                                                orderType === type
                                                    ? 'white'
                                                    : 'var(--color-text-muted)',
                                            border:
                                                orderType === type
                                                    ? 'none'
                                                    : '1px solid var(--color-border)',
                                        }}
                                    >
                                        {type === 'one-time' ? 'One-time' : 'Subscription'}
                                    </button>
                                ))}
                            </div>

                            {orderType === 'subscription' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            className="block mb-1.5 font-medium"
                                            style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}
                                        >
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            min={TODAY}
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="input"
                                            style={{ fontSize: '14px' }}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block mb-1.5 font-medium"
                                            style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}
                                        >
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            min={startDate || TODAY}
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="input"
                                            style={{ fontSize: '14px' }}
                                        />
                                    </div>
                                    {subscriptionDays > 0 && startDate && endDate && (
                                        <p
                                            className="col-span-2"
                                            style={{
                                                fontSize: '13px',
                                                color: 'var(--color-primary)',
                                                fontWeight: 500,
                                            }}
                                        >
                                            {subscriptionDays} day{subscriptionDays !== 1 ? 's' : ''} selected
                                        </p>
                                    )}
                                </div>
                            )}
                        </section>

                        <section
                            className="rounded-xl p-6"
                            style={{
                                background: 'white',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            <h2
                                className="mb-4 flex items-center gap-2"
                                style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    color: 'var(--color-text)',
                                }}
                            >
                                <MapPin size={18} style={{ color: 'var(--color-primary)' }} />
                                Delivery Address
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label
                                        className="block mb-1.5 font-medium"
                                        style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}
                                    >
                                        Street
                                    </label>
                                    <input
                                        className="input"
                                        name="street"
                                        placeholder="123, Main Street"
                                        value={deliveryAddress.street}
                                        onChange={handleAddressChange}
                                        style={{ fontSize: '14px' }}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block mb-1.5 font-medium"
                                        style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}
                                    >
                                        City
                                    </label>
                                    <input
                                        className="input"
                                        name="city"
                                        placeholder="city name..."
                                        value={deliveryAddress.city}
                                        onChange={handleAddressChange}
                                        style={{ fontSize: '14px' }}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block mb-1.5 font-medium"
                                        style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}
                                    >
                                        State
                                    </label>
                                    <input
                                        className="input"
                                        name="state"
                                        placeholder="state name..."
                                        value={deliveryAddress.state}
                                        onChange={handleAddressChange}
                                        style={{ fontSize: '14px' }}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block mb-1.5 font-medium"
                                        style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}
                                    >
                                        Pincode
                                    </label>
                                    <input
                                        className="input"
                                        name="pincode"
                                        placeholder="- - - - - -"
                                        value={deliveryAddress.pincode}
                                        onChange={handleAddressChange}
                                        style={{ fontSize: '14px' }}
                                    />
                                </div>
                            </div>
                        </section>

                        <section
                            className="rounded-xl p-6"
                            style={{
                                background: 'white',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            <h2
                                className="mb-4 flex items-center gap-2"
                                style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    color: 'var(--color-text)',
                                }}
                            >
                                <StickyNote size={18} style={{ color: 'var(--color-primary)' }} />
                                Note for Cook
                                <span
                                    style={{
                                        fontSize: '12px',
                                        fontWeight: 400,
                                        color: 'var(--color-text-muted)',
                                    }}
                                >
                                    (optional)
                                </span>
                            </h2>
                            <textarea
                                rows={3}
                                className="input resize-none"
                                placeholder="Write you note here..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                style={{ fontSize: '14px' }}
                            />
                        </section>
                    </div>

                    <aside className="lg:sticky lg:top-28">
                        <div
                            className="rounded-xl p-6"
                            style={{
                                background: 'white',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            <h2
                                className="mb-5"
                                style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    color: 'var(--color-text)',
                                }}
                            >
                                Order Summary
                            </h2>

                            <div className="flex flex-col gap-3 mb-5">
                                {cartItems.map(({ menuItem, quantity }) => {
                                    const lineTotal =
                                        orderType === 'subscription'
                                            ? menuItem.price * subscriptionDays * quantity
                                            : menuItem.price * quantity;
                                    return (
                                        <div
                                            key={menuItem._id}
                                            className="flex justify-between items-center"
                                        >
                                            <span
                                                className="truncate max-w-[180px]"
                                                style={{
                                                    fontSize: '14px',
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                {menuItem.name}
                                                {quantity > 1 && (
                                                    <span className="ml-1 text-xs">×{quantity}</span>
                                                )}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    color: 'var(--color-text)',
                                                }}
                                            >
                                                ₹{lineTotal.toFixed(2)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div
                                className="border-t pt-4 mb-6"
                                style={{ borderColor: 'var(--color-border)' }}
                            >
                                <div className="flex justify-between items-center">
                                    <span
                                        style={{
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: '16px',
                                            fontWeight: 700,
                                            color: 'var(--color-text)',
                                        }}
                                    >
                                        Total
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: '20px',
                                            fontWeight: 700,
                                            color: 'var(--color-primary)',
                                        }}
                                    >
                                        ₹{grandTotal.toFixed(2)}
                                    </span>
                                </div>
                                {orderType === 'subscription' && subscriptionDays > 1 && (
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            color: 'var(--color-text-muted)',
                                            marginTop: '4px',
                                            textAlign: 'right',
                                        }}
                                    >
                                        for {subscriptionDays} days
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="w-full rounded-md py-3.5 font-semibold text-white transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                style={{
                                    background: loading ? 'var(--color-text-muted)' : 'var(--color-primary-dark)',
                                    fontSize: '15px',
                                }}
                            >
                                {loading ? 'Placing Order…' : `Place Order · ₹${grandTotal.toFixed(2)}`}
                            </button>

                            <button
                                onClick={() => navigate('/menu')}
                                className="w-full mt-3 rounded-md py-2.5 font-medium transition-all hover:opacity-80 cursor-pointer"
                                style={{
                                    fontSize: '14px',
                                    color: 'var(--color-primary-dark)',
                                    background: 'transparent',
                                }}
                            >
                                ← Continue browsing
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
};

export default PlaceOrder;
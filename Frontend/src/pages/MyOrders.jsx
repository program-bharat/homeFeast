import { useState, useEffect } from "react";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../api/orderAPI.js";
import OrderCard from "../components/order/OrderCard.jsx"

const MyOrders = () => {
    const [activeTab, setActiveTab] = useState("pending");
    const [gridOpacity, setGridOpacity] = useState(1);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getOrders();
                setOrders(response.data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleTabSwitch = (tabKey) => {
        setGridOpacity(0);

        setTimeout(() => {
            setActiveTab(tabKey);
            setGridOpacity(1);
        }, 200);
    };

    const tabs = [
        {
            key: "pending",
            label: "Pending",
            count: orders.filter((o) => o.status === "pending").length,
        },
        {
            key: "accepted",
            label: "Accepted",
            count: orders.filter((o) => o.status === "accepted").length,
        },
        {
            key: "delivered",
            label: "Delivered",
            count: orders.filter((o) => o.status === "delivered").length,
        },
        {
            key: "cancelled",
            label: "Cancelled",
            count: orders.filter((o) => o.status === "cancelled").length,
        },
    ];

    const filteredOrders = orders.filter(
        (order) => order.status === activeTab
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case "pending":
                return (
                    <span className="px-3 py-1 bg-surface-container-high/90 backdrop-blur-md rounded-full text-[12px] leading-[16px] font-semibold text-primary">
                        Pending
                    </span>
                );

            case "accepted":
                return (
                    <span className="px-3 py-1 bg-[#ffdf9f]/90 backdrop-blur-md rounded-full text-[12px] leading-[16px] font-semibold text-[#261a00]">
                        Accepted
                    </span>
                );

            case "delivered":
                return (
                    <span className="px-3 py-1 bg-[#e5dfd7]/90 backdrop-blur-md rounded-full text-[12px] leading-[16px] font-semibold text-[#66625c]">
                        Delivered
                    </span>
                );

            case "cancelled":
                return (
                    <span className="px-3 py-1 bg-red-100 rounded-full text-[12px] leading-[16px] font-semibold text-red-600">
                        Cancelled
                    </span>
                );

            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                Loading orders...
            </div>
        );
    }

    return (
        <div className="bg-[#fff8f6] text-[#261814] font-[Inter] antialiased min-h-screen">

            <main className="pt-10 pb-20 px-4 md:px-8 max-w-[1280px] mx-auto">

                <div className="flex md:flex-row md:items-end justify-center gap-4 mb-4">
                    <div>
                        <h1
                            className="text-center"
                            style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(24px, 4vw, 36px)',
                                fontWeight: 700,
                                color: 'var(--color-text)',
                            }}
                        >
                            My Orders
                        </h1>
                        <p className="text-[16px] leading-[24px] text-[#594139]">
                            Track your gourmet home-cooked meals and dining history.
                        </p>
                    </div>
                </div>

                <div className="flex overflow-x-auto whitespace-nowrap gap-3 sm:gap-6 w-full pb-2 mb-8 sm:mb-10 sm:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => handleTabSwitch(tab.key)}
                            className={`relative px-3 py-3 sm:px-4 sm:py-4 text-[13px] sm:text-[14px] leading-[16px] font-semibold transition-all shrink-0
                                ${activeTab === tab.key
                                    ? "text-[#ab3500] after:content-[''] after:absolute after:bottom-0 sm:after:bottom-[-2px] after:left-0 after:right-0 after:h-[2px] after:bg-[#ab3500]"
                                    : "text-[#594139] hover:text-[#ab3500]"
                                }`}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>

                <div
                    className="flex items-center justify-center"
                    style={{
                        opacity: gridOpacity,
                        transition: "opacity 0.2s ease",
                    }}
                >
                    {filteredOrders.length === 0 ? (
                        <div className="text-center max-w-sm">
                            <div
                                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                                style={{
                                    background: "var(--color-surface-container)",
                                }}
                            >
                                <ShoppingBag
                                    size={36}
                                    style={{
                                        color: "var(--color-primary)",
                                    }}
                                />
                            </div>

                            <h2
                                className="mb-2"
                                style={{
                                    fontFamily: "var(--font-heading)",
                                    fontSize: "24px",
                                    fontWeight: 700,
                                    color: "var(--color-text)",
                                }}
                            >
                                No order found here
                            </h2>

                            <p
                                className="mb-6"
                                style={{
                                    fontSize: "15px",
                                    color: "var(--color-text-muted)",
                                }}
                            >
                                It looks like you haven't placed any orders in this category yet.
                            </p>

                            <button
                                onClick={() => navigate("/menu")}
                                className="inline-flex items-center gap-2 rounded-md px-6 py-3 font-semibold text-white transition-all active:scale-95 cursor-pointer"
                                style={{
                                    background: "var(--color-primary-dark)",
                                    fontSize: "14px",
                                }}
                            >
                                Browse Menu <ChevronRight size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredOrders.map((order) => (
                                <OrderCard
                                    key={order._id}
                                    order={order}
                                    getStatusBadge={getStatusBadge}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
export default MyOrders;
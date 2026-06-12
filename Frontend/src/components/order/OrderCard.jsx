import { useNavigate } from "react-router-dom";
import { useScrollReveal } from "../../hooks/UseScrollRevel.jsx";
const OrderCard = ({ order, getStatusBadge }) => {
    useScrollReveal();
    const navigate = useNavigate();
    const isDelivered = order.status === "delivered";
    return (
        <div
            className="reveal delay-1 group bg-white rounded-2xl border border-[#e1bfb5]/30 hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300 opacity-100 hover:opacity-100 w-[250px]"
            style={isDelivered ? { opacity: 0.8 } : {}}
            onMouseEnter={(e) =>
                isDelivered && (e.currentTarget.style.opacity = "1")
            }
            onMouseLeave={(e) =>
                isDelivered && (e.currentTarget.style.opacity = "0.8")
            }
        >
            <div className="relative h-48 rounded-t-md overflow-hidden">
                <img
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isDelivered
                        ? "grayscale group-hover:grayscale-0"
                        : ""
                        }`}
                    src={
                        order.menuId?.image ||
                        "https://placehold.co/600x400?text=Food"
                    }
                    alt={order.menuId?.name}
                />

                <div className="absolute top-4 right-4">
                    {getStatusBadge(order.status)}
                </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-[Outfit] text-[24px] leading-[32px] font-semibold text-[#261814]">
                        {order.menuId?.name}
                    </h3>
                    <span className="text-[14px] leading-[16px] font-semibold text-[#ab3500]">
                        ₹{order.totalPrice}
                    </span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-[14px] leading-[20px] text-[#594139]">
                        Cooked by{" "}
                        <span className="text-[#261814] font-semibold">
                            {order.cookId?.name}
                        </span>
                    </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#e1bfb5]/30">
                    <span className="text-[12px] leading-[16px] font-semibold text-[#66625c]">
                        Qty: {order.quantity}
                    </span>

                    <button
                        onClick={() => navigate(`/orders-details/${order._id}`)}
                        className="text-[14px] leading-[16px] font-semibold text-[#ab3500] hover:underline cursor-pointer"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
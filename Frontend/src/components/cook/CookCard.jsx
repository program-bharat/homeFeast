import { useNavigate } from "react-router-dom";
import { Star, MapPin, Bike, Clock } from "lucide-react";
import { useScrollReveal } from "../../hooks/UseScrollRevel.jsx";

const CookCard = ({ cook }) => {
    const navigate = useNavigate();
    useScrollReveal();
    const { _id, name, image, bio, address, serviceArea, deliveryTimings, rating = 5, topRated = false } = cook;
    return (
        <div className="reveal delay-1 group flex flex-col h-full rounded-md bg-surface-low p-6 transition-all hover:-translate-y-1 hover:shadow-lg border border-[var(--color-border)]/30">
            <div className="relative mb-6">
                <div className="mx-auto h-45 w-45 overflow-hidden rounded-full border-4 border-white shadow-md bg-[var(--color-surface-container)] flex items-center justify-center">
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <span className="text-[var(--color-primary-dark)] font-bold text-6xl font-heading">
                            {name?.charAt(0).toUpperCase() || "C"}
                        </span>
                    )}
                </div>
                {topRated && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-yellow-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-yellow-800">
                        Top Rated
                    </div>
                )}
            </div>
            <div className="text-center flex flex-col flex-1">
                <h3 className="heading-md text-[var(--color-text)] mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                    {name}
                </h3>
                {bio && (
                    <p className="body-sm mb-3 text-[var(--color-text-muted)] line-clamp-2 px-2">
                        {bio}
                    </p>
                )}
                <button
                    onClick={() => navigate(`/cook-profile/${_id}`)}
                    className="mt-auto w-full rounded-md border border-[var(--color-primary)] py-2 font-semibold text-[var(--color-primary)] transition-all hover:bg-[var(--color-primary)] hover:text-white cursor-pointer active:scale-95"
                >
                    View Profile
                </button>
            </div>
        </div>
    );
};

export default CookCard;
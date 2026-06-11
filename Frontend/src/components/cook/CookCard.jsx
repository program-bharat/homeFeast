import { Star } from "lucide-react";
import { useScrollReveal } from "../../hooks/UseScrollRevel.jsx";

const CookCard = ({
    name,
    specialty,
    image,
    rating = 5,
    topRated = false,
}) => {
    useScrollReveal();
    return (
        <div className="reveal delay-1 group rounded-md bg-surface-low p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="relative mb-6">
                <div className="mx-auto h-36 w-36 overflow-hidden rounded-full border-4 border-white shadow-md">
                    <img
                        src={image || "https://placehold.co/400x300/ffe9e2/ab3500?text=No+Image"}
                        alt={name}
                        className="h-full w-full object-cover"
                    />
                </div>

                {topRated && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-yellow-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-yellow-800">
                        Top Rated
                    </div>
                )}
            </div>

            <div className="text-center">
                <h3 className="heading-md text-on-surface">
                    {name}
                </h3>

                <p className="body-sm mb-4 text-text-muted">
                    {specialty}
                </p>

                <div className="mb-6 flex justify-center gap-1">
                    {[...Array(5)].map((_, index) => (
                        <Star
                            key={index}
                            size={16}
                            fill={index < rating ? "currentColor" : "none"}
                            className="text-yellow-500"
                        />
                    ))}
                </div>

                <button className="w-full rounded-md border border-primary py-2 font-semibold text-primary transition-all hover:bg-primary hover:text-white cursor-pointer">
                    Follow Chef
                </button>
            </div>
        </div>
    );
};

export default CookCard;
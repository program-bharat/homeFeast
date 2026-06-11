import { Star, Clock3 } from "lucide-react";
import FeaturedMenuCard from "./FeaturedMenuCard";

const MenuCard = ({ image, title, chef, rating, time, price, }) => {
    console.log(title, image);
    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-lg lg:h-full">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    onError={() => console.log("FAILED:", image)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-primary backdrop-blur-md">
                    ₹{price}
                </div>
            </div>
            <div className="p-6">
                <h3 className="heading-md mb-1">
                    {title}
                </h3>

                <p className="body-sm mb-4 text-text-muted">
                    By {chef}
                </p>
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-sm font-bold text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        {rating}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-text-muted">
                        <Clock3 size={16} />
                        {time}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MenuCard;
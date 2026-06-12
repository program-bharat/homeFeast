const FeaturedMenuCard = ({ image, title, chef, price }) => {
    return (
        <div className="group relative overflow-hidden rounded-2xl shadow-md transition-shadow hover:shadow-xl md:col-span-6 lg:col-span-8 aspect-[16/9]">
            <img
                src={image}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-8">
                <div className="flex items-end justify-between">
                    <div>
                        <span className="mb-3 inline-block rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase text-white">
                            Best Seller
                        </span>
                        <h3
                            className="mb-2 text-3xl font-semibold text-white"
                            style={{ fontFamily: 'var(--font-heading)' }}
                        >
                            {title}
                        </h3>
                        <p className="body-sm mb-4 text-primary">
                            By {chef}
                        </p>
                    </div>

                    <div className="text-right text-white">
                        <div
                            className="mb-2 text-2xl font-bold"
                            style={{ fontFamily: 'var(--font-heading)' }}
                        >
                            ₹{price}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedMenuCard;
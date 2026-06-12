import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notify } from "../utils/toast.jsx";
import { ArrowRight, UtensilsCrossed, ShoppingBasket, Bike, HeartPulse, MapPin, PiggyBank, BadgeCheck } from "lucide-react";
import CookCard from '../components/cook/CookCard.jsx';
import FeaturedMenuCard from '../components/home/FeaturedMenuCard.jsx';
import MenuCard from '../components/home/MenuCard.jsx';
import { useScrollReveal } from "../hooks/UseScrollRevel.jsx";
import { getAllCooks } from '../api/cookAPI.js';

const Home = () => {
    const [featuredCooks, setFeaturedCooks] = useState([]);

    useEffect(() => {
        getAllCooks()
            .then((res) => setFeaturedCooks(res.data.data.slice(0, 4)))
            .catch(() => notify.error('Failed to load cooks'));
    }, []);
    const menu = [
        {
            id: 1,
            title: "Spicy Noodles",
            chef: "Chef Wei",
            time: "15-20 min",
            price: "150",
            image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=60"
        },
        {
            id: 2,
            title: "Classic Strawberry Pastry",
            chef: "Chef Pierre",
            time: "45-50 min",
            price: "70",
            image: "https://images.unsplash.com/photo-1602663491496-73f07481dbea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U3RyYXdiZXJyeSUyMFBhc3RyeXxlbnwwfHwwfHx8MA%3D%3D"
        },
        {
            id: 3,
            title: "Hyderabadi Biryani",
            chef: "Chef Rahul",
            time: "40-45 min",
            price: "120",
            image: "https://media.istockphoto.com/id/1410130688/photo/mutton-biryani-served-in-a-golden-dish-isolated-on-dark-background-side-view-indian-food.webp?a=1&b=1&s=612x612&w=0&k=20&c=dgx9Uk9HkGNK3aNMp4OJgKHyV67Jmt0Eg2lJ7t8dOJg="
        },
        {
            id: 4,
            title: "Crispy Samosa",
            chef: "Chef Rajan",
            time: "20-25 min",
            price: "25",
            image: "https://images.unsplash.com/photo-1732519970445-8f2d6998961f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U2Ftb3NhfGVufDB8fDB8fHww"
        }
    ];
    const sectionRefs = useRef([]);

    const addToRefs = (el) => {
        if (el && !sectionRefs.current.includes(el)) {
            sectionRefs.current.push(el);
        }
    };
    const [search, setSearch] = useState('');
    const filtered = featuredCooks.filter((c) => {
        const q = search.toLowerCase();
        return (
            c.name.toLowerCase().includes(q) ||
            (c.bio && c.bio.toLowerCase().includes(q)) ||
            (c.serviceArea && c.serviceArea.toLowerCase().includes(q))
        );
    });
    useScrollReveal();
    return (
        <>
            <section className="relative flex h-screen items-center justify-center overflow-hidden">
                {/* Background Image */}
                <img
                    src="https://images.pexels.com/photos/17527769/pexels-photo-17527769.jpeg"
                    alt="HomeFeast Hero"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Content */}
                <div className="relative z-10 container-custom text-center reveal delay-1 ">
                    <h1 className="mb-6 font-heading text-5xl font-bold text-white md:text-7xl">
                        Homemade goodness,
                        <br />
                        delivered to your door.
                    </h1>

                    <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90">
                        Connect with local home cooks and enjoy authentic,
                        nutritious meals made with love and fresh ingredients.
                    </p>

                    <Link to="/menu">
                        <button className="bg-[var(--color-primary-dark)] hover:bg-primary rounded-md px-8 py-4 font-semibold text-white transition cursor-pointer">
                            Explore Meals
                        </button>
                    </Link>
                </div>
            </section>
            {/* Featured Cook */}
            <section className="reveal delay-1 container-custom py-20">
                <div className="mb-12 flex items-end justify-between">
                    <div>
                        <h2 className="heading-lg mb-2">
                            Featured Local Cooks
                        </h2>

                        <p className="body-md text-text-muted">
                            Talented artisans bringing their kitchen to yours.
                        </p>
                    </div>
                    <Link to="/cooks">
                        <button className="flex items-center gap-2 font-semibold text-primary transition-all hover:gap-3 cursor-pointer">
                            View all cooks
                            <ArrowRight size={18} />
                        </button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {filtered.map((cook) => (
                        <CookCard key={cook._id} cook={cook} />
                    ))}
                </div>
            </section>
            {/* Featured Menu */}
            <section className="reveal delay-1 bg-white py-20">
                <div className="container-custom">
                    <div className="mb-12">
                        <h2 className="heading-lg mb-2">
                            Popular This Week
                        </h2>
                        <p className="body-md text-text-muted">
                            The most ordered dishes from our community of cooks.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-6 lg:grid-cols-12 lg:items-stretch">
                        <FeaturedMenuCard
                            image="https://t3.ftcdn.net/jpg/20/38/49/70/240_F_2038497012_S2WqufyVQpmaHXjoFxm2066LXMBhKand.jpg"
                            title="Amritsari Chole Bhature"
                            chef="Chef HusanPreet"
                            price="250"
                        />
                        {menu.map((menuItem) => (
                            <div
                                key={menuItem.id}
                                className="md:col-span-3 lg:col-span-4 lg:h-full"
                            >
                                <MenuCard {...menuItem} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section
                ref={addToRefs}
                className="reveal delay-1 py-20 px-8 max-w-[1280px] mx-auto text-center"
            >
                <h2 className="heading-lg text-[var(--color-text)] mb-4">How It Works</h2>
                <p className="body-md text-[var(--color-text-muted)] mb-16 max-w-xl mx-auto">
                    Get your favorite home-cooked meals in three simple steps.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-[2px] bg-[var(--color-border)] z-0" />

                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-[#ff6b35] text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-md rotate-3 transition-transform duration-300 hover:rotate-12">
                            <UtensilsCrossed size={36} className="transition-transform duration-300 hover:rotate-12" />
                        </div>
                        <h3 className="heading-md mb-3">Choose</h3>
                        <p className="body-md text-[var(--color-text-muted)] px-8">
                            Browse hundreds of local cooks and their unique signature menus.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-[var(--color-surface-container)] text-[var(--color-primary)] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-md -rotate-3 transition-transform duration-300 hover:rotate-12">
                            <ShoppingBasket size={36} className='transition-transform duration-300 hover:rotate-12' />
                        </div>
                        <h3 className="heading-md mb-3">Order</h3>
                        <p className="body-md text-[var(--color-text-muted)] px-8">
                            Select your favorite meals and checkout with our secure payment system.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-[var(--color-primary-dark)] text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-md rotate-2 transition-transform duration-300 hover:rotate-12">
                            <Bike size={36} className='transition-transform duration-300 hover:rotate-12' />
                        </div>
                        <h3 className="heading-md mb-3">Enjoy</h3>
                        <p className="body-md text-[var(--color-text-muted)] px-8">
                            Relax while your fresh, homemade meal is delivered straight to your door.
                        </p>
                    </div>
                </div>
            </section>

            <section
                ref={addToRefs}
                className="reveal delay-1 py-20 bg-[var(--color-primary-dark)] text-white rounded-t-[40px]"
            >
                <div className="px-8 max-w-[1280px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        <div>
                            <h2
                                className="font-heading text-[40px] md:text-5xl font-bold mb-8 leading-tight"
                                style={{ fontFamily: 'var(--font-heading)' }}
                            >
                                Why HomeFeast is the better way to eat.
                            </h2>

                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <div className="shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                        <HeartPulse size={22} className="text-white" />
                                    </div>
                                    <div>
                                        <h3
                                            className="text-[24px] font-semibold leading-8 text-white mb-2"
                                            style={{ fontFamily: 'var(--font-heading)' }}
                                        >
                                            Healthy &amp; Nutritious
                                        </h3>
                                        <p className="text-white/80 body-md">
                                            Every meal is prepared with fresh, high-quality ingredients just like you would use at home.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                        <MapPin size={22} className="text-white" />
                                    </div>
                                    <div>
                                        <h3
                                            className="text-[24px] font-semibold leading-8 text-white mb-2"
                                            style={{ fontFamily: 'var(--font-heading)' }}
                                        >
                                            Support Local Cooks
                                        </h3>
                                        <p className="text-white/80 body-md">
                                            Empower the culinary artists in your neighborhood and help your local community thrive.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                        <PiggyBank size={22} className="text-white" />
                                    </div>
                                    <div>
                                        <h3
                                            className="text-[24px] font-semibold leading-8 text-white mb-2"
                                            style={{ fontFamily: 'var(--font-heading)' }}
                                        >
                                            Surprisingly Affordable
                                        </h3>
                                        <p className="text-white/80 body-md">
                                            Get restaurant-quality food without the heavy markups. Authentic meals at fair prices.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl rotate-3 transition-all duration-500 group-hover:rotate-1 group-hover:shadow-3xl">
                                <img
                                    src="https://images.unsplash.com/photo-1599297914860-1ccd36987a52?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNob3BwZWQlMjB2ZWdldGFibGVzfGVufDB8fDB8fHww"
                                    alt="Fresh ingredients being chopped"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl hidden md:block max-w-[240px]
                  transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-105">

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-[#ffdbd0] flex items-center justify-center
                      transition-colors duration-300 group-hover:bg-[#ffc2ad]">
                                        <BadgeCheck
                                            size={20}
                                            className="text-[var(--color-primary-dark)] transition-transform duration-500 group-hover:rotate-12"
                                        />
                                    </div>

                                    <div
                                        className="text-[var(--color-text)] font-semibold text-sm leading-tight"
                                        style={{ fontFamily: "var(--font-heading)" }}
                                    >
                                        Quality Guaranteed
                                    </div>
                                </div>

                                <p className="text-[var(--color-text-muted)] text-xs leading-relaxed">
                                    All our cooks pass rigorous safety and quality certifications before joining.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home

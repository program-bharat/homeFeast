import { Globe, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="border-outline-variant bg-surface-container-low border-t">
            <div className="container-custom flex flex-col items-center justify-between gap-8 py-20 md:flex-row">
                {/* Left */}
                <div className="flex flex-col items-center gap-4 md:items-start">
                    <h2 className="font-heading text-2xl font-bold text-[var(--color-primary-dark)] hover:text-primary">
                        <Link to="/">HomeFeast</Link>
                    </h2>

                    <p className="max-w-xs text-center text-sm text-on-surface-variant md:text-left">
                        The community-driven marketplace for authentic,
                        homemade meals delivered right to your door.
                    </p>

                    <p className="mt-4 text-sm text-on-surface-variant">
                        © 2026 HomeFeast. All rights reserved.
                    </p>
                </div>

                {/* Right */}
                <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
                    <div className="flex flex-col gap-3">
                        <span className="mb-2 text-sm font-bold uppercase tracking-wider text-on-surface">
                            Company
                        </span>

                        <Link to="/about" className="text-sm text-on-surface-variant transition-colors hover:text-primary">
                            About Us
                        </Link>

                        <Link to="career" className="text-sm text-on-surface-variant transition-colors hover:text-primary">
                            Careers
                        </Link>

                        <Link to="contact" className="text-sm text-on-surface-variant transition-colors hover:text-primary">
                            Contact
                        </Link>
                    </div>

                    <div className="flex flex-col gap-3">
                        <span className="mb-2 text-sm font-bold uppercase tracking-wider text-on-surface">
                            Legal
                        </span>

                        <Link to="#" className="text-sm text-on-surface-variant transition-colors hover:text-primary">
                            Terms of Service
                        </Link>

                        <Link to="#" className="text-sm text-on-surface-variant transition-colors hover:text-primary">
                            Privacy Policy
                        </Link>

                        <Link to="#" className="text-sm text-on-surface-variant transition-colors hover:text-primary">
                            Cookie Policy
                        </Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <span className="mb-2 text-sm font-bold uppercase tracking-wider text-on-surface">
                            Follow Us
                        </span>

                        <div className="flex gap-4">
                            <Link
                                to="#"
                                className="bg-surface-container hover:bg-primary hover:text-white flex h-10 w-10 items-center justify-center rounded-full transition-all"
                            >
                                <Globe size={20} />
                            </Link>

                            <Link
                                to="#"
                                className="bg-surface-container hover:bg-primary hover:text-white flex h-10 w-10 items-center justify-center rounded-full transition-all"
                            >
                                <Share2 size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
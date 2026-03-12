"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { OptimizedImage } from "@/components/OptimizedImage";
import { supabase } from "@/lib/supabaseClient";

const NAV_LINKS = [
    { name: "Home", href: "/" },
    { name: "Recommendations", href: "/chat", requiresAuth: true },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        let mounted = true;

        supabase.auth.getSession().then(({ data }) => {
            if (!mounted) return;
            setIsAuthenticated(!!data.session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!mounted) return;
            setIsAuthenticated(!!session);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const visibleLinks = NAV_LINKS.filter((link) => !link.requiresAuth || isAuthenticated);

    return (
        <>
            <motion.nav
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`sticky top-0 z-50 transition-all duration-500 ease-out backdrop-blur-md ${isScrolled
                    ? "py-2 shadow-[0_4px_30px_rgba(92,64,51,0.4)]"
                    : "py-3"
                    }`}
                style={{
                    background: isScrolled
                        ? "linear-gradient(135deg, rgba(102,10,10,0.97) 0%, rgba(64,0,0,0.97) 50%, rgba(26,0,0,0.97) 100%)"
                        : "linear-gradient(135deg, #7A0A0A 0%, #4A0000 40%, #1A0000 100%)",
                }}
            >
                {/* Top gold accent stripe */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FADD53] to-transparent opacity-70" />

                <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-lg bg-white/[0.1] border border-white/[0.15] flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:bg-white/[0.18] group-hover:border-[#FADD53]/40 group-hover:shadow-[0_0_15px_rgba(250,221,83,0.2)]">
                                <OptimizedImage
                                    src="/stevies-logo.png"
                                    alt="Stevie Awards Logo"
                                    width={26}
                                    height={26}
                                    className="object-contain transform group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div className="hidden sm:flex flex-col">
                                <span className="text-white font-bold text-[15px] tracking-wide leading-tight transition-colors duration-300 group-hover:text-[#FADD53]">
                                    Stevie Award Finder
                                </span>
                                <span className="text-[10px] uppercase tracking-[0.18em] text-orange-200/50 font-medium">
                                    AI Recommendation System
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {visibleLinks.map((link) => {
                                const isActive =
                                    pathname === link.href ||
                                    (link.href !== "/" && pathname.startsWith(link.href));
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`relative px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 group ${isActive
                                            ? "text-[#FADD53]"
                                            : "text-white/85 hover:text-white"
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="navbar-active-pill"
                                                className="absolute inset-0 rounded-lg bg-white/[0.08] border border-[#FADD53]/25"
                                                transition={{
                                                    type: "spring",
                                                    bounce: 0.2,
                                                    duration: 0.5,
                                                }}
                                            />
                                        )}
                                        {!isActive && (
                                            <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/[0.07] transition-colors duration-300" />
                                        )}
                                        <span className="relative z-10">{link.name}</span>
                                        <span
                                            className={`absolute left-3 right-3 bottom-0.5 h-[2px] rounded-full transition-all duration-300 ease-out ${isActive
                                                ? "bg-[#FADD53] w-[calc(100%-24px)]"
                                                : "bg-[#FADD53] w-0 group-hover:w-[calc(100%-24px)]"
                                                }`}
                                        />
                                    </Link>
                                );
                            })}

                            {/* Divider */}
                            {pathname !== "/onboarding" && <div className="w-px h-5 bg-white/15 mx-3" />}

                            {/* CTA */}
                            {pathname !== "/onboarding" && (
                                <Link
                                    href="/auth"
                                    className="relative ml-1 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-[0.1em] overflow-hidden transition-all duration-300 group"
                                >
                                    <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FADD53] to-[#F4C542] opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                                    <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FFE87C] to-[#FADD53] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_25px_rgba(250,221,83,0.5)]" />
                                    <span className="relative z-10 text-[#3E2723] group-hover:text-[#2D1A11] font-extrabold">
                                        Get Started
                                    </span>
                                </Link>
                            )}
                        </div>

                        {/* Mobile hamburger */}
                        <div className="md:hidden">
                            <button
                                type="button"
                                className="w-10 h-10 rounded-lg bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-white hover:text-[#FADD53] hover:border-[#FADD53]/30 transition-all duration-300 focus:outline-none"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                <div className="w-5 h-4 flex flex-col justify-between items-center">
                                    <span
                                        className={`w-5 h-[1.5px] bg-current rounded-full transform transition-all duration-300 origin-center ${isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
                                            }`}
                                    />
                                    <span
                                        className={`w-3.5 h-[1.5px] bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? "opacity-0 w-0" : "opacity-100"
                                            }`}
                                    />
                                    <span
                                        className={`w-5 h-[1.5px] bg-current rounded-full transform transition-all duration-300 origin-center ${isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                                            }`}
                                    />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom border */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 260 }}
                            className="fixed top-0 right-0 bottom-0 z-50 w-72 md:hidden flex flex-col overflow-hidden"
                            style={{
                                background:
                                    "linear-gradient(180deg, #4A0000 0%, #7A0A0A 40%, #1A0000 100%)",
                            }}
                        >
                            {/* Close */}
                            <div className="flex justify-end p-4">
                                <button
                                    type="button"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-10 h-10 rounded-lg bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-white/70 hover:text-[#FADD53] transition-all duration-300"
                                    aria-label="Close menu"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Links */}
                            <div className="flex-1 flex flex-col px-5 pt-4">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-orange-200/40 font-semibold mb-4 px-3">
                                    Navigation
                                </p>
                                <div className="space-y-1">
                                    {visibleLinks.map((link, idx) => {
                                        const isActive =
                                            pathname === link.href ||
                                            (link.href !== "/" && pathname.startsWith(link.href));
                                        return (
                                            <motion.div
                                                key={link.name}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 + idx * 0.06, duration: 0.35 }}
                                            >
                                                <Link
                                                    href={link.href}
                                                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-[15px] font-medium transition-all duration-300 ${isActive
                                                        ? "text-[#FADD53] bg-white/[0.08] border border-[#FADD53]/20"
                                                        : "text-white/75 hover:text-white hover:bg-white/[0.05] border border-transparent"
                                                        }`}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    {link.name}
                                                    {isActive && (
                                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FADD53]" />
                                                    )}
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Bottom CTA */}
                            {pathname !== "/onboarding" && (
                                <div className="p-5 border-t border-white/[0.1]">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.3 }}
                                    >
                                        <Link
                                            href="/auth"
                                            className="flex items-center justify-center w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-[#FADD53] to-[#F4C542] text-[#3E2723] hover:shadow-[0_0_25px_rgba(250,221,83,0.4)] transition-all duration-300"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Get Started
                                        </Link>
                                    </motion.div>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

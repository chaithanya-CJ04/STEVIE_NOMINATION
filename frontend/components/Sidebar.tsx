"use client";

import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { OptimizedImage } from "@/components/OptimizedImage";
import {
    FiMessageSquare,
    FiUploadCloud,
    FiPieChart,
    FiFileText,
    FiTrendingUp,
    FiCheckCircle,
    FiLogOut
} from "react-icons/fi";

const SIDEBAR_ITEMS = [
    { name: "AI Chat", path: "/chat", icon: FiMessageSquare },
    { name: "Upload Doc", path: "/documents", icon: FiUploadCloud },
    { name: "Gap Analysis", path: "/gap-analysis", icon: FiPieChart },
    { name: "Summary", path: "/summary", icon: FiFileText },
    { name: "Forecast", path: "/forecast", icon: FiTrendingUp },
    { name: "Category Confirmation", path: "/confirmation", icon: FiCheckCircle },
];

export function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace("/auth");
    };

    return (
        <aside className="w-[68px] lg:w-[260px] flex-shrink-0 bg-[#090909] border-r border-white/[0.05] flex flex-col transition-all duration-300 relative">
            {/* Ambient top glow */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#FADD53]/[0.03] to-transparent" />

            {/* Brand Header */}
            <div className="sidebar-brand-strip flex items-center gap-3 px-4 py-4 lg:py-5">
                <div className="w-9 h-9 rounded-xl bg-white/[0.07] border border-white/[0.10] flex items-center justify-center shrink-0 shadow-inner">
                    <OptimizedImage
                        src="/stevies-logo.png"
                        alt="Stevie Awards"
                        width={22}
                        height={22}
                        className="object-contain"
                    />
                </div>
                <div className="hidden lg:flex flex-col leading-tight">
                    <span className="text-[13px] font-bold text-white/90 tracking-wide">Stevie Finder</span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#FADD53]/40 font-semibold">AI Platform</span>
                </div>
            </div>

            {/* Nav */}
            <div className="flex-1 overflow-y-auto py-4 px-2.5 lg:px-3">
                {/* Section label */}
                <p className="hidden lg:block text-[9px] font-bold uppercase tracking-[0.2em] text-white/20 px-3 mb-3">Navigation</p>
                <nav className="space-y-1">
                    {SIDEBAR_ITEMS.map((item) => {
                        const isActive = pathname.startsWith(item.path);
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.name}
                                onClick={() => router.push(item.path)}
                                title={item.name}
                                className={`relative w-full flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? "sidebar-active-item"
                                        : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200"
                                    }`}
                            >
                                <Icon className={`w-[18px] h-[18px] shrink-0 transition-transform duration-200 ${!isActive && "group-hover:scale-110"
                                    } ${isActive ? "text-black" : ""}`} />
                                <span className={`hidden lg:block text-[14px] font-medium whitespace-nowrap tracking-wide ${isActive ? "text-black font-semibold" : ""}`}>
                                    {item.name}
                                </span>

                                {/* Active dot indicator on collapsed sidebar */}
                                {isActive && (
                                    <span className="lg:hidden absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#0a0a0a]" />
                                )}

                                {/* Tooltip for collapsed state */}
                                <div className="lg:hidden absolute left-[72px] z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 translate-x-[-4px] group-hover:translate-x-0">
                                    <div className="bg-zinc-800 border border-white/[0.08] text-zinc-100 text-xs font-medium px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
                                        {item.name}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Logout */}
            <div className="p-3 lg:p-4 border-t border-white/[0.05]">
                <button
                    onClick={handleLogout}
                    title="Logout"
                    className="w-full flex items-center gap-3.5 px-3 py-3 text-zinc-600 hover:text-red-400 hover:bg-red-500/[0.07] rounded-xl transition-all duration-200 group"
                >
                    <FiLogOut className="w-[18px] h-[18px] shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
                    <span className="hidden lg:block text-[14px] font-medium tracking-wide">Logout</span>

                    {/* Tooltip */}
                    <div className="lg:hidden absolute left-[72px] z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150">
                        <div className="bg-zinc-800 border border-white/[0.08] text-zinc-100 text-xs font-medium px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
                            Logout
                        </div>
                    </div>
                </button>
            </div>
        </aside>
    );
}

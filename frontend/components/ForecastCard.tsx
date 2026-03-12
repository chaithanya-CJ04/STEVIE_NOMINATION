"use client";

import { motion } from "framer-motion";
import React from "react";

interface ForecastCardProps {
    label: string;
    value: string | number;
    subtext?: string;
    icon: React.ReactNode;
    accent?: "gold" | "sky" | "violet" | "emerald" | "red";
    trend?: "up" | "down" | "neutral";
    delay?: number;
}

const ACCENT_STYLES: Record<string, { border: string; glow: string; badge: string; iconBg: string }> = {
    gold: { border: "hover:border-amber-400/50", glow: "hover:shadow-[0_0_30px_rgba(251,191,36,0.1)]", badge: "bg-amber-400/10 text-amber-300 border-amber-400/25", iconBg: "bg-amber-400/10 border-amber-400/20 text-amber-400" },
    sky: { border: "hover:border-sky-400/50", glow: "hover:shadow-[0_0_30px_rgba(56,189,248,0.1)]", badge: "bg-sky-400/10 text-sky-300 border-sky-400/25", iconBg: "bg-sky-400/10 border-sky-400/20 text-sky-400" },
    violet: { border: "hover:border-violet-400/50", glow: "hover:shadow-[0_0_30px_rgba(167,139,250,0.1)]", badge: "bg-violet-400/10 text-violet-300 border-violet-400/25", iconBg: "bg-violet-400/10 border-violet-400/20 text-violet-400" },
    emerald: { border: "hover:border-emerald-400/50", glow: "hover:shadow-[0_0_30px_rgba(52,211,153,0.1)]", badge: "bg-emerald-400/10 text-emerald-300 border-emerald-400/25", iconBg: "bg-emerald-400/10 border-emerald-400/20 text-emerald-400" },
    red: { border: "hover:border-red-400/50", glow: "hover:shadow-[0_0_30px_rgba(248,113,113,0.1)]", badge: "bg-red-400/10 text-red-300 border-red-400/25", iconBg: "bg-red-400/10 border-red-400/20 text-red-400" },
};

const TREND_ICONS: Record<string, { icon: string; color: string }> = {
    up: { icon: "↑", color: "text-emerald-400" },
    down: { icon: "↓", color: "text-red-400" },
    neutral: { icon: "→", color: "text-zinc-500" },
};

export function ForecastCard({
    label,
    value,
    subtext,
    icon,
    accent = "gold",
    trend = "neutral",
    delay = 0,
}: ForecastCardProps) {
    const styles = ACCENT_STYLES[accent];
    const trendInfo = TREND_ICONS[trend];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
            className={`relative bg-[#111] border border-zinc-800/80 rounded-2xl p-5 transition-all duration-300 ${styles.border} ${styles.glow} group overflow-hidden`}
        >
            {/* Top shimmer line on hover */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex items-start justify-between mb-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${styles.iconBg} transition-all duration-300`}>
                    {icon}
                </div>
                {/* Trend badge */}
                <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${styles.badge}`}>
                    <span className={trendInfo.color}>{trendInfo.icon}</span>
                    {trend === "up" ? "Good" : trend === "down" ? "Needs Work" : "Stable"}
                </span>
            </div>

            {/* Value */}
            <p className="text-[32px] font-black text-zinc-50 leading-none tracking-tight mb-1">
                {value}
            </p>

            {/* Label */}
            <p className="text-[12px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">
                {label}
            </p>

            {subtext && (
                <p className="text-[11px] text-zinc-600 leading-relaxed">{subtext}</p>
            )}
        </motion.div>
    );
}

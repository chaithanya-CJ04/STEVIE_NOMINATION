"use client";

import { motion } from "framer-motion";

interface MatchScoreBarProps {
    score: number; // 0-100
    showLabel?: boolean;
    size?: "sm" | "md" | "lg";
    delay?: number;
}

function getScoreColor(score: number) {
    if (score >= 85) return "from-emerald-400 to-emerald-600";
    if (score >= 70) return "from-amber-400 to-amber-600";
    if (score >= 55) return "from-sky-400 to-sky-600";
    return "from-red-400 to-red-600";
}

function getScoreLabel(score: number) {
    if (score >= 85) return { text: "Excellent", color: "text-emerald-400" };
    if (score >= 70) return { text: "Good", color: "text-amber-400" };
    if (score >= 55) return { text: "Fair", color: "text-sky-400" };
    return { text: "Low", color: "text-red-400" };
}

export function MatchScoreBar({ score, showLabel = true, size = "md", delay = 0 }: MatchScoreBarProps) {
    const colorClass = getScoreColor(score);
    const scLabel = getScoreLabel(score);

    const heights: Record<string, string> = {
        sm: "h-1.5",
        md: "h-2.5",
        lg: "h-3.5",
    };

    return (
        <div className="w-full">
            {showLabel && (
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Match Score</span>
                    <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold ${scLabel.color}`}>{scLabel.text}</span>
                        <span className="text-[13px] font-black text-zinc-100 font-mono">{score}%</span>
                    </div>
                </div>
            )}
            <div className={`w-full rounded-full bg-zinc-800 overflow-hidden ${heights[size]}`}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1.1, ease: "easeOut", delay }}
                    className={`h-full rounded-full bg-gradient-to-r ${colorClass} relative`}
                >
                    {/* Shimmer overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
                </motion.div>
            </div>
        </div>
    );
}

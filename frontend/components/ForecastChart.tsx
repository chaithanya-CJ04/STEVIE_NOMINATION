"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface ScoreBar {
    label: string;
    score: number; // 0-100
    color: string; // tailwind gradient class
}

interface ForecastChartProps {
    winProbability: number;
    breakdown: ScoreBar[];
}

export function ForecastChart({ winProbability, breakdown }: ForecastChartProps) {
    const [animated, setAnimated] = useState(false);
    const cxRef = useRef<SVGCircleElement>(null);

    // Donut chart config
    const radius = 72;
    const stroke = 12;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const offset = circumference - (winProbability / 100) * circumference;

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-[#111] border border-zinc-800/80 rounded-2xl p-6 space-y-6">
            <h3 className="text-[13px] font-bold uppercase tracking-widest text-zinc-400">
                Probability Breakdown
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-8">
                {/* Donut chart */}
                <div className="relative shrink-0 w-44 h-44 flex items-center justify-center">
                    <svg width="176" height="176" className="-rotate-90">
                        {/* Background track */}
                        <circle
                            cx="88"
                            cy="88"
                            r={normalizedRadius}
                            fill="none"
                            stroke="#27272a"
                            strokeWidth={stroke}
                        />
                        {/* Animated progress arc */}
                        <motion.circle
                            ref={cxRef}
                            cx="88"
                            cy="88"
                            r={normalizedRadius}
                            fill="none"
                            stroke="url(#gold-arc)"
                            strokeWidth={stroke}
                            strokeLinecap="round"
                            strokeDasharray={`${circumference} ${circumference}`}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: animated ? offset : circumference }}
                            transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
                        />
                        <defs>
                            <linearGradient id="gold-arc" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#f59e0b" />
                                <stop offset="100%" stopColor="#d97706" />
                            </linearGradient>
                        </defs>
                    </svg>
                    {/* Centre label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.p
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-[36px] font-black text-zinc-50 leading-none"
                        >
                            {winProbability}
                            <span className="text-[18px] text-amber-400">%</span>
                        </motion.p>
                        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mt-1">
                            Win Chance
                        </p>
                    </div>
                </div>

                {/* Breakdown bars */}
                <div className="flex-1 w-full space-y-3.5">
                    {breakdown.map(({ label, score, color }, i) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[12px] font-medium text-zinc-300">{label}</span>
                                <span className="text-[12px] font-bold text-zinc-100 font-mono">{score}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: animated ? `${score}%` : 0 }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.4 + i * 0.1 }}
                                    className={`h-full rounded-full ${color}`}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

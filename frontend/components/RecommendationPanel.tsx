"use client";

import { motion } from "framer-motion";
import { FiZap } from "react-icons/fi";

interface Recommendation {
    title: string;
    detail: string;
    priority: "high" | "medium" | "low";
}

interface RecommendationPanelProps {
    recommendations: Recommendation[];
}

const PRIORITY_STYLES: Record<string, { dot: string; badge: string; label: string }> = {
    high: { dot: "bg-red-400", badge: "bg-red-400/10 text-red-400 border-red-400/25", label: "High Impact" },
    medium: { dot: "bg-amber-400", badge: "bg-amber-400/10 text-amber-400 border-amber-400/25", label: "Medium" },
    low: { dot: "bg-emerald-400", badge: "bg-emerald-400/10 text-emerald-400 border-emerald-400/25", label: "Low" },
};

export function RecommendationPanel({ recommendations }: RecommendationPanelProps) {
    return (
        <div className="bg-[#111] border border-zinc-800/80 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                    <FiZap className="w-4.5 h-4.5 text-amber-400" />
                </div>
                <div>
                    <h3 className="text-[14px] font-bold text-zinc-100">AI Recommendations</h3>
                    <p className="text-[11px] text-zinc-500">
                        Actions to improve your submission score
                    </p>
                </div>
            </div>

            {/* Recommendation list */}
            <ol className="space-y-4">
                {recommendations.map((rec, i) => {
                    const styles = PRIORITY_STYLES[rec.priority];
                    return (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.08, ease: "easeOut" }}
                            className="flex gap-4 group p-4 rounded-xl border border-zinc-800/60 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-900/30 transition-all duration-200 cursor-default"
                        >
                            {/* Step number */}
                            <div className="shrink-0 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[12px] font-black text-zinc-400 group-hover:border-amber-400/40 group-hover:text-amber-400 transition-colors">
                                {i + 1}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <p className="text-[13px] font-semibold text-zinc-100 leading-tight">{rec.title}</p>
                                    <span className={`shrink-0 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${styles.badge}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                                        {styles.label}
                                    </span>
                                </div>
                                <p className="text-[12px] text-zinc-400 mt-1 leading-relaxed">{rec.detail}</p>
                            </div>
                        </motion.li>
                    );
                })}
            </ol>
        </div>
    );
}

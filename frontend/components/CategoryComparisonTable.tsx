"use client";

import { motion } from "framer-motion";
import { MatchScoreBar } from "@/components/MatchScoreBar";
import { Category } from "@/components/CategoryCard";
import { FiCheckCircle } from "react-icons/fi";

interface CategoryComparisonTableProps {
    categories: Category[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

const COMPETITION_STYLES: Record<string, string> = {
    Low: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25",
    Medium: "text-amber-400   bg-amber-400/10   border-amber-400/25",
    High: "text-red-400     bg-red-400/10     border-red-400/25",
};

export function CategoryComparisonTable({ categories, selectedId, onSelect }: CategoryComparisonTableProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-[#111] border border-zinc-800/80 rounded-2xl overflow-hidden"
        >
            {/* Table header */}
            <div className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 px-5 py-3.5 bg-zinc-950/60 border-b border-zinc-800/60">
                {["Category", "Match Score", "Competition", "Best Fit"].map((col) => (
                    <span key={col} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        {col}
                    </span>
                ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-zinc-800/40">
                {categories.map((cat, i) => {
                    const isSelected = selectedId === cat.id;
                    return (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 + i * 0.07 }}
                            onClick={() => onSelect(cat.id)}
                            className={`grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 items-center px-5 py-4 cursor-pointer transition-all duration-200
                ${isSelected
                                    ? "bg-amber-400/5 border-l-2 border-l-amber-400"
                                    : "hover:bg-zinc-900/40 border-l-2 border-l-transparent"
                                }`}
                        >
                            {/* Category name */}
                            <div>
                                <p className={`text-[13px] font-semibold leading-snug transition-colors ${isSelected ? "text-amber-300" : "text-zinc-100"}`}>
                                    {cat.name}
                                </p>
                                <p className="text-[11px] text-zinc-500 mt-0.5 uppercase tracking-wide">{cat.program}</p>
                            </div>

                            {/* Match score bar */}
                            <div className="pr-4">
                                <MatchScoreBar score={cat.score} showLabel={false} size="sm" delay={0.4 + i * 0.07} />
                                <p className="text-[11px] font-bold text-zinc-300 font-mono mt-1.5">{cat.score}%</p>
                            </div>

                            {/* Competition level */}
                            <div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${COMPETITION_STYLES[cat.competitionLevel]}`}>
                                    {cat.competitionLevel}
                                </span>
                            </div>

                            {/* Best fit check */}
                            <div className="flex justify-start">
                                {i === 0 ? (
                                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                                        <FiCheckCircle className="w-4 h-4" />
                                        Best Fit
                                    </span>
                                ) : (
                                    <span className="text-[11px] text-zinc-600 font-medium">—</span>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MatchScoreBar } from "@/components/MatchScoreBar";
import {
    FiCheckCircle,
    FiZap,
    FiBarChart2,
    FiAward,
    FiChevronDown,
    FiChevronUp,
} from "react-icons/fi";

export interface Category {
    id: string;
    name: string;
    program: string;
    score: number;
    competitionLevel: "Low" | "Medium" | "High";
    reason: string;
    tags: string[];
}

interface CategoryCardProps {
    category: Category;
    rank: number;
    isSelected: boolean;
    onSelect: (id: string) => void;
    delay?: number;
}

const COMPETITION_STYLES: Record<string, string> = {
    Low: "bg-emerald-400/10 text-emerald-400 border-emerald-400/25",
    Medium: "bg-amber-400/10   text-amber-400   border-amber-400/25",
    High: "bg-red-400/10     text-red-400     border-red-400/25",
};

const RANK_BADGES: Record<number, { bg: string; label: string }> = {
    1: { bg: "from-amber-400 to-yellow-500", label: "#1 Best Match" },
    2: { bg: "from-zinc-300 to-zinc-400", label: "#2 Strong Match" },
    3: { bg: "from-amber-700 to-amber-900", label: "#3 Good Match" },
};

export function CategoryCard({ category, rank, isSelected, onSelect, delay = 0 }: CategoryCardProps) {
    const [expanded, setExpanded] = useState(false);
    const badge = RANK_BADGES[rank] || { bg: "from-zinc-700 to-zinc-800", label: `#${rank} Match` };

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay, ease: "easeOut" }}
            className={`relative rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer group
        ${isSelected
                    ? "border-amber-400/70 bg-amber-400/5 shadow-[0_0_30px_rgba(251,191,36,0.12)]"
                    : "border-zinc-800/80 bg-[#111] hover:border-zinc-700 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
                }`}
            onClick={() => onSelect(category.id)}
        >
            {/* Selected indicator bar */}
            {isSelected && (
                <motion.div
                    layoutId="selected-bar"
                    className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                />
            )}

            <div className="p-5">
                {/* Card header */}
                <div className="flex items-start gap-3 mb-4">
                    {/* Rank badge */}
                    <div className={`shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br ${badge.bg} flex items-center justify-center text-[11px] font-black text-black shadow-md`}>
                        {rank <= 3 ? <FiAward className="w-4 h-4" /> : `#${rank}`}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                                <p className="text-[14px] font-bold text-zinc-50 leading-snug group-hover:text-amber-200 transition-colors">
                                    {category.name}
                                </p>
                                <p className="text-[11px] text-zinc-500 mt-0.5 uppercase tracking-wide font-medium">
                                    {category.program}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                {/* Competition badge */}
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${COMPETITION_STYLES[category.competitionLevel]}`}>
                                    {category.competitionLevel} Competition
                                </span>
                                {/* Rank label */}
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r ${badge.bg} text-black`}>
                                    {badge.label}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Score bar */}
                <MatchScoreBar score={category.score} delay={delay + 0.2} />

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                    {category.tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-medium">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Expandable reason */}
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
                    className="mt-4 w-full flex items-center justify-between text-[12px] font-semibold text-zinc-500 hover:text-amber-400 transition-colors pt-3 border-t border-zinc-800/60"
                >
                    <span>Why this category?</span>
                    {expanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                </button>

                <motion.div
                    initial={false}
                    animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    <p className="text-[12px] text-zinc-400 leading-relaxed pt-3">{category.reason}</p>
                </motion.div>
            </div>

            {/* Action footer */}
            <div className="flex items-center gap-2 px-5 pb-4">
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onSelect(category.id); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition-all duration-200
            ${isSelected
                            ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                            : "bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-amber-400/10 hover:text-amber-400 hover:border-amber-400/30"
                        }`}
                >
                    <FiCheckCircle className="w-3.5 h-3.5" />
                    {isSelected ? "Selected" : "Select Category"}
                </button>
                <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold text-zinc-400 border border-zinc-800 bg-zinc-900 hover:text-sky-400 hover:border-sky-400/30 hover:bg-sky-400/5 transition-all duration-200"
                >
                    <FiZap className="w-3.5 h-3.5" />
                    Generate Entry
                </button>
                <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold text-zinc-400 border border-zinc-800 bg-zinc-900 hover:text-violet-400 hover:border-violet-400/30 hover:bg-violet-400/5 transition-all duration-200"
                >
                    <FiBarChart2 className="w-3.5 h-3.5" />
                    Gap Analysis
                </button>
            </div>
        </motion.article>
    );
}

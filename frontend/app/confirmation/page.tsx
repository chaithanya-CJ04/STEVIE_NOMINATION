"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/Sidebar";
import { CategoryList } from "@/components/CategoryList";
import { CategoryComparisonTable } from "@/components/CategoryComparisonTable";
import type { Category } from "@/components/CategoryCard";
import {
    FiAward,
    FiZap,
    FiBarChart2,
    FiCheckCircle,
    FiRefreshCw,
    FiList,
    FiGrid,
} from "react-icons/fi";

// ── Mock data ─────────────────────────────────────────────
const MOCK_CATEGORIES: Category[] = [
    {
        id: "cat-1",
        name: "Best Innovation in Customer Service",
        program: "Stevie Awards for Sales & Customer Service",
        score: 91,
        competitionLevel: "High",
        reason:
            "Your uploaded documents heavily emphasise AI-driven customer support improvements with clear measurable outcome metrics — matching all scoring criteria for this category.",
        tags: ["AI", "Customer Service", "Innovation", "Technology"],
    },
    {
        id: "cat-2",
        name: "New Product or Service of the Year — AI / ML",
        program: "The International Business Awards",
        score: 84,
        competitionLevel: "Medium",
        reason:
            "The product narrative and technical differentiators described align strongly with what the IBA panel looks for in this category — particularly the novel application of ML pipelines.",
        tags: ["Machine Learning", "Product Launch", "B2B", "SaaS"],
    },
    {
        id: "cat-3",
        name: "Achievement in Leadership — Technology",
        program: "American Business Awards",
        score: 77,
        competitionLevel: "Medium",
        reason:
            "Executive strategy and org-level transformation details in your submission are well-suited to this leadership-focused category with cross-functional accountability.",
        tags: ["Leadership", "Digital Transformation", "Strategy"],
    },
    {
        id: "cat-4",
        name: "Best Use of Technology in Customer Experience",
        program: "Stevie Awards for Great Employers",
        score: 68,
        competitionLevel: "Low",
        reason:
            "Customer experience improvements driven by your new tech platform align with the judging criteria, though more client outcome data would further strengthen the pitch.",
        tags: ["CX", "Technology", "Digital"],
    },
    {
        id: "cat-5",
        name: "Excellence in Innovation — Software",
        program: "The Asia-Pacific Stevie Awards",
        score: 62,
        competitionLevel: "Low",
        reason:
            "The software product described demonstrates solid innovation, but the APAC panel will give preference to companies with a regional footprint — ensure this is communicated.",
        tags: ["Software", "APAC", "Innovation"],
    },
];

type ViewMode = "cards" | "table";

export default function ConfirmationPage() {
    const [selectedId, setSelectedId] = useState<string | null>(MOCK_CATEGORIES[0].id);
    const [view, setView] = useState<ViewMode>("cards");
    const selected = MOCK_CATEGORIES.find((c) => c.id === selectedId);

    return (
        <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden bg-black text-white">
            <Sidebar />

            <main className="flex-1 overflow-y-auto bg-[#0b0b0b] border-t border-l border-zinc-900 rounded-tl-2xl">
                {/* Ambient glow */}
                <div className="pointer-events-none fixed top-28 right-20 w-[480px] h-[480px] rounded-full bg-amber-400/4 blur-[140px]" />

                <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 py-10 space-y-10">

                    {/* ── Page Header ── */}
                    <motion.header
                        initial={{ opacity: 0, y: -14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-wrap items-start justify-between gap-5"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                                    <FiAward className="w-5 h-5 text-amber-400" />
                                </div>
                                <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-zinc-50 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                                    Recommended Award Categories
                                </h1>
                            </div>
                            <p className="text-[13px] text-zinc-500 max-w-xl">
                                AI-matched categories based on your uploaded documents — ranked by fit score. Select a category to generate your award entry.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* View toggle */}
                            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1">
                                <button
                                    onClick={() => setView("cards")}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-200
                    ${view === "cards" ? "bg-zinc-700 text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
                                >
                                    <FiGrid className="w-3.5 h-3.5" /> Cards
                                </button>
                                <button
                                    onClick={() => setView("table")}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-200
                    ${view === "table" ? "bg-zinc-700 text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
                                >
                                    <FiList className="w-3.5 h-3.5" /> Table
                                </button>
                            </div>

                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-[13px] font-semibold text-zinc-300 hover:text-amber-400 hover:border-amber-400/40 hover:bg-zinc-800 transition-all">
                                <FiRefreshCw className="w-4 h-4" />
                                Re-analyze
                            </button>
                        </div>
                    </motion.header>

                    {/* ── Stats Row ── */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                    >
                        {[
                            { label: "Categories Found", value: MOCK_CATEGORIES.length, color: "text-amber-400" },
                            { label: "Best Match Score", value: `${MOCK_CATEGORIES[0].score}%`, color: "text-emerald-400" },
                            { label: "Avg Match Score", value: `${Math.round(MOCK_CATEGORIES.reduce((a, c) => a + c.score, 0) / MOCK_CATEGORIES.length)}%`, color: "text-sky-400" },
                            { label: "Selected", value: selected?.name.split(" ").slice(0, 2).join(" ") + "…" || "None", color: "text-violet-400" },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="bg-[#111] border border-zinc-800/80 rounded-xl px-4 py-3">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{label}</p>
                                <p className={`text-[18px] font-black ${color} leading-tight truncate`}>{value}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* ── Global Action Bar ── */}
                    {selected && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 bg-amber-400/5 border border-amber-400/30 rounded-2xl"
                        >
                            <div className="flex items-center gap-3">
                                <FiCheckCircle className="w-5 h-5 text-amber-400 shrink-0" />
                                <div>
                                    <p className="text-[12px] font-bold text-amber-300">Selected Category</p>
                                    <p className="text-[13px] text-zinc-200 font-semibold">{selected.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-black text-[13px] font-bold hover:shadow-[0_0_20px_rgba(251,191,36,0.35)] hover:brightness-110 transition-all">
                                    <FiZap className="w-4 h-4" />
                                    Generate Award Entry
                                </button>
                                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-[13px] font-bold text-zinc-300 hover:text-sky-400 hover:border-sky-400/40 transition-all">
                                    <FiBarChart2 className="w-4 h-4" />
                                    Run Gap Analysis
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── Main Content ── */}
                    {view === "cards" ? (
                        <section className="space-y-4">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600 px-1">
                                {MOCK_CATEGORIES.length} Categories · sorted by match score
                            </p>
                            <CategoryList
                                categories={MOCK_CATEGORIES}
                                selectedId={selectedId}
                                onSelect={setSelectedId}
                            />
                        </section>
                    ) : (
                        <section className="space-y-4 pb-10">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600 px-1">
                                Category Comparison
                            </p>
                            <CategoryComparisonTable
                                categories={MOCK_CATEGORIES}
                                selectedId={selectedId}
                                onSelect={setSelectedId}
                            />
                        </section>
                    )}

                </div>
            </main>
        </div>
    );
}

"use client";

import { motion } from "framer-motion";
import { Sidebar } from "@/components/Sidebar";
import { ForecastCard } from "@/components/ForecastCard";
import { ForecastChart } from "@/components/ForecastChart";
import { InsightList } from "@/components/InsightList";
import { RecommendationPanel } from "@/components/RecommendationPanel";
import {
    FiTrendingUp,
    FiStar,
    FiTarget,
    FiArrowUp,
    FiRefreshCw,
} from "react-icons/fi";

// ── Static mock data (replace with real API data) ───────────
const FORECAST_DATA = {
    winProbability: 74,
    entryStrength: 7.8,
    competitiveness: "Medium",
    improvementPotential: "High",

    breakdown: [
        { label: "Innovation Narrative", score: 88, color: "bg-gradient-to-r from-amber-400 to-amber-600" },
        { label: "Customer Impact", score: 76, color: "bg-gradient-to-r from-sky-400 to-sky-600" },
        { label: "Measurable Outcomes", score: 52, color: "bg-gradient-to-r from-violet-400 to-violet-600" },
        { label: "Competitive Differentiation", score: 45, color: "bg-gradient-to-r from-red-400 to-rose-600" },
        { label: "Leadership Alignment", score: 81, color: "bg-gradient-to-r from-emerald-400 to-emerald-600" },
    ],

    strengths: [
        "Strong innovation narrative with clear technical depth",
        "Well-articulated customer impact story",
        "Compelling leadership vision and mission alignment",
        "Excellent organizational context and background",
    ],

    weaknesses: [
        "Limited measurable outcomes — missing KPIs and metrics",
        "Weak competitive differentiation vs. peer entries",
        "No customer testimonials or third-party validation",
        "Missing ROI figures and financial impact data",
    ],

    recommendations: [
        {
            title: "Add measurable business results",
            detail: "Include specific KPIs, percentage improvements, and ROI figures to substantiate your claims.",
            priority: "high" as const,
        },
        {
            title: "Include customer testimonials",
            detail: "Add 2–3 direct quotes from clients or stakeholders that validate your achievements.",
            priority: "high" as const,
        },
        {
            title: "Highlight leadership impact",
            detail: "Describe how executive decisions directly enabled the outcomes — judges value top-down accountability.",
            priority: "medium" as const,
        },
        {
            title: "Strengthen competitive framing",
            detail: "Explain clearly how your solution outperforms market alternatives using data.",
            priority: "medium" as const,
        },
        {
            title: "Add supporting visuals",
            detail: "Charts, graphs, or infographics dramatically improve readability and judge perception.",
            priority: "low" as const,
        },
    ],
};

export default function ForecastPage() {
    return (
        <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden bg-black text-white">
            <Sidebar />

            {/* Main scroll area */}
            <main className="flex-1 overflow-y-auto bg-[#0b0b0b] border-t border-l border-zinc-900 rounded-tl-2xl">
                {/* Ambient glow */}
                <div className="pointer-events-none fixed top-24 right-16 w-[500px] h-[500px] rounded-full bg-amber-400/4 blur-[140px]" />

                <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 py-10 space-y-10">

                    {/* ── Page Header ── */}
                    <motion.header
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className="flex flex-wrap items-start justify-between gap-6"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                                    <FiTrendingUp className="w-5 h-5 text-amber-400" />
                                </div>
                                <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-zinc-50 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                                    Award Success Forecast
                                </h1>
                            </div>
                            <p className="text-[13px] text-zinc-500 max-w-xl">
                                AI-powered analysis of your submission&apos;s win probability based on uploaded documents, entry strength, and competitive benchmarking.
                            </p>
                        </div>

                        <button className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-[13px] font-semibold text-zinc-300 hover:text-amber-400 hover:border-amber-400/40 hover:bg-zinc-800 transition-all duration-200">
                            <FiRefreshCw className="w-4 h-4" />
                            Refresh Analysis
                        </button>
                    </motion.header>

                    {/* ── Metrics Cards ── */}
                    <section>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600 mb-4 px-1">
                            Key Metrics
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                            <ForecastCard
                                label="Winning Probability"
                                value={`${FORECAST_DATA.winProbability}%`}
                                subtext="Based on document quality & category alignment"
                                icon={<FiTarget className="w-5 h-5" />}
                                accent="gold"
                                trend="up"
                                delay={0}
                            />
                            <ForecastCard
                                label="Entry Strength Score"
                                value={`${FORECAST_DATA.entryStrength}/10`}
                                subtext="Narrative quality, clarity, and judge readability"
                                icon={<FiStar className="w-5 h-5" />}
                                accent="sky"
                                trend="up"
                                delay={0.07}
                            />
                            <ForecastCard
                                label="Category Competitiveness"
                                value={FORECAST_DATA.competitiveness}
                                subtext="Estimated competition level within chosen category"
                                icon={<FiTrendingUp className="w-5 h-5" />}
                                accent="violet"
                                trend="neutral"
                                delay={0.14}
                            />
                            <ForecastCard
                                label="Improvement Potential"
                                value={FORECAST_DATA.improvementPotential}
                                subtext="Score lift achievable with recommended edits"
                                icon={<FiArrowUp className="w-5 h-5" />}
                                accent="emerald"
                                trend="up"
                                delay={0.21}
                            />
                        </div>
                    </section>

                    {/* ── Forecast Chart ── */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.45 }}
                    >
                        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600 mb-4 px-1">
                            Score Breakdown
                        </p>
                        <ForecastChart
                            winProbability={FORECAST_DATA.winProbability}
                            breakdown={FORECAST_DATA.breakdown}
                        />
                    </motion.section>

                    {/* ── AI Insights ── */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.45 }}
                    >
                        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600 mb-4 px-1">
                            AI Insights
                        </p>
                        <InsightList
                            strengths={FORECAST_DATA.strengths}
                            weaknesses={FORECAST_DATA.weaknesses}
                        />
                    </motion.section>

                    {/* ── Recommendations ── */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.45 }}
                        className="pb-10"
                    >
                        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600 mb-4 px-1">
                            Action Plan
                        </p>
                        <RecommendationPanel recommendations={FORECAST_DATA.recommendations} />
                    </motion.section>

                </div>
            </main>
        </div>
    );
}

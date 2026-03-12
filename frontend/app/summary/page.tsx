"use client";

import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Sidebar } from "@/components/Sidebar";
import { motion } from "framer-motion";
import { FiFileText, FiDownload, FiEdit3, FiMessageSquare, FiUploadCloud } from "react-icons/fi";

export default function SummaryPage() {
    const router = useRouter();

    return (
        <ErrorBoundary>
            <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden bg-black text-white">
                <Sidebar />

                {/* Main scroll area */}
                <main className="flex-1 overflow-y-auto bg-[#0b0b0b] border-t border-l border-white/[0.04] rounded-tl-2xl">
                    {/* Ambient glow */}
                    <div className="pointer-events-none fixed top-24 right-16 w-[420px] h-[420px] rounded-full bg-amber-400/[0.03] blur-[120px]" />

                    <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 py-10 space-y-8">

                        {/* ── Page Header ── */}
                        <motion.header
                            initial={{ opacity: 0, y: -14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="flex flex-wrap items-start justify-between gap-5"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                                        <FiFileText className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <h1 className="page-title">Summary</h1>
                                </div>
                                <p className="page-subtitle">
                                    Overview of your Stevie Award nomination progress.
                                </p>
                            </div>

                            {/* Export actions */}
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/70 text-[12px] font-semibold text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-all duration-200"
                                >
                                    <FiDownload className="w-4 h-4" />
                                    Export Markdown
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d5ab00] to-[#bd9602] text-[12px] font-bold text-black hover:brightness-110 transition-all duration-200 shadow-[0_4px_16px_rgba(213,171,0,0.2)]"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </motion.header>

                        {/* ── Summary Card ── */}
                        <motion.section
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.12, duration: 0.4 }}
                        >
                            <p className="section-label mb-4">Nomination Summary</p>

                            <div className="glass-card rounded-2xl overflow-hidden gold-border-glow">
                                {/* Card Header */}
                                <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.05]">
                                    <div>
                                        <h2 className="text-[15px] font-bold text-zinc-100">Nomination Draft</h2>
                                        <p className="text-[12px] text-zinc-500 mt-0.5">
                                            Auto-generated from documents &amp; category selection
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400/[0.08] border border-amber-400/[0.15] text-amber-400 text-[12px] font-semibold hover:bg-amber-400/[0.15] transition-all duration-200"
                                    >
                                        <FiEdit3 className="w-3.5 h-3.5" />
                                        Edit
                                    </button>
                                </div>

                                {/* Empty State */}
                                <div className="flex flex-col items-center justify-center gap-5 py-16 px-6 text-center">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-2xl bg-amber-400/[0.07] border border-amber-400/[0.12] flex items-center justify-center">
                                            <FiFileText className="w-7 h-7 text-amber-400/50" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400/20 animate-pulse" />
                                    </div>

                                    <div className="max-w-sm">
                                        <p className="text-[15px] font-semibold text-zinc-300 mb-2">
                                            No summary available yet
                                        </p>
                                        <p className="text-[13px] text-zinc-600 leading-relaxed">
                                            Upload your documents and complete the AI chat to generate your nomination summary.
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 mt-1">
                                        <button
                                            type="button"
                                            onClick={() => router.push("/documents")}
                                            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-amber-400/[0.08] border border-amber-400/[0.20] text-[13px] font-semibold text-amber-300 hover:bg-amber-400/[0.15] hover:border-amber-400/[0.35] transition-all duration-200"
                                        >
                                            <FiUploadCloud className="w-4 h-4" />
                                            Upload Documents
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => router.push("/chat")}
                                            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-zinc-800/50 border border-zinc-700/60 text-[13px] font-semibold text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-200"
                                        >
                                            <FiMessageSquare className="w-4 h-4" />
                                            Go to AI Chat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* ── Tips Card ── */}
                        <motion.section
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.22, duration: 0.4 }}
                            className="pb-10"
                        >
                            <p className="section-label mb-4">Getting Started</p>
                            <div className="grid sm:grid-cols-3 gap-4">
                                {[
                                    {
                                        step: "01",
                                        title: "Upload Documents",
                                        desc: "Add company overviews, case studies, or award entries.",
                                        icon: "📄",
                                    },
                                    {
                                        step: "02",
                                        title: "Chat with AI",
                                        desc: "Answer the guided questions to refine your match.",
                                        icon: "💬",
                                    },
                                    {
                                        step: "03",
                                        title: "Review Summary",
                                        desc: "Your nomination draft will appear here automatically.",
                                        icon: "✅",
                                    },
                                ].map((tip, i) => (
                                    <motion.div
                                        key={tip.step}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.28 + i * 0.06 }}
                                        className="stat-card-dark flex flex-col gap-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{tip.icon}</span>
                                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-400/50">Step {tip.step}</span>
                                        </div>
                                        <p className="text-[14px] font-semibold text-zinc-200">{tip.title}</p>
                                        <p className="text-[12px] text-zinc-500 leading-relaxed">{tip.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    </div>
                </main>
            </div>
        </ErrorBoundary>
    );
}

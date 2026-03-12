"use client";

import { motion } from "framer-motion";
import { FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

interface InsightListProps {
    strengths: string[];
    weaknesses: string[];
}

export function InsightList({ strengths, weaknesses }: InsightListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Strengths */}
            <div className="bg-[#111] border border-zinc-800/80 rounded-2xl p-5 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(52,211,153,0.05)] transition-all duration-300">
                <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
                        <FiCheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h4 className="text-[13px] font-bold text-zinc-200 uppercase tracking-wider">
                        Strengths
                    </h4>
                    <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                        {strengths.length}
                    </span>
                </div>
                <ul className="space-y-3">
                    {strengths.map((item, i) => (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.07 }}
                            className="flex items-start gap-3 group"
                        >
                            <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-emerald-400/15 flex items-center justify-center text-emerald-400 text-[10px] font-black">
                                ✓
                            </span>
                            <p className="text-[13px] text-zinc-300 leading-relaxed group-hover:text-zinc-100 transition-colors">
                                {item}
                            </p>
                        </motion.li>
                    ))}
                </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-[#111] border border-zinc-800/80 rounded-2xl p-5 hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.05)] transition-all duration-300">
                <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                        <FiAlertTriangle className="w-4 h-4 text-amber-400" />
                    </div>
                    <h4 className="text-[13px] font-bold text-zinc-200 uppercase tracking-wider">
                        Areas to Improve
                    </h4>
                    <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                        {weaknesses.length}
                    </span>
                </div>
                <ul className="space-y-3">
                    {weaknesses.map((item, i) => (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.07 }}
                            className="flex items-start gap-3 group"
                        >
                            <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-amber-400/15 flex items-center justify-center text-amber-400 text-[10px] font-black">
                                !
                            </span>
                            <p className="text-[13px] text-zinc-300 leading-relaxed group-hover:text-zinc-100 transition-colors">
                                {item}
                            </p>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

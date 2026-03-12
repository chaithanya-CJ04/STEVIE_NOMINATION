"use client";

import { motion } from "framer-motion";

const QUESTIONS = [
    "What are the core Stevie Awards programs?",
    "How much does it cost to enter?",
    "Help me discover categories for my IT startup",
    "When are the upcoming deadlines?",
];

export function QuickActions({ onSelect }: { onSelect: (q: string) => void }) {
    return (
        <div className="w-full flex-1 flex flex-col items-center justify-center p-6 sm:p-10 z-10">
            <div className="text-center max-w-lg mx-auto">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="mb-6 mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-[#d5ab00] via-amber-400 to-[#e8c020] p-[2px] shadow-[0_0_20px_rgba(213,171,0,0.4)]"
                >
                    <div className="w-full h-full rounded-full bg-[#0A0A0A] flex flex-col items-center justify-center relative overflow-hidden group">
                        <svg className="w-8 h-8 text-amber-400 z-10 transition-transform duration-500 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        <div className="absolute inset-0 bg-[#d5ab00]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                </motion.div>

                <motion.h2
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-[#d5ab00] bg-clip-text text-transparent mb-3"
                >
                    How can I help you today?
                </motion.h2>

                <motion.p
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="text-zinc-400 text-sm leading-relaxed mb-8"
                >
                    I&apos;m your AI-powered Stevie Awards assistant. I can match your company&apos;s achievements with the perfect award category across all global programs in just a few clicks.
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                    {QUESTIONS.map((q, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => onSelect(q)}
                            className="text-left px-5 py-3.5 bg-[#161616] border border-zinc-800 hover:border-amber-400/50 hover:bg-[#d5ab00]/10 text-zinc-300 text-[13px] rounded-xl transition-all duration-300 shadow-sm hover:-translate-y-0.5"
                        >
                            {q}
                        </button>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

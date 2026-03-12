"use client";

import { memo } from "react";
import { motion } from "framer-motion";

export const MessageBubble = memo(({
    role,
    content,
    isTyping,
    isLast,
    recommendations,
    RecommendationCard
}: {
    role: "assistant" | "user";
    content: string;
    isTyping?: boolean;
    isLast?: boolean;
    recommendations?: any[];
    RecommendationCard?: React.FC<{ rec: any; idx: number }>;
}) => {
    const isAssistant = role === "assistant";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex gap-3 w-full ${!isAssistant ? "justify-end" : ""}`}
        >
            {/* Assistant Avatar */}
            {isAssistant && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#d5ab00] to-[#bd9602] flex items-center justify-center shadow-[0_0_10px_rgba(213,171,0,0.3)] mt-1">
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                    </svg>
                </div>
            )}

            <div className={`max-w-[85%] flex flex-col gap-2 ${!isAssistant ? "items-end" : "items-start"}`}>
                {content && (
                    <div
                        className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed relative ${isAssistant
                                ? "bg-[#161616] text-zinc-100 rounded-tl-sm border border-zinc-800/60 shadow-lg"
                                : "bg-gradient-to-r from-[#d5ab00] to-[#bd9602] text-black rounded-tr-sm shadow-[0_4px_15px_rgba(213,171,0,0.25)] font-medium"
                            }`}
                    >
                        {content}
                        {isAssistant && isTyping && isLast && (
                            <span className="inline-block ml-1 w-1.5 h-3.5 bg-[#d5ab00] animate-pulse align-middle" />
                        )}
                    </div>
                )}

                {recommendations && recommendations.length > 0 && RecommendationCard && (
                    <div className="mt-2 space-y-3 w-full max-w-sm">
                        <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            {recommendations.length} Matching Categories
                        </div>
                        {recommendations.slice(0, 5).map((rec: any, idx: number) => (
                            <RecommendationCard key={rec.category_id || idx} rec={rec} idx={idx} />
                        ))}
                        {recommendations.length > 5 && (
                            <div className="text-[11px] text-zinc-400 font-medium text-center py-2 bg-[#161616] border border-zinc-800/60 rounded-xl">
                                + {recommendations.length - 5} more categories available
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* User Avatar */}
            {!isAssistant && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 mt-1">
                    <span className="text-zinc-300 text-xs font-bold uppercase">U</span>
                </div>
            )}
        </motion.div>
    );
});
MessageBubble.displayName = "MessageBubble";

"use client";

import { FormEvent, useEffect, useRef, useState, useCallback, memo } from "react";
import { flushSync } from "react-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAutoScroll } from "@/lib/hooks";
import { Toast, useToast } from "@/components/Toast";
import { TYPING_CONFIG } from "@/lib/config";
import { MessageBubble } from "./MessageBubble";
import { QuickActions } from "./QuickActions";
import { ChatInput } from "./ChatInput";
import { FiMessageSquare, FiRefreshCw, FiMoreVertical } from "react-icons/fi";

interface QaMessage {
    id: string;
    role: "assistant" | "user";
    content: string;
    recommendations?: any[];
}

type QaMetadata = {
    intent?: string;
    confidence?: string;
    sources?: unknown[];
};

// Memoized recommendation card component inside or imported. We'll declare it here.
const RecommendationCard = memo(({ rec, idx }: { rec: any; idx: number }) => (
    <div
        key={rec.category_id || idx}
        className="rounded-xl border border-amber-400/30 bg-zinc-900/50 p-3 hover:border-amber-400/60 hover:bg-zinc-900/70 transition-all cursor-pointer shadow-sm group"
    >
        <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="text-[12px] font-bold text-amber-300 leading-tight">
                {rec.category_name}
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#d5ab00]/20 text-amber-300 shrink-0 tracking-wide">
                {Math.round(rec.similarity_score * 100)}% Match
            </span>
        </div>
        <p className="text-[10px] text-zinc-500 mb-2 uppercase tracking-wide font-medium">
            {rec.program_name}
        </p>
        <p className="text-[11px] text-zinc-300 leading-relaxed mb-3">
            {rec.description.length > 150
                ? rec.description.substring(0, 150) + '...'
                : rec.description}
        </p>
        {rec.match_reasons && rec.match_reasons.length > 0 && (
            <div className="text-[11px] text-amber-200/90 flex items-start gap-2 bg-[#d5ab00]/10 border border-[#d5ab00]/20 rounded-lg p-2.5 mb-2">
                <span className="shrink-0 mt-0.5 text-[#d5ab00]" aria-hidden="true">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" /></svg>
                </span>
                <span className="leading-relaxed font-medium">{rec.match_reasons[0]}</span>
            </div>
        )}
    </div>
));
RecommendationCard.displayName = "RecommendationCard";


export function ChatWindow() {
    const [sessionId, setSessionId] = useState<string>("");
    const [messages, setMessages] = useState<QaMessage[]>([]);
    const [input, setInput] = useState("");
    const [loadingReply, setLoadingReply] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [metadata, setMetadata] = useState<QaMetadata | null>(null);
    const [historyOpen, setHistoryOpen] = useState(false);
    const streamAbortRef = useRef<AbortController | null>(null);
    const scrollRef = useAutoScroll<HTMLDivElement>(messages);
    const { toasts, showToast, removeToast } = useToast();
    const lastScrollTime = useRef<number>(0);

    const scrollToBottom = useCallback(() => {
        const now = Date.now();
        if (now - lastScrollTime.current < 50) return;
        lastScrollTime.current = now;
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [scrollRef]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        setSessionId(uuid);
    }, []);

    useEffect(() => {
        return () => {
            streamAbortRef.current?.abort();
        };
    }, []);

    useEffect(() => {
        if (error) showToast({ message: error, type: "error" });
    }, [error, showToast]);

    const handleStartOver = useCallback(() => {
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        setSessionId(uuid);
        setMessages([]);
        setError(null);
        setMetadata(null);
        streamAbortRef.current?.abort();
        setInput("");
    }, []);

    const handleSubmit = useCallback(async (e: FormEvent, defaultMessage?: string) => {
        e?.preventDefault();
        const finalInput = defaultMessage || input.trim();
        if (!finalInput || loadingReply || !sessionId) return;

        setError(null);
        setMetadata(null);
        streamAbortRef.current?.abort();
        const controller = new AbortController();
        streamAbortRef.current = controller;

        const userMsg: QaMessage = {
            id: `u-${Date.now()}`,
            role: "user",
            content: finalInput,
        };

        const replyId = `a-${Date.now()}`;
        const reply: QaMessage = {
            id: replyId,
            role: "assistant",
            content: "",
        };

        setMessages((prev) => [...prev, userMsg, reply]);
        setInput("");
        setLoadingReply(true);

        try {
            const { data } = await supabase.auth.getSession();
            const session = data.session;
            if (!session) throw new Error("Not authenticated. Please log in again.");

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "text/event-stream",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    message: finalInput
                }),
                signal: controller.signal,
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || `Backend returned ${res.status}.`);
            }
            if (!res.body) throw new Error("No response body received");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            let typingQueue: string[] = [];
            let isTyping = false;

            const typeText = async (text: string) => {
                if (!text) return;
                if (text.length < TYPING_CONFIG.MIN_CHUNK_LENGTH_FOR_ANIMATION) {
                    flushSync(() => {
                        setMessages((prev) =>
                            prev.map((m) => (m.id === replyId ? { ...m, content: m.content + text } : m)),
                        );
                    });
                    return;
                }

                let charDelay = TYPING_CONFIG.CHAR_DELAY;
                if (TYPING_CONFIG.ADAPTIVE_SPEED && text.length > 50) {
                    charDelay = Math.max(5, charDelay * 0.7);
                }

                const batchSize = TYPING_CONFIG.BATCH_SIZE;

                for (let i = 0; i < text.length; i += batchSize) {
                    const batch = text.slice(i, i + batchSize);
                    await new Promise<void>(resolve => {
                        requestAnimationFrame(() => {
                            flushSync(() => {
                                setMessages((prev) =>
                                    prev.map((m) => (m.id === replyId ? { ...m, content: m.content + batch } : m)),
                                );
                            });
                            resolve();
                        });
                    });
                    if (charDelay > 0 && i + batchSize < text.length) {
                        await new Promise(resolve => setTimeout(resolve, charDelay));
                    }
                }
            };

            const processTypingQueue = async () => {
                if (isTyping) return;
                while (typingQueue.length > 0) {
                    isTyping = true;
                    const chunk = typingQueue.shift();
                    if (chunk) await typeText(chunk);
                }
                isTyping = false;
            };

            const appendToReply = (delta: string) => {
                if (!delta) return;
                typingQueue.push(delta);
                processTypingQueue();
            };

            let done = false;

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                if (readerDone) break;

                buffer += decoder.decode(value, { stream: true });
                const parts = buffer.split("\n\n");
                buffer = parts.pop() ?? "";

                for (const part of parts) {
                    const lines = part.split("\n").map((l) => l.trim()).filter(Boolean);
                    const dataLines = lines.filter((l) => l.startsWith("data:")).map((l) => l.slice(5).trim());
                    if (dataLines.length === 0) continue;

                    const dataStr = dataLines.join("\n");
                    let payload: any;
                    try {
                        payload = JSON.parse(dataStr);
                    } catch (err) { continue; }

                    if (payload?.type === "intent") {
                        setMetadata((prev) => ({ ...prev, intent: payload?.intent }));
                    } else if (payload?.type === "chunk") {
                        appendToReply(payload?.content || "");
                    } else if (payload?.type === "recommendations") {
                        const recs = payload?.data || [];
                        if (recs.length > 0) {
                            setMessages((prev) =>
                                prev.map((m) => m.id === replyId ? { ...m, recommendations: recs } : m)
                            );
                        } else {
                            appendToReply("\n\nI couldn't find exact matches. Let's try refining your criteria.\n");
                        }
                    } else if (payload?.type === "error") {
                        setError(payload?.message || "Failed");
                        done = true;
                    } else if (payload?.type === "done") {
                        done = true;
                    }
                }
            }

            while (typingQueue.length > 0 || isTyping) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }

        } catch (err: any) {
            if (err?.name === "AbortError") return;
            setError(err?.message || "Network Error");
            setMessages((prev) => prev.map((m) =>
                m.role === "assistant" && m.content === "" ? { ...m, content: err?.message } : m
            ));
        } finally {
            setLoadingReply(false);
            if (streamAbortRef.current === controller) {
                streamAbortRef.current = null;
            }
        }
    }, [input, loadingReply, sessionId, showToast]);

    return (
        <>
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
            ))}

            <div className="flex w-full h-full relative overflow-hidden bg-black text-zinc-100 font-sans tracking-wide">

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col h-full bg-[#0c0c0c] sm:rounded-tl-2xl border-t border-l border-zinc-800/60 shadow-inner relative overflow-hidden">

                    {/* Header */}
                    <header className="flex-shrink-0 flex items-center justify-between p-4 lg:p-6 border-b border-zinc-900/80 bg-[#0A0A0A]/80 backdrop-blur-xl z-20">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-[#d5ab00]/20 to-[#e8c020]/5 border border-amber-400/20">
                                <FiMessageSquare className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                                <h2 className="text-[14px] font-bold text-zinc-50 tracking-wide flex items-center gap-2">
                                    Recommendation Chat
                                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 text-[10px] font-semibold border border-emerald-400/20">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        Online
                                    </span>
                                </h2>
                                <p className="text-[11px] text-zinc-400 mt-0.5">
                                    Powered by AI
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {messages.length > 0 && (
                                <button
                                    onClick={handleStartOver}
                                    className="hidden sm:flex items-center gap-2 text-xs font-semibold px-4 py-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 hover:text-amber-400 transition-colors"
                                >
                                    <FiRefreshCw className="w-3.5 h-3.5" />
                                    Restart Mode
                                </button>
                            )}
                            {/* History Toggle for Mobile */}
                            <button
                                onClick={() => setHistoryOpen(!historyOpen)}
                                className="lg:hidden p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition"
                            >
                                <FiMoreVertical className="w-5 h-5 text-zinc-300" />
                            </button>
                        </div>
                    </header>

                    {/* Conversation Log */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-32 space-y-6 scroll-smooth z-10"
                    >
                        {messages.length === 0 && !loadingReply ? (
                            <QuickActions onSelect={(q) => handleSubmit(null as unknown as FormEvent, q)} />
                        ) : (
                            messages.map((m, i) => (
                                <MessageBubble
                                    key={m.id}
                                    role={m.role}
                                    content={m.content}
                                    isTyping={loadingReply}
                                    isLast={i === messages.length - 1}
                                    recommendations={m.recommendations}
                                    RecommendationCard={RecommendationCard}
                                />
                            ))
                        )}

                        {/* Loading indication if bot hasn't typed anything yet */}
                        {loadingReply && messages[messages.length - 1]?.content === "" && (
                            <div className="flex items-center gap-2 ml-14 mb-4">
                                <span className="flex space-x-1">
                                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
                                </span>
                                <span className="text-[11px] font-medium text-zinc-500">Assistant is thinking...</span>
                            </div>
                        )}
                    </div>

                    {/* Input Area Overlay */}
                    <div className="absolute bottom-0 left-0 w-full p-4 lg:p-6 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/90 to-transparent pt-12 z-20">
                        <div className="max-w-4xl mx-auto">
                            <ChatInput
                                input={input}
                                setInput={setInput}
                                onSubmit={(e) => handleSubmit(e)}
                                isLoading={loadingReply}
                            />
                            <p className="text-center text-[10px] text-zinc-500 mt-3 hidden sm:block">
                                AI responses are generated based strictly on Stevie Awards profiles and may vary.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Session Details/History (Desktop Only Layout Add-on) */}
                <aside className={`absolute lg:relative right-0 top-0 bottom-0 bg-[#0A0A0A] w-64 border-l border-zinc-800/60 z-30 transition-transform duration-300 ${historyOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} flex flex-col p-5`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-500">Session History</h3>
                        <button onClick={() => setHistoryOpen(false)} className="lg:hidden p-1 text-zinc-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3">
                        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg shadow-sm cursor-pointer hover:border-amber-400/50 transition">
                            <p className="text-xs font-semibold text-zinc-100 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_5px_rgba(251,191,36,0.6)]" /> Current Chat</p>
                            <p className="text-[10px] text-zinc-500 mt-1 truncate">{messages.filter(m => m.role === 'user').pop()?.content || "Getting started..."}</p>
                            <span className="text-[9px] text-zinc-600 font-mono mt-2 block">ID: {sessionId.split('-')[0]}...</span>
                        </div>
                    </div>

                    {metadata?.intent && (
                        <div className="mt-auto p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
                            <p className="text-[10px] text-zinc-500 uppercase font-semibold mb-1 tracking-wider">Detected Intent</p>
                            <p className="text-xs text-amber-300 capitalize">{metadata.intent}</p>
                        </div>
                    )}

                    <div className="mt-4 sm:hidden">
                        <button
                            onClick={handleStartOver}
                            className="w-full flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-amber-500 hover:bg-zinc-800 transition"
                        >
                            <FiRefreshCw className="w-3.5 h-3.5" />
                            Restart Chat
                        </button>
                    </div>
                </aside>

            </div>
        </>
    );
}

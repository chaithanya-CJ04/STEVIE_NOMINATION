"use client";

import { FormEvent, useEffect, useRef, useState, memo, useCallback } from "react";
import { flushSync } from "react-dom";
import { supabase } from "@/lib/supabaseClient";
import { useDebounce, useAutoScroll, useKeyboardShortcut } from "@/lib/hooks";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toast, useToast } from "@/components/Toast";
import { LoadingSkeleton, ChatMessageSkeleton } from "@/components/LoadingSkeleton";
import { TYPING_CONFIG } from "@/lib/config";

interface QaMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  recommendations?: any[]; // Add recommendations field
}

type QaMetadata = {
  intent?: string;
  confidence?: string;
  sources?: unknown[];
};

// Memoized recommendation card component for better performance
const RecommendationCard = memo(({ rec, idx }: { rec: any; idx: number }) => (
  <div
    key={rec.category_id || idx}
    className="rounded-xl border border-amber-400/30 bg-zinc-900/50 p-3 hover:border-amber-400/60 hover:bg-zinc-900/70 transition-all cursor-pointer focus-within:ring-2 focus-within:ring-amber-400/50"
    role="article"
    aria-label={`Recommendation: ${rec.category_name}`}
    tabIndex={0}
  >
    <div className="flex items-start justify-between gap-2 mb-1.5">
      <h4 className="text-[11px] font-semibold text-amber-300 leading-tight">
        {rec.category_name}
      </h4>
      <span 
        className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 shrink-0"
        aria-label={`Match score: ${Math.round(rec.similarity_score * 100)} percent`}
      >
        {Math.round(rec.similarity_score * 100)}%
      </span>
    </div>
    <p className="text-[9px] text-zinc-500 mb-2 uppercase tracking-wide">
      {rec.program_name}
    </p>
    <p className="text-[10px] text-zinc-300 leading-relaxed mb-2">
      {rec.description.length > 150 
        ? rec.description.substring(0, 150) + '...' 
        : rec.description}
    </p>
    {rec.match_reasons && rec.match_reasons.length > 0 && (
      <div className="text-[10px] text-amber-200/80 flex items-start gap-1.5 bg-amber-400/5 rounded-lg p-2 mb-2">
        <span className="shrink-0" aria-hidden="true">💡</span>
        <span className="leading-relaxed">{rec.match_reasons[0]}</span>
      </div>
    )}
    <button 
      className="text-[9px] text-amber-400 hover:text-amber-300 font-medium uppercase tracking-wider focus:outline-none focus:underline"
      aria-label={`View details for ${rec.category_name}`}
    >
      View Details →
    </button>
  </div>
));

RecommendationCard.displayName = "RecommendationCard";

export default function DashboardPage() {
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<QaMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your Stevie Awards assistant. I can answer questions or help you find the right category. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loadingReply, setLoadingReply] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<QaMetadata | null>(null);
  const streamAbortRef = useRef<AbortController | null>(null);
  const scrollRef = useAutoScroll<HTMLDivElement>(messages);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toasts, showToast, removeToast } = useToast();
  const lastScrollTime = useRef<number>(0);

  // Debounce input for better performance (optional, for future features)
  const debouncedInput = useDebounce(input, 300);

  // Optimized scroll function with debouncing
  const scrollToBottom = useCallback(() => {
    const now = Date.now();
    if (now - lastScrollTime.current < 50) return; // Debounce 50ms
    
    lastScrollTime.current = now;
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [scrollRef]);

  // Scroll when messages change (debounced)
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Keyboard shortcut: Cmd/Ctrl + K to focus input
  useKeyboardShortcut("k", () => inputRef.current?.focus(), { meta: true });

  useEffect(() => {
    // Generate a proper UUID v4 for this chat session
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
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

  // Show toast for errors
  useEffect(() => {
    if (error) {
      showToast({ message: error, type: "error" });
    }
  }, [error]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loadingReply || !sessionId) return;

    setError(null);
    setMetadata(null);
    streamAbortRef.current?.abort();
    const controller = new AbortController();
    streamAbortRef.current = controller;

    const userMsg: QaMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
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
      if (!session) {
        throw new Error("Not authenticated. Please log in again.");
      }

      console.log('Sending chat request to:', '/api/chat');
      console.log('Session ID:', sessionId);
      console.log('Message:', trimmed);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ 
          session_id: sessionId,
          message: trimmed 
        }),
        signal: controller.signal,
      });

      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error('Error response:', text);
        throw new Error(text || `Backend returned ${res.status}. Please check if the API is running.`);
      }

      if (!res.body) {
        throw new Error("No response body received from server");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let typingQueue: string[] = []; // Queue of text chunks to type
      let isTyping = false; // Flag to prevent concurrent typing

      // Optimized typing animation function with batching and adaptive speed
      const typeText = async (text: string) => {
        if (!text) return;
        
        // Skip animation for very short chunks (optimization)
        if (text.length < TYPING_CONFIG.MIN_CHUNK_LENGTH_FOR_ANIMATION) {
          flushSync(() => {
            setMessages((prev) =>
              prev.map((m) => (m.id === replyId ? { ...m, content: m.content + text } : m)),
            );
          });
          return;
        }
        
        // Adaptive speed: Type faster for longer chunks
        let charDelay = TYPING_CONFIG.CHAR_DELAY;
        if (TYPING_CONFIG.ADAPTIVE_SPEED && text.length > 50) {
          charDelay = Math.max(5, charDelay * 0.7); // 30% faster for long chunks
        }
        
        // Batch processing: Type multiple characters at once
        const batchSize = TYPING_CONFIG.BATCH_SIZE;
        
        for (let i = 0; i < text.length; i += batchSize) {
          const batch = text.slice(i, i + batchSize);
          
          // Use requestAnimationFrame for smoother rendering
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
          
          // Configurable delay between batches
          if (charDelay > 0 && i + batchSize < text.length) {
            await new Promise(resolve => setTimeout(resolve, charDelay));
          }
        }
      };

      // Process typing queue with optimization
      const processTypingQueue = async () => {
        if (isTyping) return;
        
        while (typingQueue.length > 0) {
          isTyping = true;
          const chunk = typingQueue.shift();
          if (chunk) {
            await typeText(chunk);
          }
        }
        
        isTyping = false;
      };

      const appendToReply = (delta: string) => {
        if (!delta) return;
        // Add to queue and process
        typingQueue.push(delta);
        processTypingQueue();
      };

      const setReplyText = (text: string) => {
        // For errors, set immediately without typing
        setMessages((prev) =>
          prev.map((m) => (m.id === replyId ? { ...m, content: text } : m)),
        );
      };

      let done = false;
      let hasReceivedData = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        if (readerDone) break;

        hasReceivedData = true;
        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          const lines = part
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);

          const dataLines = lines
            .filter((l) => l.startsWith("data:"))
            .map((l) => l.slice(5).trim());

          if (dataLines.length === 0) continue;
          const dataStr = dataLines.join("\n");

          let payload: any;
          try {
            payload = JSON.parse(dataStr);
          } catch (err) {
            console.error('Failed to parse SSE data:', dataStr, err);
            continue;
          }

          console.log('Received payload:', payload);

          if (payload?.type === "intent") {
            setMetadata((prev) => ({
              ...prev,
              intent: typeof payload?.intent === "string" ? payload.intent : undefined,
            }));
          } else if (payload?.type === "chunk") {
            const content = typeof payload?.content === "string" ? payload.content : "";
            appendToReply(content);
          } else if (payload?.type === "status") {
            // Status message (e.g., "Generating recommendations...")
            const message = typeof payload?.message === "string" ? payload.message : "";
            if (message) {
              appendToReply(`\n\n${message}\n\n`);
            }
          } else if (payload?.type === "recommendations") {
            // Recommendations received - store them separately
            const recs = payload?.data || [];
            const count = payload?.count || recs.length;
            
            if (count > 0) {
              // Add recommendations to the reply message
              setMessages((prev) =>
                prev.map((m) => 
                  m.id === replyId 
                    ? { ...m, recommendations: recs }
                    : m
                ),
              );
            } else {
              appendToReply("\n\nI couldn't find matching categories. Could you provide more details about your achievement?\n");
            }
          } else if (payload?.type === "error") {
            const message =
              typeof payload?.message === "string"
                ? payload.message
                : "Failed to generate answer";
            console.error('Server error:', message);
            setError(message);
            if (!controller.signal.aborted) {
              setReplyText(message);
            }
            done = true;
          } else if (payload?.type === "done") {
            done = true;
          }
        }
      }

      if (!hasReceivedData) {
        throw new Error("No data received from server. The backend might be down or not responding.");
      }

      // Wait for any remaining typing to complete
      while (typingQueue.length > 0 || isTyping) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      
      console.error('Chat error:', err);
      
      let errorMsg = err?.message ?? "Failed to generate answer";
      
      // Provide more helpful error messages
      if (errorMsg.includes("Failed to fetch") || errorMsg.includes("NetworkError")) {
        errorMsg = "Network error: Unable to reach the backend API. Please check your internet connection and verify the backend is running.";
      } else if (errorMsg.includes("Not authenticated")) {
        errorMsg = "Session expired. Please refresh the page and log in again.";
      }
      
      setError(errorMsg);
      setMessages((prev) =>
        prev.map((m) =>
          m.role === "assistant" && m.content === ""
            ? { ...m, content: errorMsg }
            : m,
        ),
      );
    } finally {
      setLoadingReply(false);
      if (streamAbortRef.current === controller) {
        streamAbortRef.current = null;
      }
    }
  }, [input, loadingReply, sessionId, showToast]);

  return (
    <ErrorBoundary>
      <div className="flex h-full flex-col gap-8 md:flex-row md:items-stretch">
        {/* Toast notifications */}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}

        {/* Middle section: Coming soon */}
        <section className="flex h-full flex-1 min-h-[420px] rounded-[32px] border border-zinc-800/70 bg-black/80 px-10 py-12 text-zinc-100 shadow-[0_0_60px_rgba(0,0,0,0.9)]">
          <div className="m-auto flex max-w-xl flex-col items-center justify-center gap-5 text-center">
            <span className="rounded-full border border-zinc-700/70 bg-zinc-900/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
              Dashboard
            </span>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
              Coming soon
            </h1>
            <p className="max-w-xl text-base text-zinc-300">
              We&apos;re designing a rich overview of your nomination progress, conversations,
              and key insights. This dashboard will appear here once it&apos;s ready.
            </p>
          </div>
        </section>

        {/* Right section: Q&A chatbot */}
        <aside className="flex h-full w-full max-w-md min-h-[420px] rounded-3xl border border-amber-400/50 bg-zinc-950/90 p-5 text-zinc-100 shadow-[0_0_55px_rgba(251,191,36,0.55)] md:w-80">
          <div className="flex h-full w-full flex-col">
            <header className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-300">
                  AI Assistant
                </p>
                <p className="text-xs text-zinc-400">
                  Ask questions or get help finding the right category.
                </p>
              </div>
              <span 
                className="h-2 w-2 rounded-full bg-emerald-400"
                aria-label="Online"
                role="status"
              />
            </header>

            {metadata?.intent && (
              <div className="mb-3 text-[11px] text-zinc-400" role="status">
                Intent: <span className="text-zinc-200 capitalize">{metadata.intent}</span>
              </div>
            )}

            <div 
              ref={scrollRef} 
              className="mb-4 flex-1 space-y-2 overflow-y-auto pr-1 text-[12px] scroll-smooth"
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
            >
              {messages.map((m) => (
                <div key={m.id}>
                  <div
                    className={
                      m.role === "assistant"
                        ? "max-w-[85%] rounded-2xl bg-zinc-900 px-3 py-2 text-zinc-100"
                        : "ml-auto max-w-[85%] rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-2 text-black"
                    }
                    role={m.role === "assistant" ? "article" : "status"}
                  >
                    {m.content || <span className="opacity-50">Thinking...</span>}
                    {/* Show blinking cursor while streaming */}
                    {m.role === "assistant" && loadingReply && m.id === messages[messages.length - 1]?.id && m.content && (
                      <span className="inline-block ml-0.5 w-1.5 h-3 bg-amber-400 animate-pulse" />
                    )}
                  </div>
                  
                  {/* Recommendation Cards */}
                  {m.recommendations && m.recommendations.length > 0 && (
                    <div className="mt-3 space-y-2" role="region" aria-label="Recommendations">
                      <div className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider mb-2">
                        ✨ {m.recommendations.length} Matching Categories
                      </div>
                      {m.recommendations.slice(0, 5).map((rec: any, idx: number) => (
                        <RecommendationCard key={rec.category_id || idx} rec={rec} idx={idx} />
                      ))}
                      {m.recommendations.length > 5 && (
                        <div className="text-[10px] text-zinc-500 text-center py-2 bg-zinc-900/30 rounded-lg">
                          + {m.recommendations.length - 5} more categories available
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {loadingReply && messages[messages.length - 1]?.content === "" && (
                <div className="flex items-center gap-2 text-zinc-400">
                  <div className="flex gap-1">
                    <span className="animate-bounce" style={{ animationDelay: "0ms" }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: "150ms" }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: "300ms" }}>●</span>
                  </div>
                  <span className="text-[11px]">AI is typing...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-auto flex items-center gap-2">
              <label htmlFor="chat-input" className="sr-only">
                Type your message
              </label>
              <input
                id="chat-input"
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question... (⌘K to focus)"
                disabled={loadingReply}
                className="flex-1 rounded-full border border-zinc-700/70 bg-zinc-950 px-3.5 py-2 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 disabled:opacity-50"
                aria-label="Chat input"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!input.trim() || loadingReply}
                className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                aria-label="Send message"
              >
                {loadingReply ? "..." : "Send"}
              </button>
            </form>
          </div>
        </aside>
      </div>
    </ErrorBoundary>
  );
}

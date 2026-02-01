"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

interface QaMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
}

type QaMetadata = {
  confidence?: string;
  sources?: unknown[];
};

export default function DashboardPage() {
  const [messages, setMessages] = useState<QaMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! This space is for quick Q&A about your Stevie nominations. Ask me anything.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loadingReply, setLoadingReply] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<QaMetadata | null>(null);
  const streamAbortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loadingReply]);

  useEffect(() => {
    return () => {
      streamAbortRef.current?.abort();
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loadingReply) return;

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
      const res = await fetch("/api/chatbot/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ question: trimmed }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const appendToReply = (delta: string) => {
        if (!delta) return;
        setMessages((prev) =>
          prev.map((m) => (m.id === replyId ? { ...m, content: m.content + delta } : m)),
        );
      };

      const setReplyText = (text: string) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === replyId ? { ...m, content: text } : m)),
        );
      };

      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        if (readerDone) break;

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
          } catch {
            continue;
          }

          if (payload?.type === "metadata") {
            setMetadata({
              confidence:
                typeof payload?.confidence === "string" ? payload.confidence : undefined,
              sources: Array.isArray(payload?.sources) ? payload.sources : undefined,
            });
          } else if (payload?.type === "chunk") {
            const content = typeof payload?.content === "string" ? payload.content : "";
            appendToReply(content);
          } else if (payload?.type === "error") {
            const message =
              typeof payload?.message === "string"
                ? payload.message
                : "Failed to generate answer";
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
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setError(err?.message ?? "Failed to generate answer");
      setMessages((prev) =>
        prev.map((m) =>
          m.role === "assistant" && m.content === ""
            ? { ...m, content: err?.message ?? "Failed to generate answer" }
            : m,
        ),
      );
    } finally {
      setLoadingReply(false);
      if (streamAbortRef.current === controller) {
        streamAbortRef.current = null;
      }
    }
  };

  return (
    <div className="flex h-full flex-col gap-8 md:flex-row md:items-stretch">
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
              Q&A Chatbot
            </p>
            <p className="text-xs text-zinc-400">
              Ask quick questions about awards and nominations.
            </p>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        </header>

        {metadata?.confidence && (
          <div className="mb-3 text-[11px] text-zinc-400">
            Confidence: <span className="text-zinc-200">{metadata.confidence}</span>
          </div>
        )}

        <div ref={scrollRef} className="mb-4 flex-1 space-y-2 overflow-y-auto pr-1 text-[12px]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={
                m.role === "assistant"
                  ? "max-w-[85%] rounded-2xl bg-zinc-900 px-3 py-2 text-zinc-100"
                  : "ml-auto max-w-[85%] rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-2 text-black"
              }
            >
              {m.content}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-auto flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={loadingReply}
            className="flex-1 rounded-full border border-zinc-700/70 bg-zinc-950 px-3.5 py-2 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:border-amber-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loadingReply}
            className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingReply ? "..." : "Send"}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-[11px] text-red-300">{error}</p>
        )}
        </div>
      </aside>
    </div>
  );
}

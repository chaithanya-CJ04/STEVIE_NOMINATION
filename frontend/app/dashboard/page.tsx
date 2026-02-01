"use client";

import { FormEvent, useState } from "react";

interface QaMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
}

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: QaMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    // For now, echo-style placeholder until wired to real Q&A backend
    const reply: QaMessage = {
      id: `a-${Date.now()}`,
      role: "assistant",
      content:
        "Thanks for your question. The dedicated Q&A assistant is coming soon – this is just a preview shell.",
    };

    setMessages((prev) => [...prev, userMsg, reply]);
    setInput("");
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

        <div className="mb-4 flex-1 space-y-2 overflow-y-auto pr-1 text-[12px]">
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
            className="flex-1 rounded-full border border-zinc-700/70 bg-zinc-950 px-3.5 py-2 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:border-amber-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send
          </button>
        </form>
        </div>
      </aside>
    </div>
  );
}

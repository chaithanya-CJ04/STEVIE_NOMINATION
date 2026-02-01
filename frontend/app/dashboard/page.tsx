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
    <div className="flex flex-col gap-6 md:flex-row">
      {/* Middle section: Coming soon */}
      <section className="flex-1 rounded-3xl border border-zinc-800/70 bg-black/70 p-6 text-zinc-100 shadow-[0_0_40px_rgba(0,0,0,0.85)]">
        <div className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
          <span className="rounded-full border border-zinc-700/70 bg-zinc-900/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Dashboard
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            Coming soon
          </h1>
          <p className="max-w-md text-sm text-zinc-400">
            We&apos;re designing a rich overview of your nomination progress, conversations,
            and key insights. This dashboard will appear here once it&apos;s ready.
          </p>
        </div>
      </section>

      {/* Right section: Q&A chatbot */}
      <aside className="mt-2 w-full max-w-md rounded-3xl border border-amber-400/40 bg-zinc-950/80 p-4 text-zinc-100 shadow-[0_0_40px_rgba(251,191,36,0.45)] md:mt-0 md:w-80">
        <header className="mb-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">
              Q&A Chatbot
            </p>
            <p className="text-[11px] text-zinc-400">
              Ask quick questions about awards and nominations.
            </p>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        </header>

        <div className="mb-3 max-h-72 space-y-2 overflow-y-auto pr-1 text-[11px]">
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

        <form onSubmit={handleSubmit} className="mt-2 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 rounded-full border border-zinc-700/70 bg-zinc-950 px-3 py-1.5 text-[11px] text-zinc-100 placeholder:text-zinc-500 focus:border-amber-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send
          </button>
        </form>
      </aside>
    </div>
  );
}

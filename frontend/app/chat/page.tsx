"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  getUserProfile,
  sendConversationResponse,
  startConversation,
} from "@/lib/api";
import type {
  ConversationRespondResponse,
  ConversationStartResponse,
  Recommendation,
  UserProfile,
} from "@/lib/types";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loadingReply, setLoadingReply] = useState(false);
  const [typing, setTyping] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(
    null,
  );
  const [conversationState, setConversationState] = useState<string>("");
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(
    null,
  );
  const [matchesCount, setMatchesCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing, recommendations]);

  useEffect(() => {
    let mounted = true;

    async function initConversation() {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        if (!session) {
          router.replace("/auth");
          return;
        }

        const token = session.access_token;
        const uid = session.user.id;
        setUserId(uid);

        // Ensure user has completed onboarding
        try {
          const profile: UserProfile = await getUserProfile(token);
          if (!profile.has_completed_onboarding) {
            router.replace("/onboarding");
            return;
          }
        } catch {
          router.replace("/onboarding");
          return;
        }

        const start: ConversationStartResponse = await startConversation(
          token,
          uid,
        );

        if (!mounted) return;

        setSessionId(start.session_id);
        setConversationState(start.conversation_state);
        setMessages([
          {
            id: "intro",
            role: "assistant",
            content: start.message,
          },
          {
            id: "q1",
            role: "assistant",
            content: start.question,
          },
        ]);
      } catch (err: any) {
        if (!mounted) return;
        setError(
          err?.message ??
            "We couldn\'t start your conversation. Please try again shortly.",
        );
      } finally {
        if (mounted) {
          setChecking(false);
        }
      }
    }

    initConversation();

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      router.replace("/auth");
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim() || !sessionId || !userId || loadingReply) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);
    setLoadingReply(true);
    setError(null);

    try {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        router.replace("/auth");
        return;
      }

      const token = session.access_token;

      const response: ConversationRespondResponse = await sendConversationResponse(
        token,
        {
          sessionId,
          userId,
          message: userMessage.content,
        },
      );

      setConversationState(response.conversation_state);

      const newMessages: ChatMessage[] = [];
      if (response.message) {
        newMessages.push({
          id: `assistant-msg-${Date.now()}`,
          role: "assistant",
          content: response.message,
        });
      }
      if (response.question) {
        newMessages.push({
          id: `assistant-q-${Date.now()}`,
          role: "assistant",
          content: response.question,
        });
      }

      if (newMessages.length) {
        setMessages((prev) => [...prev, ...newMessages]);
      }

      if (response.progress) {
        setProgress(response.progress);
      }

      if (response.conversation_state === "complete") {
        const recs = (response.recommendations ?? []) as Recommendation[];
        setRecommendations(recs);
        if (typeof response.total_matches === "number") {
          setMatchesCount(response.total_matches);
        }
      }
    } catch (err: any) {
      setError(
        err?.message ?? "Something went wrong while sending your response.",
      );
    } finally {
      setTyping(false);
      setLoadingReply(false);
    }
  };

  const handleStartOver = async () => {
    if (!userId) return;
    setError(null);
    setRecommendations(null);
    setMatchesCount(null);
    setMessages([]);
    setProgress(null);
    setConversationState("");
    setChecking(true);

    try {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        router.replace("/auth");
        return;
      }

      const token = session.access_token;
      const start = await startConversation(token, userId);
      setSessionId(start.session_id);
      setConversationState(start.conversation_state);
      setMessages([
        { id: "intro", role: "assistant", content: start.message },
        { id: "q1", role: "assistant", content: start.question },
      ]);
    } catch (err: any) {
      setError(
        err?.message ??
          "We couldn\'t restart the conversation. Please try again.",
      );
    } finally {
      setChecking(false);
    }
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center text-zinc-50">
        <p className="text-sm text-zinc-400">Preparing your chat...</p>
      </main>
    );
  }

  const isComplete = conversationState === "complete";

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col text-zinc-50">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col rounded-3xl border border-zinc-800/70 bg-black/70 shadow-[0_0_60px_rgba(0,0,0,0.9)] backdrop-blur-lg">
        <header className="flex items-center justify-between gap-4 border-b border-zinc-800/80 px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-300">
              Stevie Awards
            </p>
            <h1 className="text-sm font-medium text-zinc-100 sm:text-base">
              AI Recommendation Conversation
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <button
              type="button"
              onClick={handleStartOver}
              className="rounded-full border border-zinc-700/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-200 transition hover:border-amber-400 hover:text-amber-300"
            >
              Start Over
            </button>
          </div>
        </header>

        {error && (
          <div className="mx-5 mt-3 rounded-2xl border border-red-500/40 bg-red-950/40 px-4 py-2 text-xs text-red-200 sm:mx-8">
            {error}
          </div>
        )}

        <section className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-950/80 via-black/60 to-black/80 p-4"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="mr-2 mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-[11px] text-amber-200">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "assistant"
                      ? "bg-zinc-900/80 text-zinc-100"
                      : "bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow-[0_0_25px_rgba(250,204,21,0.5)]"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <div className="mr-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-[10px] text-amber-200">
                  AI
                </div>
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-600 [animation-delay:240ms]" />
                </div>
              </div>
            )}
          </div>

          {recommendations && recommendations.length > 0 && (
            <div className="space-y-3 rounded-2xl border border-amber-400/40 bg-black/80 p-4 shadow-[0_0_35px_rgba(250,204,21,0.4)]">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-300">
                    Recommendations
                  </p>
                  <h2 className="text-sm font-semibold text-zinc-50 sm:text-base">
                    Your top Stevie Award category matches
                  </h2>
                </div>
                {typeof matchesCount === "number" && (
                  <p className="text-[11px] text-zinc-400">
                    Showing top {Math.min(recommendations.length, 10)} of {" "}
                    {matchesCount} matches
                  </p>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {recommendations.slice(0, 10).map((rec) => (
                  <article
                    key={rec.category_id}
                    className="flex flex-col justify-between rounded-2xl border border-zinc-700/70 bg-zinc-950/90 p-3 text-xs text-zinc-200 shadow-sm transition hover:border-amber-400 hover:shadow-[0_0_25px_rgba(250,204,21,0.35)]"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[13px] font-semibold text-zinc-50">
                          {rec.category_name}
                        </h3>
                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-amber-300">
                          {Math.round(rec.similarity_score * 100)}% match
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-200">
                        {rec.program_name}
                      </p>
                      <p className="text-[11px] text-zinc-400 line-clamp-3">
                        {rec.description}
                      </p>

                      {rec.match_reasons && rec.match_reasons.length > 0 && (
                        <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11px] text-zinc-300">
                          {rec.match_reasons.slice(0, 3).map((reason) => (
                            <li key={reason}>{reason}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-500">
                      {rec.is_free && (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-300">
                          Free
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={handleStartOver}
                        className="ml-auto rounded-full border border-zinc-700/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-200 transition hover:border-amber-400 hover:text-amber-300"
                      >
                        Start Over
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-1 flex items-center gap-2 rounded-full border border-zinc-800/80 bg-black/80 px-3 py-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isComplete
                  ? "Conversation complete. Start over to explore again."
                  : "Type your answer and press Enter..."
              }
              disabled={loadingReply || isComplete}
              className="flex-1 bg-transparent px-2 text-sm text-zinc-50 outline-none placeholder:text-zinc-500"
            />
            <button
              type="submit"
              disabled={loadingReply || isComplete}
              className="rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-black shadow-[0_0_20px_rgba(250,204,21,0.5)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Send
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

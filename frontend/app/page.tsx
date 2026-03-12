"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getUserProfile } from "@/lib/api";
import type { UserProfile } from "@/lib/types";
import { OptimizedImage } from "@/components/OptimizedImage";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { OfflineBanner } from "@/components/OfflineBanner";
import { motion } from "framer-motion";

type AuthState = "unknown" | "authenticated" | "unauthenticated";

/* ── Typing Indicator ───────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-2.5">
      <span className="w-1.5 h-1.5 rounded-full bg-[#A8A8A9] typing-dot" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#A8A8A9] typing-dot" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#A8A8A9] typing-dot" />
    </div>
  );
}

/* ── Feature Pill ────────────────────────────────────── */
function FeaturePill({ icon, text, delay }: { icon: string; text: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-2 px-4 py-2 rounded-full glass-card gold-border-glow text-xs text-[#A8A8A9] font-medium"
    >
      <span className="text-sm">{icon}</span>
      {text}
    </motion.div>
  );
}

/* ── Main Component ──────────────────────────────────── */
export default function Home() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>("unknown");
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    let mounted = true;

    const timeout = new Promise<void>((resolve) =>
      setTimeout(resolve, 4000)
    );

    Promise.race([
      supabase.auth.getSession().then(({ data }) => {
        if (!mounted) return;
        setAuthState(data.session ? "authenticated" : "unauthenticated");
      }),
      timeout.then(() => {
        if (!mounted) return;
        setAuthState((prev) => (prev === "unknown" ? "unauthenticated" : prev));
      }),
    ]).catch(() => {
      if (!mounted) return;
      setAuthState("unauthenticated");
    });

    return () => {
      mounted = false;
    };
  }, []);

  // Typing indicator loop
  useEffect(() => {
    const timer = setTimeout(() => setShowTyping(true), 2800);
    const hideTimer = setTimeout(() => setShowTyping(false), 4600);
    const loopTimer = setInterval(() => {
      setShowTyping(true);
      setTimeout(() => setShowTyping(false), 1800);
    }, 5000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
      clearInterval(loopTimer);
    };
  }, []);

  const handlePrimaryCta = async () => {
    setError(null);

    if (authState !== "authenticated") {
      router.push("/auth");
      return;
    }

    setLoadingAction(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        router.push("/auth");
        return;
      }

      const profile: UserProfile = await getUserProfile(token);

      if (!profile.has_completed_onboarding) {
        router.push("/onboarding");
      } else {
        router.push("/chat");
      }
    } catch (err: any) {
      if (err?.code === "PROFILE_NOT_FOUND" || err?.message === "PROFILE_NOT_FOUND") {
        router.push("/onboarding");
        return;
      }

      setError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoadingAction(false);
    }
  };

  const isChecking = authState === "unknown";
  const isLoggedIn = authState === "authenticated";

  return (
    <ErrorBoundary>
      <OfflineBanner />

      {/* Hero Section */}
      <section className="relative hero-glow overflow-hidden">
        {/* Background radial gold glow */}
        <div
          className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(250,221,83,0.05) 0%, rgba(209,4,0,0.02) 40%, transparent 70%)",
          }}
        />
        {/* Subtle grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.013] z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(250,221,83,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(250,221,83,0.5) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-center lg:gap-16">
            {/* Left: Hero Content */}
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 mb-6"
              >
                <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.15em] glass-card gold-border-glow text-[#FADD53]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FADD53] animate-pulse" />
                  AI-Powered Discovery
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.5rem] xl:text-6xl leading-[1.1]"
              >
                Find Your Perfect{" "}
                <span className="metallic-text">
                  Stevie Award
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 max-w-lg text-base text-[#A8A8A9] leading-relaxed sm:text-lg"
              >
                Answer a few tailored questions and let our AI match you with the
                most relevant Stevie Award categories across global programs.
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
              >
                <button
                  type="button"
                  onClick={handlePrimaryCta}
                  disabled={loadingAction || isChecking}
                  className="btn-gold inline-flex min-h-[48px] items-center justify-center rounded-xl px-8 py-3 text-sm font-bold uppercase tracking-[0.08em] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#FADD53]/50"
                  aria-label={isChecking ? "Checking authentication" : isLoggedIn ? "Get started" : "Login to begin"}
                >
                  <span className="flex items-center gap-2">
                    {isChecking && (
                      <span className="w-3 h-3 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
                    )}
                    Get Started
                  </span>
                </button>

                <p className="text-xs text-[#A8A8A9]/70 max-w-[200px]">
                  No browsing long lists. Just a 5–6 question guided conversation.
                </p>
              </motion.div>

              {error && (
                <p className="mt-4 text-sm text-red-400" role="alert">
                  {error}
                </p>
              )}

              {/* Feature pills */}
              <div className="mt-10 flex flex-wrap gap-3">
                <FeaturePill icon="🏆" text="350+ Award Categories" delay={0.6} />
                <FeaturePill icon="🤖" text="AI-Guided Matching" delay={0.7} />
                <FeaturePill icon="⚡" text="Results in Minutes" delay={0.8} />
              </div>
            </div>

            {/* Right: Chat Preview Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center"
            >
              {/* Gold glow behind card */}
              <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(250,221,83,0.08) 0%, transparent 60%)",
                }}
              />

              <div className="relative z-10 w-full max-w-md rounded-2xl glass-card gold-border-glow gold-glow p-6 sm:p-7">
                {/* Card header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FADD53]/20 to-[#D10400]/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#FADD53]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white tracking-wide">
                        AI Assistant
                      </p>
                      <p className="text-[10px] text-[#A8A8A9]">Live Preview</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#FADD53]/10 border border-[#FADD53]/20 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#FADD53]">
                    AI Chat
                  </span>
                </div>

                {/* Chat Bubbles */}
                <div className="space-y-3" role="presentation" aria-label="Chat preview">
                  {/* Bot message 1 */}
                  <motion.div
                    initial={{ opacity: 0, x: -16, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-[82%]"
                  >
                    <div className="rounded-2xl rounded-bl-md bg-[#1A1A1A] border border-white/[0.06] px-4 py-2.5 text-[13px] text-white/90 leading-relaxed">
                      Hi there! Let&apos;s find the perfect Stevie Award for your organization.
                    </div>
                  </motion.div>

                  {/* Bot message 2 */}
                  <motion.div
                    initial={{ opacity: 0, x: -16, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-[78%]"
                  >
                    <div className="rounded-2xl rounded-bl-md bg-[#1A1A1A] border border-white/[0.06] px-4 py-2.5 text-[13px] text-white/90 leading-relaxed">
                      What type of organization do you represent?
                    </div>
                  </motion.div>

                  {/* User message */}
                  <motion.div
                    initial={{ opacity: 0, x: 16, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 1.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[78%] rounded-2xl rounded-br-md bg-gradient-to-r from-[#FADD53] to-[#F4C542] px-4 py-2.5 text-[13px] font-medium text-[#1A1A1A] leading-relaxed shadow-[0_2px_12px_rgba(250,221,83,0.2)]">
                      We&apos;re a fast-growing tech startup.
                    </div>
                  </motion.div>

                  {/* Typing indicator */}
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{
                      opacity: showTyping ? 1 : 0,
                      x: showTyping ? 0 : -16,
                    }}
                    transition={{ duration: 0.3 }}
                    className="max-w-[40%]"
                  >
                    <div className="rounded-2xl rounded-bl-md bg-[#1A1A1A] border border-white/[0.06]">
                      <TypingIndicator />
                    </div>
                  </motion.div>
                </div>

                {/* Card footer */}
                <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-3.5">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#A8A8A9]">
                    <span className="w-1 h-1 rounded-full bg-emerald-400" />
                    Dynamic questions • 5–6 steps
                  </div>
                  <p className="text-[10px] font-semibold text-[#FADD53]">
                    Personalized results
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-[#FADD53]/[0.08] border border-[#FADD53]/[0.15] text-[#FADD53]/70">
            Simple Process
          </span>
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            How It <span className="text-[#FADD53]">Works</span>
          </h2>
          <p className="mt-3 text-sm text-[#A8A8A9] max-w-md mx-auto">
            Three simple steps to discover your best-fit Stevie Award categories
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-3 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden sm:block absolute top-[52px] left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-px bg-gradient-to-r from-[#FADD53]/10 via-[#FADD53]/30 to-[#FADD53]/10 pointer-events-none" />

          {[
            {
              step: "01",
              title: "Tell Us About You",
              desc: "Share your organization type, industry, and key achievements through a guided conversation.",
              icon: "💬",
            },
            {
              step: "02",
              title: "AI Analyzes",
              desc: "Our AI matches your profile against 350+ Stevie Award categories across all global programs.",
              icon: "🧠",
            },
            {
              step: "03",
              title: "Get Matched",
              desc: "Receive personalized recommendations with match scores, descriptions, and entry guidance.",
              icon: "🏆",
            },
          ].map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: idx * 0.12,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative rounded-2xl glass-card gold-border-glow p-6 transition-all duration-300 hover:translate-y-[-4px] hover:border-[#FADD53]/25 hover:shadow-[0_0_40px_rgba(250,221,83,0.08)]"
            >
              {/* Step number circle */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#FADD53]/[0.08] border border-[#FADD53]/[0.20] flex items-center justify-center shrink-0 group-hover:bg-[#FADD53]/[0.14] group-hover:border-[#FADD53]/[0.35] transition-all duration-300">
                  <span className="text-[13px] font-black text-[#FADD53]">{item.step}</span>
                </div>
                <span className="text-xl">{item.icon}</span>
              </div>
              <h3 className="font-heading text-lg font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-[#A8A8A9] leading-relaxed">
                {item.desc}
              </p>
              {/* Bottom gold accent */}
              <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-[#FADD53]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </section>
    </ErrorBoundary >
  );
}

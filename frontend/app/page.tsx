"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getUserProfile } from "@/lib/api";
import type { UserProfile } from "@/lib/types";

type AuthState = "unknown" | "authenticated" | "unauthenticated";

export default function Home() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>("unknown");
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setAuthState(data.session ? "authenticated" : "unauthenticated");
      })
      .catch(() => {
        if (!mounted) return;
        setAuthState("unauthenticated");
      });

    return () => {
      mounted = false;
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
      setError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoadingAction(false);
    }
  };

  const isChecking = authState === "unknown";
  const isLoggedIn = authState === "authenticated";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-zinc-50">
      <div className="w-full max-w-5xl rounded-3xl border border-zinc-800/60 bg-black/60 px-8 py-10 shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-lg sm:px-12 sm:py-14">
        <header className="mb-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image
              src="/stevies-logo.png"
              alt="Stevie Awards Logo"
              width={64}
              height={64}
              className="h-16 w-16 object-contain"
              unoptimized
            />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                The Stevie Awards
              </p>
              <p className="text-sm text-zinc-300">AI Recommendation System</p>
            </div>
          </div>

          {!isChecking && (
            <button
              type="button"
              onClick={() => router.push(isLoggedIn ? "/chat" : "/auth")}
              className="hidden rounded-full border border-zinc-700/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-zinc-200 transition hover:border-amber-400 hover:text-amber-300 md:inline-flex"
            >
              {isLoggedIn ? "Open Chat" : "Log In"}
            </button>
          )}
        </header>

        <section className="grid gap-10 md:grid-cols-[3fr,2fr] md:items-center">
          <div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl md:text-6xl">
              Find Your Perfect
              <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                {" "}
                Stevie Award
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-zinc-300 sm:text-lg">
              Answer a few tailored questions and let our AI match you with the
              most relevant Stevie Award categories across global programs.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handlePrimaryCta}
                disabled={loadingAction || isChecking}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 px-10 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-black shadow-[0_0_35px_rgba(250,204,21,0.5)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isChecking
                  ? "Checking..."
                  : isLoggedIn
                  ? "Get Started"
                  : "Login to Begin"}
              </button>

              <p className="text-xs text-zinc-400">
                No browsing long lists. Just a 5–6 question guided
                conversation.
              </p>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-400">{error}</p>
            )}
          </div>

          <div className="relative flex h-full items-center justify-center">
            <div className="relative w-full max-w-md rounded-3xl border border-amber-400/40 bg-zinc-950/80 p-5 shadow-[0_0_40px_rgba(251,191,36,0.4)]">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
                  Preview
                </p>
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-amber-200">
                  AI Chat
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="max-w-[80%] rounded-2xl bg-zinc-900 px-3 py-2 text-zinc-100">
                  Hi there! Let&apos;s find the perfect Stevie Award for your
                  organization.
                </div>
                <div className="max-w-[75%] rounded-2xl bg-zinc-900 px-3 py-2 text-zinc-100">
                  First, what type of organization do you represent?
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[75%] rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-2 text-black">
                    We&apos;re a fast-growing tech startup.
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-3 text-[10px] text-zinc-400">
                <p>Dynamic questions • 5–6 steps</p>
                <p className="text-amber-300">Personalized results</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

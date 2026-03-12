"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

export default function AuthPage() {
  const router = useRouter();

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (typeof window === "undefined" ? undefined : window.location.origin);

  const redirectTo = baseUrl
    ? `${baseUrl.replace(/\/$/, "")}/auth/callback`
    : undefined;

  useEffect(() => {
    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        if (data.session) {
          router.replace("/");
        }
      })
      .catch(() => { });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push("/");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(250,221,83,0.04)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute top-[8%] left-1/2 -translate-x-1/2 w-[60%] h-[28%] blur-[140px] rounded-full bg-amber-400/[0.06] animate-pulse-slow" />
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(250,221,83,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(250,221,83,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] relative z-10"
      >
        {/* Glow behind card */}
        <div className="absolute -inset-4 rounded-3xl bg-amber-400/[0.04] blur-2xl pointer-events-none" />

        <div className="relative rounded-3xl bg-[#0c0c0c] border border-white/[0.06] shadow-[0_40px_100px_rgba(0,0,0,0.7)] overflow-hidden">
          {/* Gold top stripe */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#FADD53] to-transparent opacity-60" />

          <div className="px-8 py-8">
            {/* Header */}
            <header className="flex flex-col items-center text-center mb-7">
              <div className="mb-4 p-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.07] inline-flex">
                <Image
                  src="/stevie-awards-banner.png"
                  alt="Stevie Awards"
                  width={160}
                  height={54}
                  className="h-12 w-auto object-contain"
                  unoptimized
                />
              </div>

              <span className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full bg-amber-400/[0.08] border border-amber-400/[0.15] text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                AI Recommendation System
              </span>

              <h1 className="text-[18px] font-bold text-zinc-100 leading-snug">
                Sign in to your account
              </h1>
              <p className="mt-1.5 text-[13px] text-zinc-500 max-w-xs leading-relaxed">
                Use your email and password or continue with Google to access the platform.
              </p>
            </header>

            {/* Divider */}
            <div className="content-divider mb-6" />

            {/* Auth form */}
            <div className="rounded-2xl border border-white/[0.05] bg-black/30 px-4 py-5 gold-glow">
              <Auth
                supabaseClient={supabase}
                redirectTo={redirectTo}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: "#bd9602",
                        brandAccent: "#d5ab00",
                        inputText: "#f5f5f5",
                        inputBackground: "#050505",
                        inputBorder: "#2a2a2a",
                        messageText: "#d5ab00",
                      },
                      fonts: {
                        bodyFontFamily:
                          "var(--font-inter), system-ui, -apple-system, sans-serif",
                        buttonFontFamily:
                          "var(--font-inter), system-ui, -apple-system, sans-serif",
                      },
                      radii: {
                        borderRadiusButton: "12px",
                        buttonBorderRadius: "12px",
                        inputBorderRadius: "12px",
                      },
                      space: {
                        inputPadding: "12px 16px",
                        buttonPadding: "12px 20px",
                      },
                    },
                  },
                }}
                localization={{
                  variables: {
                    sign_in: {
                      email_label: "Email address",
                      password_label: "Password",
                    },
                  },
                }}
                providers={["google"]}
              />
            </div>

            {/* Footer */}
            <p className="mt-5 text-center text-[11px] text-zinc-600 leading-relaxed">
              After signing in, you&apos;ll be guided through a quick onboarding step before accessing the AI recommendation system.
            </p>
          </div>
        </div>

        {/* Feature hints below card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex items-center justify-center gap-6 mt-6"
        >
          {["350+ Award Categories", "AI-Guided Matching", "Free to Try"].map((text) => (
            <span key={text} className="flex items-center gap-1.5 text-[11px] text-zinc-600">
              <span className="w-1 h-1 rounded-full bg-amber-400/50" />
              {text}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}

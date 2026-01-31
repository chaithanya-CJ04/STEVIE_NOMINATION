"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabaseClient";

export default function AuthPage() {
  const router = useRouter();

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
      .catch(() => {
        // ignore
      });

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
    <main className="flex min-h-screen items-center justify-center px-4 py-10 text-zinc-50">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800/70 bg-black/70 px-6 py-7 shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-lg sm:px-8 sm:py-8">
        <header className="mb-6 text-center">
          <div className="mb-3 flex justify-center">
            <Image
              src="/stevie-awards-banner.png"
              alt="Stevie Awards Banner"
              width={190}
              height={64}
              className="h-14 w-auto object-contain"
              unoptimized
            />
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            The Stevie Awards
          </p>
          <h1 className="mt-2 text-xl font-semibold text-zinc-50">
            Sign in or create an account
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Use your email and a secure password, or continue with Google, to
            access the recommendation system.
          </p>
        </header>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/70 px-3 py-4">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#f4c542",
                    brandAccent: "#f9d66b",
                    inputText: "#f5f5f5",
                    inputBackground: "#050505",
                    inputBorder: "#3f3f46",
                    messageText: "#f97316",
                  },
                  fonts: {
                    bodyFontFamily:
                      'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
                    buttonFontFamily:
                      'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
                  },
                  radii: {
                    borderRadiusButton: "999px",
                    buttonBorderRadius: "999px",
                    inputBorderRadius: "999px",
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

        <p className="mt-4 text-center text-[11px] text-zinc-500">
          After signing in, you&apos;ll be redirected to the landing page to
          complete onboarding and start your AI-guided conversation.
        </p>
      </div>
    </main>
  );
}

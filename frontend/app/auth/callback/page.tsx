"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Completing sign-in...");

  useEffect(() => {
    let cancelled = false;

    async function finalize() {
      try {
        const { data } = await supabase.auth.getSession();

        if (!data.session) {
          const error = searchParams?.get("error_description") || "Sign-in failed.";
          throw new Error(error);
        }

        if (cancelled) return;
        router.replace("/");
      } catch (err: any) {
        if (cancelled) return;
        setMessage(err?.message ?? "Sign-in failed. Please try again.");
        setTimeout(() => {
          router.replace("/auth");
        }, 1200);
      }
    }

    finalize();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16 text-zinc-50">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800/70 bg-black/70 px-8 py-10 text-center shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-lg">
        <p className="text-sm text-zinc-300">{message}</p>
      </div>
    </main>
  );
}

"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

interface SiteShellProps {
  children: ReactNode;
}

export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const showChrome = pathname !== "/auth";
  const isChatRoute = pathname.startsWith("/chat");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      router.replace("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-zinc-950 to-black">
      {showChrome && (
        <header className="w-full border-b border-zinc-800/60 bg-black/60 backdrop-blur-sm">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-3">
            <Image
              src="/stevie-awards-banner.png"
              alt="Stevie Awards Banner"
              width={140}
              height={48}
              className="h-12 w-auto object-contain"
              priority
              unoptimized
            />
            <span className="text-sm font-medium text-zinc-200 tracking-wide">
              Stevie Awards Recommendation System
            </span>
          </div>
        </header>
      )}

      <div className="mx-auto flex max-w-5xl px-4 pb-10 pt-6">
        {showChrome && (isChatRoute || isDashboardRoute) && (
          <aside className="mr-4 hidden w-52 flex-col justify-between rounded-3xl border border-zinc-800/70 bg-black/80 p-4 text-sm text-zinc-200 shadow-[0_0_40px_rgba(0,0,0,0.85)] sm:flex">
            <div className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Navigation
              </p>
              <nav className="space-y-2">
                {/* Dashboard tab - disabled, coming soon */}
                <button
                  type="button"
                  disabled
                  title="Coming soon"
                  className="flex w-full items-center justify-between rounded-full border border-zinc-700/60 bg-zinc-900/60 px-3 py-2 text-left text-xs font-medium uppercase tracking-[0.16em] text-zinc-500 cursor-not-allowed"
                >
                  <span>Dashboard</span>
                  <span className="text-[10px] uppercase text-zinc-500">Soon</span>
                </button>

                {/* Chatbot tab */}
                <button
                  type="button"
                  onClick={() => {
                    if (!isChatRoute) router.push("/chat");
                  }}
                  className={`flex w-full items-center justify-between rounded-full px-3 py-2 text-left text-xs uppercase tracking-[0.16em] transition ${
                    isChatRoute
                      ? "border border-amber-500/70 bg-amber-500/10 font-semibold text-amber-300 shadow-[0_0_20px_rgba(250,204,21,0.4)]"
                      : "border border-transparent font-medium text-zinc-300 hover:border-amber-400 hover:text-amber-300"
                  }`}
                >
                  <span>Chatbot</span>
                  {isChatRoute && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  )}
                </button>
              </nav>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-6 flex w-full items-center justify-between rounded-full border border-zinc-700/80 px-3 py-2 text-left text-xs font-medium uppercase tracking-[0.16em] text-zinc-300 transition hover:border-red-500 hover:text-red-300"
            >
              <span>Logout</span>
            </button>
          </aside>
        )}

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

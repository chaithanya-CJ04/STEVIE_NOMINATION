"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useKeyboardShortcut } from "@/lib/hooks";
import { AIAssistant } from "@/components/AIAssistant";

interface SiteShellProps {
  children: ReactNode;
}

export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const showChrome = pathname !== "/auth";
  const isChatRoute = pathname.startsWith("/chat");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isDocumentsRoute = pathname.startsWith("/documents");

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      router.replace("/auth");
    }
  };

  // Keyboard shortcut: Shift + L to logout
  useKeyboardShortcut("l", handleLogout, { shift: true });

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-zinc-950 to-black">
      {showChrome && (
        <header className="w-full border-b border-zinc-800/60 bg-black/60 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center gap-4">
            <OptimizedImage
              src="/stevie-awards-banner.png"
              alt="Stevie Awards Banner"
              width={140}
              height={48}
              className="h-12 w-auto object-contain"
              priority
              style={{ height: '48px', width: 'auto' }}
            />
            <span className="text-base font-medium text-zinc-200 tracking-wide">
              Stevie Awards Recommendation System
            </span>
          </div>
        </header>
      )}

      <div className="mx-auto flex max-w-6xl px-6 pb-12 pt-8 h-[calc(100vh-96px)] min-h-[calc(100vh-96px)] items-stretch gap-4">
        {showChrome && (isDashboardRoute || isDocumentsRoute) && (
          <aside className="hidden h-full w-52 min-h-[420px] flex-col justify-between rounded-3xl border border-zinc-800/70 bg-black/80 p-4 text-sm text-zinc-200 shadow-[0_0_40px_rgba(0,0,0,0.85)] sm:flex">
            <nav className="space-y-4" aria-label="Main navigation">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Navigation
              </p>
              <div className="space-y-2">
                {/* Dashboard tab */}
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className={`flex w-full min-h-[44px] items-center justify-between rounded-full px-3 py-2 text-left text-xs uppercase tracking-[0.16em] transition focus:outline-none focus:ring-2 ${
                    isDashboardRoute
                      ? "border border-amber-500/70 bg-amber-500/10 font-semibold text-amber-300 shadow-[0_0_20px_rgba(250,204,21,0.4)] focus:ring-amber-400/50"
                      : "border border-zinc-700/80 font-medium text-zinc-300 hover:border-amber-400/50 hover:text-amber-300 focus:ring-amber-400/50"
                  }`}
                  aria-current={isDashboardRoute ? "page" : undefined}
                >
                  <span>Dashboard</span>
                  {isDashboardRoute && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-label="Active" />
                  )}
                </button>

                {/* Documents tab */}
                <button
                  type="button"
                  onClick={() => router.push("/documents")}
                  className={`flex w-full min-h-[44px] items-center justify-between rounded-full px-3 py-2 text-left text-xs uppercase tracking-[0.16em] transition focus:outline-none focus:ring-2 ${
                    isDocumentsRoute
                      ? "border border-amber-500/70 bg-amber-500/10 font-semibold text-amber-300 shadow-[0_0_20px_rgba(250,204,21,0.4)] focus:ring-amber-400/50"
                      : "border border-zinc-700/80 font-medium text-zinc-300 hover:border-amber-400/50 hover:text-amber-300 focus:ring-amber-400/50"
                  }`}
                  aria-current={isDocumentsRoute ? "page" : undefined}
                >
                  <span>Documents</span>
                  {isDocumentsRoute && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-label="Active" />
                  )}
                </button>
              </div>
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-6 flex w-full min-h-[44px] items-center justify-between rounded-full border border-zinc-700/80 px-3 py-2 text-left text-xs font-medium uppercase tracking-[0.16em] text-zinc-300 transition hover:border-red-500 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              aria-label="Logout (Shift + L)"
            >
              <span>Logout</span>
            </button>
          </aside>
        )}

        <main className="flex-1 h-full flex gap-4" role="main">
          <div className="flex-1">
            {children}
          </div>
          
          {showChrome && (isDashboardRoute || isDocumentsRoute) && (
            <AIAssistant />
          )}
        </main>
      </div>
    </div>
  );
}

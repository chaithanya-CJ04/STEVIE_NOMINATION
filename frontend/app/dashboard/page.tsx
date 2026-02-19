"use client";

import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <ErrorBoundary>
      {/* Dashboard section */}
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
          
          {/* Upload Documents Button */}
          <div className="mt-6 w-full max-w-md">
            <button
              type="button"
              onClick={() => router.push("/documents")}
              className="w-full flex items-center justify-center gap-3 rounded-2xl border border-zinc-700/70 bg-zinc-900/80 px-6 py-4 text-sm font-medium text-zinc-300 transition-all hover:border-amber-400/50 hover:bg-zinc-900 hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              aria-label="Go to upload documents"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
              <span>Upload Documents</span>
            </button>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
}

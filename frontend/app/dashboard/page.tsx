"use client";

import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AIAssistant } from "@/components/AIAssistant";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <ErrorBoundary>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <aside className="w-64 flex-shrink-0 bg-[#0a0a0a] p-6 flex flex-col">
          <div className="mb-8">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-4">Navigation</h2>
            <nav className="space-y-1">
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-black bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg"
                aria-current="page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </button>
              
              <button
                onClick={() => router.push("/documents")}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Documents
              </button>
              
              <button
                onClick={() => router.push("/chat")}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Gap Analysis
              </button>
              
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Master Requirements
              </button>
              
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Forecast
              </button>
              
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                Request for Proposal
              </button>
            </nav>
          </div>
          
          <div className="mt-auto pt-6 border-t border-zinc-800/70">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Projects</span>
              <button className="text-xs text-amber-400 hover:text-amber-300 font-medium">
                See all
              </button>
            </div>
          </div>
          
          <button className="mt-6 w-full px-4 py-2.5 text-sm font-medium text-zinc-400 border border-zinc-800 rounded-lg hover:bg-zinc-900/50 transition-all">
            Logout
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#050505] p-8">
          <div className="max-w-4xl space-y-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-zinc-100 mb-1">Project Summary</h1>
              <p className="text-sm text-zinc-500">Track your nomination progress, conversations, and key insights</p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* Estimated Time Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-6 shadow-xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/10 rounded-full -mr-20 -mt-20" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">Estimated time to finish</h3>
                  <p className="text-xs text-blue-200/60">Not Available</p>
                </div>
              </div>

              {/* Estimated Budget Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-6 shadow-xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-slate-500/5 rounded-full -mr-20 -mt-20" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">Estimated Budget</h3>
                  <p className="text-xs text-slate-300/60">Not Available</p>
                </div>
              </div>

              {/* Confidence Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 p-6 shadow-xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400/10 rounded-full -mr-20 -mt-20" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">Confidence</h3>
                  <p className="text-xs text-emerald-200/60">Not Available</p>
                </div>
              </div>
            </div>

            {/* Uploaded Documents Section */}
            <button
              onClick={() => router.push("/documents")}
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-5 text-sm font-semibold text-white transition-all hover:bg-blue-500 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Uploaded documents</span>
            </button>

            {/* Tasks Section */}
            <div className="rounded-2xl bg-[#0a0a0a] border border-zinc-900 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-zinc-100">Tasks</h2>
                <button className="text-xs text-amber-400 hover:text-amber-300 font-medium">
                  Gap analysis
                </button>
              </div>
              
              <p className="text-sm text-zinc-500 mb-6">No tasks created yet</p>
              
              <button className="w-full rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-zinc-100 transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-700">
                See all questions
              </button>
            </div>
          </div>
        </main>

        {/* Right Sidebar - AI Assistant */}
        <aside className="w-[400px] flex-shrink-0 bg-[#0a0a0a] border-l border-zinc-900 p-6 overflow-y-auto">
          <div className="h-full flex items-center justify-center">
            <AIAssistant />
          </div>
        </aside>
      </div>
    </ErrorBoundary>
  );
}

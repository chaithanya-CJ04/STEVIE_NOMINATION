"use client";

import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AIAssistant } from "@/components/AIAssistant";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <ErrorBoundary>
      <div className="flex h-screen w-full overflow-hidden bg-transparent">
        {/* Left Sidebar - Navigation */}
        <aside className="w-60 flex-shrink-0 border-r border-zinc-800/70 bg-black/40 backdrop-blur-sm p-6">
          <nav className="space-y-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-100 bg-zinc-900/80 rounded-lg border-l-4 border-amber-400"
              aria-current="page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </button>
            
            <button
              onClick={() => router.push("/documents")}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Docs
            </button>
            
            <button
              onClick={() => router.push("/chat")}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Gap Analysis
            </button>
            
            <button
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Master Requirements
            </button>
            
            <button
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Forecast
            </button>
            
            <button
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              Request for Proposal
            </button>
          </nav>
          
          <div className="mt-8 pt-6 border-t border-zinc-800/70">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Projects</span>
              <button className="text-xs text-amber-400 hover:text-amber-300 font-medium">
                See all
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-zinc-100 mb-1">Project Summary</h1>
              <p className="text-sm text-zinc-400">Track your nomination progress and insights</p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Estimated Time Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full -mr-16 -mt-16" />
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-blue-100 mb-1">Estimated time to finish</h3>
                  <p className="text-xs text-blue-200/70">Not Available</p>
                </div>
              </div>

              {/* Estimated Budget Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 p-6 shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/10 rounded-full -mr-16 -mt-16" />
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-slate-100 mb-1">Estimated Budget</h3>
                  <p className="text-xs text-slate-300/70">Not Available</p>
                </div>
              </div>

              {/* Confidence Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/20 rounded-full -mr-16 -mt-16" />
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-emerald-100 mb-1">Confidence</h3>
                  <p className="text-xs text-emerald-200/70">Not Available</p>
                </div>
              </div>
            </div>

            {/* Uploaded Documents Section */}
            <button
              onClick={() => router.push("/documents")}
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 text-sm font-medium text-white transition-all hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Uploaded documents</span>
            </button>

            {/* Tasks Section */}
            <div className="rounded-2xl border border-zinc-800/70 bg-black/40 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-zinc-100">Tasks</h2>
                <button className="text-sm text-amber-400 hover:text-amber-300 font-medium">
                  Gap analysis
                </button>
              </div>
              
              <p className="text-sm text-zinc-400 mb-6">No tasks created yet</p>
              
              <button className="w-full rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-zinc-100 transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-700">
                See all questions
              </button>
            </div>
          </div>
        </main>

        {/* Right Sidebar - AI Assistant */}
        <aside className="w-96 flex-shrink-0 border-l border-zinc-800/70 bg-black/40 backdrop-blur-sm p-6 overflow-y-auto">
          <AIAssistant />
        </aside>
      </div>
    </ErrorBoundary>
  );
}

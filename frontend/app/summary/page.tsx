"use client";

import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function SummaryPage() {
    const router = useRouter();

    return (
        <ErrorBoundary>
            <div className="fixed inset-0 flex flex-col h-screen w-screen overflow-hidden bg-black">
                {/* Top Bar */}
                <header className="w-full border-b border-zinc-800/60 bg-black/60 backdrop-blur-sm">
                    <div className="px-6 py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <img
                                src="/stevie-awards-banner.png"
                                alt="Stevie Awards Banner"
                                className="h-12 w-auto object-contain"
                            />
                            <span className="hidden sm:block text-base font-medium text-zinc-200 tracking-wide">
                                Stevie Awards Recommendation System
                            </span>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar - Navigation */}
                    <aside className="w-80 flex-shrink-0 bg-[#0a0a0a] p-8 flex flex-col border-r border-zinc-900">
                        <div className="flex-1">
                            <nav className="space-y-2">
                                <button
                                    onClick={() => router.push("/dashboard")}
                                    className="w-full flex items-center gap-4 px-5 py-4 text-base font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-xl transition-all"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 0 0 .707-1.707l-9-9a.999.999 0 0 0-1.414 0l-9 9A1 1 0 0 0 3 13zm7 7v-5h4v5h-4zm2-15.586 6 6V15l.001 5H16v-5c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v5H6v-9.586l6-6z" />
                                    </svg>
                                    Dashboard
                                </button>

                                <button
                                    onClick={() => router.push("/documents")}
                                    className="w-full flex items-center gap-4 px-5 py-4 text-base font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-xl transition-all"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.937 8.68c-.011-.032-.02-.063-.033-.094a.997.997 0 0 0-.196-.293l-6-6a.997.997 0 0 0-.293-.196c-.03-.014-.062-.022-.094-.033a.991.991 0 0 0-.259-.051C13.04 2.011 13.021 2 13 2H6c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9c0-.021-.011-.04-.013-.062a.99.99 0 0 0-.05-.258zM16.586 8H14V5.414L16.586 8zM6 20V4h6v5a1 1 0 0 0 1 1h5l.002 10H6z" />
                                    </svg>
                                    Upload Doc
                                </button>

                                <button
                                    onClick={() => router.push("/chat")}
                                    className="w-full flex items-center gap-4 px-5 py-4 text-base font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-xl transition-all"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 3v17a1 1 0 0 0 1 1h17v-2H5V3H3z" />
                                        <path d="M15.293 14.707a.999.999 0 0 0 1.414 0l5-5-1.414-1.414L16 12.586l-2.293-2.293a.999.999 0 0 0-1.414 0l-5 5 1.414 1.414L13 12.414l2.293 2.293z" />
                                    </svg>
                                    Gap Analysis
                                </button>

                                {/* Summary - Active */}
                                <button
                                    onClick={() => router.push("/summary")}
                                    className="w-full flex items-center gap-4 px-5 py-4 text-base font-semibold text-black bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl shadow-lg transition-all"
                                    aria-current="page"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z" />
                                        <path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z" />
                                    </svg>
                                    Summary
                                </button>

                                <button
                                    className="w-full flex items-center gap-4 px-5 py-4 text-base font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-xl transition-all"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="m21.707 11.293-9-9a.999.999 0 0 0-1.414 0l-9 9a.999.999 0 0 0 0 1.414l9 9a.999.999 0 0 0 1.414 0l9-9a.999.999 0 0 0 0-1.414zM13 19.586l-7-7 7-7 7 7-7 7z" />
                                        <path d="M12 8v6h2V8z" />
                                        <circle cx="13" cy="16" r="1" />
                                    </svg>
                                    Forecast
                                </button>

                                <button
                                    className="w-full flex items-center gap-4 px-5 py-4 text-base font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-xl transition-all"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023.479 0 .774-.242.774-.651 0-.366-.254-.586-.704-.586zm3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018.817.006 1.349-.444 1.349-1.396.006-.83-.479-1.268-1.255-1.268z" />
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9.498 16.19c-.309.29-.765.42-1.296.42a2.23 2.23 0 0 1-.308-.018v1.426H7v-3.936A7.558 7.558 0 0 1 8.219 14c.557 0 .953.106 1.22.319.254.202.426.533.426.923-.001.392-.131.723-.367.948zm3.807 1.355c-.42.349-1.059.515-1.84.515-.468 0-.799-.03-1.024-.06v-3.917A7.947 7.947 0 0 1 11.66 14c.757 0 1.249.136 1.633.426.415.308.675.799.675 1.504 0 .763-.279 1.29-.663 1.615zM17 14.77h-1.532v.911H16.9v.734h-1.432v1.604h-.906V14.03H17v.74zM14 9h-1V4l5 5h-4z" />
                                    </svg>
                                    Category Confirmation
                                </button>
                            </nav>
                        </div>

                        <div className="mt-auto pt-6 border-t border-zinc-800/70">
                            <button className="w-full px-5 py-3 text-sm font-medium text-zinc-400 border border-zinc-800 rounded-xl hover:bg-zinc-900/50 hover:text-zinc-200 transition-all">
                                Logout
                            </button>
                        </div>
                    </aside>

                    {/* Right Section - Summary Content */}
                    <main className="flex-1 bg-black p-8 overflow-y-auto">
                        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
                            {/* Page Title */}
                            <div>
                                <h1 className="text-2xl font-semibold text-zinc-100">Summary</h1>
                                <p className="text-sm text-zinc-400 mt-1">
                                    Overview of your Stevie Award nomination progress
                                </p>
                            </div>

                            {/* Summary Card */}
                            <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/60 p-6 flex flex-col gap-5">
                                {/* Card Header */}
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-zinc-100">
                                            Nomination Summary
                                        </h2>
                                        <p className="text-xs text-zinc-500 mt-1">
                                            Auto-generated from your uploaded documents and category selection
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-400/30 px-4 py-2 text-xs font-medium text-amber-300 transition-all hover:bg-amber-500/20 hover:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </button>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-zinc-800/60" />

                                {/* Empty / Placeholder State */}
                                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-2xl bg-amber-400/10 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-amber-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400/20 animate-pulse" />
                                    </div>
                                    <div className="max-w-sm">
                                        <p className="text-base font-semibold text-zinc-300 mb-1">
                                            No summary available yet
                                        </p>
                                        <p className="text-sm text-zinc-500">
                                            Upload your documents and complete the category selection to generate your nomination summary.
                                        </p>
                                    </div>
                                    <div className="flex gap-3 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => router.push("/documents")}
                                            className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-400/30 px-5 py-2.5 text-sm font-medium text-amber-300 transition-all hover:bg-amber-500/20 hover:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                                        >
                                            Upload Documents
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => router.push("/dashboard")}
                                            className="inline-flex items-center gap-2 rounded-full bg-zinc-800/50 border border-zinc-700/70 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-800 hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                                        >
                                            Go to Dashboard
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Export Row */}
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-full bg-zinc-800/50 border border-zinc-700/70 px-4 py-2 text-xs font-medium text-zinc-300 transition-all hover:bg-zinc-800 hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Export Markdown
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2 text-xs font-semibold text-black transition-all hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </ErrorBoundary>
    );
}

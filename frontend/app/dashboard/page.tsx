"use client";

import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AIAssistant } from "@/components/AIAssistant";

export default function DashboardPage() {
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
                className="w-full flex items-center gap-4 px-5 py-4 text-base font-semibold text-black bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl shadow-lg transition-all"
                aria-current="page"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 0 0 .707-1.707l-9-9a.999.999 0 0 0-1.414 0l-9 9A1 1 0 0 0 3 13zm7 7v-5h4v5h-4zm2-15.586 6 6V15l.001 5H16v-5c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v5H6v-9.586l6-6z"/>
                </svg>
                Dashboard
              </button>
              
              <button
                onClick={() => router.push("/documents")}
                className="w-full flex items-center gap-4 px-5 py-4 text-base font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-xl transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.937 8.68c-.011-.032-.02-.063-.033-.094a.997.997 0 0 0-.196-.293l-6-6a.997.997 0 0 0-.293-.196c-.03-.014-.062-.022-.094-.033a.991.991 0 0 0-.259-.051C13.04 2.011 13.021 2 13 2H6c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9c0-.021-.011-.04-.013-.062a.99.99 0 0 0-.05-.258zM16.586 8H14V5.414L16.586 8zM6 20V4h6v5a1 1 0 0 0 1 1h5l.002 10H6z"/>
                </svg>
                Documents
              </button>
              
              <button
                onClick={() => router.push("/chat")}
                className="w-full flex items-center gap-4 px-5 py-4 text-base font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-xl transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3v17a1 1 0 0 0 1 1h17v-2H5V3H3z"/>
                  <path d="M15.293 14.707a.999.999 0 0 0 1.414 0l5-5-1.414-1.414L16 12.586l-2.293-2.293a.999.999 0 0 0-1.414 0l-5 5 1.414 1.414L13 12.414l2.293 2.293z"/>
                </svg>
                Gap Analysis
              </button>
              
              <button
                className="w-full flex items-center gap-4 px-5 py-4 text-base font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-xl transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z"/>
                  <path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z"/>
                </svg>
                Master Requirements
              </button>
              
              <button
                className="w-full flex items-center gap-4 px-5 py-4 text-base font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-xl transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="m21.707 11.293-9-9a.999.999 0 0 0-1.414 0l-9 9a.999.999 0 0 0 0 1.414l9 9a.999.999 0 0 0 1.414 0l9-9a.999.999 0 0 0 0-1.414zM13 19.586l-7-7 7-7 7 7-7 7z"/>
                  <path d="M12 8v6h2V8z"/>
                  <circle cx="13" cy="16" r="1"/>
                </svg>
                Forecast
              </button>
              
              <button
                className="w-full flex items-center gap-4 px-5 py-4 text-base font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-xl transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023.479 0 .774-.242.774-.651 0-.366-.254-.586-.704-.586zm3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018.817.006 1.349-.444 1.349-1.396.006-.83-.479-1.268-1.255-1.268z"/>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9.498 16.19c-.309.29-.765.42-1.296.42a2.23 2.23 0 0 1-.308-.018v1.426H7v-3.936A7.558 7.558 0 0 1 8.219 14c.557 0 .953.106 1.22.319.254.202.426.533.426.923-.001.392-.131.723-.367.948zm3.807 1.355c-.42.349-1.059.515-1.84.515-.468 0-.799-.03-1.024-.06v-3.917A7.947 7.947 0 0 1 11.66 14c.757 0 1.249.136 1.633.426.415.308.675.799.675 1.504 0 .763-.279 1.29-.663 1.615zM17 14.77h-1.532v.911H16.9v.734h-1.432v1.604h-.906V14.03H17v.74zM14 9h-1V4l5 5h-4z"/>
                </svg>
                Request for Proposal
              </button>
            </nav>
          </div>
          
          <div className="mt-auto pt-6 border-t border-zinc-800/70">
            <button className="w-full px-5 py-3 text-sm font-medium text-zinc-400 border border-zinc-800 rounded-xl hover:bg-zinc-900/50 hover:text-zinc-200 transition-all">
              Logout
            </button>
          </div>
        </aside>

        {/* Right Section - AI Assistant (Full Width) */}
        <main className="flex-1 bg-black p-8 overflow-hidden flex items-center justify-center">
          <div className="w-full h-full max-w-4xl">
            <AIAssistant />
          </div>
        </main>
      </div>
      </div>
    </ErrorBoundary>
  );
}

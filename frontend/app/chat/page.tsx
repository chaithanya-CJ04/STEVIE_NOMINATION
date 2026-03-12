"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Sidebar } from "@/components/Sidebar";
import { ChatWindow } from "@/components/ChatWindow";

export default function ChatPage() {
  return (
    <ErrorBoundary>
      <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden bg-black text-white">
        {/* Modern Sidebar component handles its own responsive collapsibility */}
        <Sidebar />

        {/* Right Section - AI Assistant */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0c0c0c] border-t border-l border-zinc-900 rounded-tl-2xl shadow-inner overflow-hidden relative isolate">
          {/* Subtle premium background glow */}
          <div className="absolute top-[-10%] right-[-10%] z-[-1] w-[500px] h-[500px] rounded-full bg-[#bd9602]/5 blur-[120px] pointer-events-none" />
          <ChatWindow />
        </main>
      </div>
    </ErrorBoundary>
  );
}

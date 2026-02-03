"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard - chat functionality is now in dashboard
    router.replace("/dashboard");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center text-zinc-50">
      <p className="text-sm text-zinc-400">Redirecting to dashboard...</p>
    </main>
  );
}

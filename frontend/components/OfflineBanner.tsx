"use client";

import { useOnlineStatus } from "@/lib/hooks";
import { useEffect, useState } from "react";

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isOnline) return null;

  return (
    <div
      role="alert"
      className="fixed top-0 left-0 right-0 z-50 bg-red-500/90 px-4 py-2 text-center text-sm font-medium text-white backdrop-blur-sm"
    >
      ⚠️ You&apos;re offline. Some features may not work.
    </div>
  );
}

"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useKeyboardShortcut } from "@/lib/hooks";
import { Navbar } from "@/components/Navbar";

interface SiteShellProps {
  children: ReactNode;
}

export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const showChrome = pathname !== "/auth";

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      router.replace("/auth");
    }
  };

  useKeyboardShortcut("l", handleLogout, { shift: true });

  return (
    <div className="min-h-screen noise-bg vignette relative"
      style={{
        background: "linear-gradient(180deg, #0A0A0A 0%, #0f0f0f 30%, #0c0c0c 60%, #0A0A0A 100%)",
      }}
    >
      {showChrome && <Navbar />}

      <main className="relative z-10" role="main">
        {children}
      </main>
    </div>
  );
}

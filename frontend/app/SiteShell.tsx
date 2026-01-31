"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface SiteShellProps {
  children: ReactNode;
}

export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const showHeader = pathname !== "/auth";

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-zinc-950 to-black">
      {showHeader && (
        <header className="w-full border-b border-zinc-800/60 bg-black/60 backdrop-blur-sm">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-3">
            <Image
              src="/stevie-awards-banner.png"
              alt="Stevie Awards Banner"
              width={140}
              height={48}
              className="h-12 w-auto object-contain"
              priority
              unoptimized
            />
            <span className="text-sm font-medium text-zinc-200 tracking-wide">
              Stevie Awards Recommendation System
            </span>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-5xl px-4 pb-10 pt-6">{children}</main>
    </div>
  );
}

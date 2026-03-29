"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "DASHBOARD", href: "/studio/dashboard", icon: "📊" },
  { label: "MEMBERS", href: "/studio/members", icon: "👥" },
  { label: "ATTENDANCE", href: "/studio/attendance", icon: "✅" },
  { label: "PAYMENTS", href: "/studio/payments", icon: "💳" },
  { label: "SETTINGS", href: "/studio/settings", icon: "⚙️" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#FAFAF5]">
      {/* Neo-Brutalist Sidebar */}
      <aside className="hidden w-64 flex-col border-r-2 border-black bg-[#0047A0] shadow-[4px_0px_0px_0px_#000000] md:flex">
        <div className="border-b-2 border-black/20 px-6 py-6">
          <h1 className="font-[var(--font-heading)] text-2xl font-black uppercase italic tracking-tighter text-white">
            TKD-Hub
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
            Studio Manager
          </p>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-100",
                  isActive
                    ? "translate-x-1 border-2 border-black bg-[#CD2E3A] text-white shadow-[2px_2px_0px_0px_#000000]"
                    : "border-2 border-transparent text-white/80 hover:border-black hover:bg-[#CD2E3A] hover:text-white hover:shadow-[2px_2px_0px_0px_#000000]",
                  "active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                )}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Neo-Brutalist Top Bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b-2 border-black bg-[#FAFAF5] px-8">
          <h2 className="font-[var(--font-heading)] text-xl font-black uppercase italic text-[#CD2E3A]">
            {navItems.find((item) => pathname?.startsWith(item.href))?.label ??
              "DASHBOARD"}
          </h2>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

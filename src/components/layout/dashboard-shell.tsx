"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/studio/dashboard", icon: "📊" },
  { label: "Members", href: "/studio/members", icon: "👥" },
  { label: "Attendance", href: "/studio/attendance", icon: "✅" },
  { label: "Payments", href: "/studio/payments", icon: "💳" },
  { label: "Settings", href: "/studio/settings", icon: "⚙️" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Link href="/studio/dashboard" className="text-xl font-bold">
            TKD-Hub
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === item.href
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b px-6">
          <h2 className="text-lg font-semibold">
            {navItems.find((item) => pathname?.startsWith(item.href))?.label ??
              "Dashboard"}
          </h2>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

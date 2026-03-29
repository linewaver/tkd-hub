"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";

export default function DashboardPage() {
  const [studioId, setStudioId] = useState<string | null>(null);

  const studioQuery = trpc.studio.getFirst.useQuery(undefined, {
    enabled: !studioId,
  });

  useEffect(() => {
    if (studioQuery.data && !studioId) setStudioId(studioQuery.data.id);
  }, [studioQuery.data, studioId]);

  const dashboardQuery = trpc.studio.dashboard.useQuery(
    { studioId: studioId! },
    { enabled: !!studioId }
  );

  const studio = studioQuery.data;
  const stats = dashboardQuery.data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[var(--font-heading)] text-3xl font-black uppercase italic tracking-tight">
          {studio?.name ?? "Dashboard"}
        </h1>
        {studio && (
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">
            {studio.city}, {studio.state}
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Members"
          value={stats?.totalMembers ?? "-"}
          href="/studio/members"
          color="text-black"
        />
        <StatCard
          title="Active Members"
          value={stats?.activeMembers ?? "-"}
          href="/studio/members"
          color="text-[#0047A0]"
        />
        <StatCard
          title="Attendance"
          value={stats?.todayAttendance ?? "-"}
          href="/studio/attendance"
          color="text-[#814508]"
        />
        <StatCard
          title="Overdue"
          value={stats?.overduePayments ?? "-"}
          href="/studio/payments"
          color="text-[#CD2E3A]"
          highlight={!!stats?.overduePayments && stats.overduePayments > 0}
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  href,
  color,
  highlight = false,
}: {
  title: string;
  value: string | number;
  href: string;
  color: string;
  highlight?: boolean;
}) {
  return (
    <Link href={href}>
      <div className="cursor-pointer border-2 border-black bg-white p-6 neo-shadow transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
        <div className="flex items-start justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-black/50">
            {title}
          </span>
        </div>
        <p className={`mt-4 text-5xl font-black ${color}`}>
          {typeof value === "number"
            ? String(value).padStart(2, "0")
            : value}
        </p>
      </div>
    </Link>
  );
}

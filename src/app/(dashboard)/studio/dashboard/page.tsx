"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {studio?.name ?? "Dashboard"}
        </h1>
        {studio && (
          <p className="text-muted-foreground">
            {studio.city}, {studio.state}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Members"
          value={stats?.totalMembers ?? "-"}
          href="/studio/members"
        />
        <DashboardCard
          title="Active Members"
          value={stats?.activeMembers ?? "-"}
          href="/studio/members"
        />
        <DashboardCard
          title="Today's Attendance"
          value={stats?.todayAttendance ?? "-"}
          href="/studio/attendance"
        />
        <DashboardCard
          title="Overdue Payments"
          value={stats?.overduePayments ?? "-"}
          href="/studio/payments"
          highlight={!!stats?.overduePayments && stats.overduePayments > 0}
        />
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  href,
  highlight = false,
}: {
  title: string;
  value: string | number;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link href={href}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-3xl font-bold ${highlight ? "text-destructive" : ""}`}
          >
            {value}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

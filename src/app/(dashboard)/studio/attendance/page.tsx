"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { getBeltInfo } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AttendancePage() {
  const [studioId, setStudioId] = useState<string | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  const studioQuery = trpc.studio.getFirst.useQuery(undefined, {
    enabled: !studioId,
  });

  useEffect(() => {
    if (studioQuery.data && !studioId) setStudioId(studioQuery.data.id);
  }, [studioQuery.data, studioId]);

  const attendanceQuery = trpc.attendance.listByDate.useQuery(
    { studioId: studioId!, date },
    { enabled: !!studioId }
  );

  const membersQuery = trpc.member.list.useQuery(
    { studioId: studioId!, status: "ACTIVE" },
    { enabled: !!studioId }
  );

  const utils = trpc.useUtils();

  const checkIn = trpc.attendance.checkIn.useMutation({
    onSuccess: () => utils.attendance.listByDate.invalidate(),
  });

  const checkOut = trpc.attendance.checkOut.useMutation({
    onSuccess: () => utils.attendance.listByDate.invalidate(),
  });

  const attendedIds = new Set(
    attendanceQuery.data?.map((a) => a.memberId) ?? []
  );

  const notCheckedIn =
    membersQuery.data?.filter((m) => !attendedIds.has(m.id)) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-44"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Checked In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {attendanceQuery.data?.length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Not Checked In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{notCheckedIn.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {membersQuery.data?.length ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Check-in */}
      {notCheckedIn.length > 0 && date === new Date().toISOString().split("T")[0] && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Check-in</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {notCheckedIn.map((member) => {
                const belt = getBeltInfo(member.beltRank);
                return (
                  <Button
                    key={member.id}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      checkIn.mutate({
                        memberId: member.id,
                        studioId: studioId!,
                      })
                    }
                    disabled={checkIn.isPending}
                    className="gap-2"
                  >
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${belt.color.split(" ")[0]}`}
                    />
                    {member.firstName} {member.lastName}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Log */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Log</CardTitle>
        </CardHeader>
        <CardContent>
          {attendanceQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : !attendanceQuery.data?.length ? (
            <p className="text-sm text-muted-foreground">
              No attendance records for this date.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Belt</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceQuery.data.map((att) => {
                  const belt = getBeltInfo(att.member.beltRank);
                  return (
                    <TableRow key={att.id}>
                      <TableCell className="font-medium">
                        {att.member.firstName} {att.member.lastName}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${belt.color}`}
                        >
                          {belt.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        {att.checkInTime
                          ? new Date(att.checkInTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {att.checkOutTime
                          ? new Date(att.checkOutTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            att.status === "PRESENT" ? "default" : "secondary"
                          }
                        >
                          {att.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {!att.checkOutTime && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => checkOut.mutate({ id: att.id })}
                            disabled={checkOut.isPending}
                          >
                            Check Out
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

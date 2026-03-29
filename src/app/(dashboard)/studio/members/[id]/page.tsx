"use client";

import { use } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { getBeltInfo } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const memberQuery = trpc.member.get.useQuery({ id });

  if (memberQuery.isLoading) {
    return <div className="p-6 text-muted-foreground">Loading...</div>;
  }

  const member = memberQuery.data;
  if (!member) {
    return <div className="p-6 text-muted-foreground">Member not found.</div>;
  }

  const belt = getBeltInfo(member.beltRank);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/studio/members">
          <Button variant="outline" size="sm">
            &larr; Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          {member.firstName} {member.lastName}
        </h1>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${belt.color}`}
        >
          {belt.label}
        </span>
        <Badge variant={member.status === "ACTIVE" ? "default" : "secondary"}>
          {member.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Email" value={member.email || "-"} />
            <InfoRow label="Phone" value={member.phone || "-"} />
            <InfoRow
              label="Date of Birth"
              value={
                member.dateOfBirth
                  ? new Date(member.dateOfBirth).toLocaleDateString()
                  : "-"
              }
            />
            <InfoRow
              label="Enrolled"
              value={new Date(member.enrollmentDate).toLocaleDateString()}
            />
            <Separator />
            <InfoRow
              label="Emergency Contact"
              value={member.emergencyContactName || "-"}
            />
            <InfoRow
              label="Emergency Phone"
              value={member.emergencyContactPhone || "-"}
            />
          </CardContent>
        </Card>

        {/* Belt Promotion History */}
        <Card>
          <CardHeader>
            <CardTitle>Belt Promotions</CardTitle>
          </CardHeader>
          <CardContent>
            {!member.beltPromotions?.length ? (
              <p className="text-sm text-muted-foreground">
                No promotion records yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {member.beltPromotions.map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell>
                        {new Date(promo.testDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getBeltInfo(promo.fromBelt).label}</TableCell>
                      <TableCell>{getBeltInfo(promo.toBelt).label}</TableCell>
                      <TableCell>
                        <Badge
                          variant={promo.passed ? "default" : "destructive"}
                        >
                          {promo.passed ? "Passed" : "Failed"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          {!member.attendances?.length ? (
            <p className="text-sm text-muted-foreground">
              No attendance records yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {member.attendances.map((att) => (
                  <TableRow key={att.id}>
                    <TableCell>
                      {new Date(att.date).toLocaleDateString()}
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {!member.payments?.length ? (
            <p className="text-sm text-muted-foreground">
              No payment records yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {member.payments.map((pay) => (
                  <TableRow key={pay.id}>
                    <TableCell>{pay.description || "-"}</TableCell>
                    <TableCell>${pay.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {pay.dueDate
                        ? new Date(pay.dueDate).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          pay.status === "PAID" ? "default" : "destructive"
                        }
                      >
                        {pay.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

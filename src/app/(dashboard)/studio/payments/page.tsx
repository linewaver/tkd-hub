"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PaymentsPage() {
  const [studioId, setStudioId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const studioQuery = trpc.studio.getFirst.useQuery(undefined, {
    enabled: !studioId,
  });

  useEffect(() => {
    if (studioQuery.data && !studioId) setStudioId(studioQuery.data.id);
  }, [studioQuery.data, studioId]);

  const paymentsQuery = trpc.payment.list.useQuery(
    {
      studioId: studioId!,
      ...(statusFilter !== "ALL" && {
        status: statusFilter as "PAID" | "UNPAID" | "OVERDUE" | "REFUNDED",
      }),
    },
    { enabled: !!studioId }
  );

  const overdueQuery = trpc.payment.getOverdue.useQuery(
    { studioId: studioId! },
    { enabled: !!studioId }
  );

  const utils = trpc.useUtils();

  const markPaid = trpc.payment.markPaid.useMutation({
    onSuccess: () => {
      utils.payment.list.invalidate();
      utils.payment.getOverdue.invalidate();
      utils.studio.dashboard.invalidate();
    },
  });

  const totalPaid =
    paymentsQuery.data
      ?.filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + p.amount, 0) ?? 0;

  const totalUnpaid =
    paymentsQuery.data
      ?.filter((p) => p.status === "UNPAID")
      .reduce((sum, p) => sum + p.amount, 0) ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Payments</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Collected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              ${totalPaid.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Outstanding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">
              ${totalUnpaid.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">
              {overdueQuery.data?.length ?? 0} invoices
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "ALL")}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="UNPAID">Unpaid</SelectItem>
            <SelectItem value="OVERDUE">Overdue</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="secondary">
          {paymentsQuery.data?.length ?? 0} records
        </Badge>
      </div>

      <Card>
        <CardContent className="p-0">
          {paymentsQuery.isLoading ? (
            <div className="p-6 text-center text-muted-foreground">
              Loading...
            </div>
          ) : !paymentsQuery.data?.length ? (
            <div className="p-6 text-center text-muted-foreground">
              No payment records found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentsQuery.data.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.member.firstName} {payment.member.lastName}
                    </TableCell>
                    <TableCell>{payment.description || "-"}</TableCell>
                    <TableCell>${payment.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {payment.dueDate
                        ? new Date(payment.dueDate).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payment.status === "PAID"
                            ? "default"
                            : payment.status === "UNPAID"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payment.status === "UNPAID" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markPaid.mutate({ id: payment.id })}
                          disabled={markPaid.isPending}
                        >
                          Mark Paid
                        </Button>
                      )}
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

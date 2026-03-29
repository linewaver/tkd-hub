"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

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
    <div className="space-y-8">
      <h1 className="font-[var(--font-heading)] text-3xl font-black uppercase italic tracking-tight">
        Payments
      </h1>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="border-2 border-black bg-white p-6 neo-shadow">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">
            Total Collected
          </p>
          <p className="mt-2 text-4xl font-black text-[#2E7D32]">
            ${totalPaid.toFixed(2)}
          </p>
        </div>
        <div className="border-2 border-black bg-white p-6 neo-shadow">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">
            Outstanding
          </p>
          <p className="mt-2 text-4xl font-black text-[#F4A261]">
            ${totalUnpaid.toFixed(2)}
          </p>
        </div>
        <div className="border-2 border-black bg-white p-6 neo-shadow">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">
            Overdue
          </p>
          <p className="mt-2 text-4xl font-black text-[#CD2E3A]">
            {overdueQuery.data?.length ?? 0} invoices
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border-2 border-black bg-white px-4 py-3 text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#0047A0]"
        >
          <option value="ALL">All Status</option>
          <option value="PAID">Paid</option>
          <option value="UNPAID">Unpaid</option>
          <option value="OVERDUE">Overdue</option>
          <option value="REFUNDED">Refunded</option>
        </select>
        <span className="border-2 border-black bg-[#0047A0] px-4 py-3 text-xs font-black uppercase text-white neo-shadow-sm">
          {paymentsQuery.data?.length ?? 0} Records
        </span>
      </div>

      <div className="border-2 border-black bg-white neo-shadow">
        {paymentsQuery.isLoading ? (
          <div className="p-6 text-center text-sm font-bold uppercase text-black/40">
            Loading...
          </div>
        ) : !paymentsQuery.data?.length ? (
          <div className="p-6 text-center text-sm font-bold uppercase text-black/40">
            No payment records found.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-black bg-[#FAFAF5]">
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-black/60">Member</th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-black/60">Description</th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-black/60">Amount</th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-black/60">Due Date</th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-black/60">Status</th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-black/60"></th>
              </tr>
            </thead>
            <tbody>
              {paymentsQuery.data.map((payment) => (
                <tr key={payment.id} className="border-b border-black/10 hover:bg-[#FAFAF5]">
                  <td className="px-4 py-3 font-bold">
                    {payment.member.firstName} {payment.member.lastName}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium">{payment.description || "-"}</td>
                  <td className="px-4 py-3 text-sm font-black">${payment.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-xs font-medium">
                    {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block border-2 border-black px-3 py-1 text-[10px] font-black uppercase ${
                        payment.status === "PAID"
                          ? "bg-[#2E7D32] text-white"
                          : payment.status === "UNPAID"
                            ? "bg-[#CD2E3A] text-white"
                            : "bg-gray-300 text-black"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {payment.status === "UNPAID" && (
                      <button
                        onClick={() => markPaid.mutate({ id: payment.id })}
                        disabled={markPaid.isPending}
                        className="border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase neo-shadow-sm transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

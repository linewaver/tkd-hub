"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { getBeltInfo } from "@/lib/constants";

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-[var(--font-heading)] text-3xl font-black uppercase italic tracking-tight">
          Attendance
        </h1>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border-2 border-black bg-white px-4 py-2 text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#0047A0]"
        />
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="border-2 border-black bg-white p-6 neo-shadow">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">
            Checked In
          </p>
          <p className="mt-2 text-5xl font-black text-[#2E7D32]">
            {String(attendanceQuery.data?.length ?? 0).padStart(2, "0")}
          </p>
        </div>
        <div className="border-2 border-black bg-white p-6 neo-shadow">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">
            Not Checked In
          </p>
          <p className="mt-2 text-5xl font-black text-[#CD2E3A]">
            {String(notCheckedIn.length).padStart(2, "0")}
          </p>
        </div>
        <div className="border-2 border-black bg-white p-6 neo-shadow">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">
            Total Active
          </p>
          <p className="mt-2 text-5xl font-black text-[#0047A0]">
            {String(membersQuery.data?.length ?? 0).padStart(2, "0")}
          </p>
        </div>
      </div>

      {/* Quick Check-in */}
      {notCheckedIn.length > 0 && date === new Date().toISOString().split("T")[0] && (
        <div className="border-2 border-black bg-white neo-shadow">
          <div className="border-b-2 border-black bg-[#0047A0] p-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick Check-in
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 p-6">
            {notCheckedIn.map((member) => {
              const belt = getBeltInfo(member.beltRank);
              const colorMap: Record<string, string> = {
                WHITE: "bg-gray-100",
                YELLOW: "bg-[#F4A261]",
                GREEN: "bg-[#2E7D32]",
                BLUE: "bg-[#0047A0]",
                RED: "bg-[#CD2E3A]",
                BLACK_1DAN: "bg-black",
                BLACK_2DAN: "bg-black",
              };
              return (
                <button
                  key={member.id}
                  onClick={() =>
                    checkIn.mutate({ memberId: member.id, studioId: studioId! })
                  }
                  disabled={checkIn.isPending}
                  className="flex items-center gap-2 border-2 border-black bg-white px-4 py-2 text-xs font-bold uppercase neo-shadow-sm transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1"
                >
                  <span
                    className={`inline-block h-3 w-3 border border-black ${colorMap[member.beltRank] ?? "bg-gray-200"}`}
                  />
                  {member.firstName} {member.lastName}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Attendance Log */}
      <div className="border-2 border-black bg-white neo-shadow">
        <div className="border-b-2 border-black bg-[#CD2E3A] p-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Attendance Log
          </h3>
        </div>
        {attendanceQuery.isLoading ? (
          <div className="p-6 text-center text-sm font-bold uppercase text-black/40">
            Loading...
          </div>
        ) : !attendanceQuery.data?.length ? (
          <div className="p-6 text-center text-sm font-bold uppercase text-black/40">
            No attendance records for this date.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-black bg-[#FAFAF5]">
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-black/60">Name</th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-black/60">Belt</th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-black/60">Check In</th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-black/60">Check Out</th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-black/60">Status</th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-black/60"></th>
              </tr>
            </thead>
            <tbody>
              {attendanceQuery.data.map((att) => {
                const belt = getBeltInfo(att.member.beltRank);
                const colorMap: Record<string, string> = {
                  WHITE: "bg-white text-black",
                  YELLOW: "bg-[#F4A261] text-black",
                  GREEN: "bg-[#2E7D32] text-white",
                  BLUE: "bg-[#0047A0] text-white",
                  RED: "bg-[#CD2E3A] text-white",
                  BLACK_1DAN: "bg-black text-white",
                  BLACK_2DAN: "bg-black text-white",
                };
                return (
                  <tr key={att.id} className="border-b border-black/10 hover:bg-[#FAFAF5]">
                    <td className="px-4 py-3 font-bold">{att.member.firstName} {att.member.lastName}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase ${colorMap[att.member.beltRank] ?? "bg-gray-200"}`}>
                        {belt.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-bold">
                      {att.checkInTime ? new Date(att.checkInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}
                    </td>
                    <td className="px-4 py-3 text-xs font-bold">
                      {att.checkOutTime ? new Date(att.checkOutTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase ${att.status === "PRESENT" ? "bg-[#2E7D32] text-white" : "bg-[#F4A261] text-black"}`}>
                        {att.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {!att.checkOutTime && (
                        <button
                          onClick={() => checkOut.mutate({ id: att.id })}
                          disabled={checkOut.isPending}
                          className="border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase neo-shadow-sm transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                        >
                          Check Out
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

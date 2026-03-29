"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { getBeltInfo } from "@/lib/constants";
import { AddMemberDialog } from "@/components/domain/add-member-dialog";

export default function MembersPage() {
  const [studioId, setStudioId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const studioQuery = trpc.studio.getFirst.useQuery(undefined, {
    enabled: !studioId,
  });

  useEffect(() => {
    if (studioQuery.data && !studioId) setStudioId(studioQuery.data.id);
  }, [studioQuery.data, studioId]);

  const membersQuery = trpc.member.list.useQuery(
    { studioId: studioId!, search: search || undefined },
    { enabled: !!studioId }
  );

  const utils = trpc.useUtils();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-[var(--font-heading)] text-3xl font-black uppercase italic tracking-tight">
          Members
        </h1>
        <button
          onClick={() => setDialogOpen(true)}
          className="border-2 border-black bg-[#CD2E3A] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white neo-shadow transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1"
        >
          + Add Member
        </button>
      </div>

      <div className="flex items-center gap-4">
        <input
          placeholder="SEARCH MEMBERS BY NAME, EMAIL OR PHONE..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border-2 border-black bg-white px-4 py-3 text-xs font-bold uppercase placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[#0047A0]"
        />
        <span className="border-2 border-black bg-[#0047A0] px-4 py-3 text-xs font-black uppercase text-white neo-shadow-sm">
          {membersQuery.data?.length ?? 0} Members
        </span>
      </div>

      <div className="border-2 border-black bg-white neo-shadow">
        {membersQuery.isLoading ? (
          <div className="p-6 text-center text-sm font-bold uppercase text-black/40">
            Loading members...
          </div>
        ) : !membersQuery.data?.length ? (
          <div className="p-6 text-center text-sm font-bold uppercase text-black/40">
            No members found. Add your first member.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-black bg-[#FAFAF5]">
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-black/60">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-black/60">
                  Belt
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-black/60">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-black/60">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-black/60">
                  Phone
                </th>
              </tr>
            </thead>
            <tbody>
              {membersQuery.data.map((member) => {
                const belt = getBeltInfo(member.beltRank);
                return (
                  <tr
                    key={member.id}
                    className="border-b border-black/10 transition-colors hover:bg-[#FAFAF5]"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={`/studio/members/${member.id}`}
                        className="font-bold text-[#0047A0] hover:underline"
                      >
                        {member.firstName} {member.lastName}
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <BeltBadge rank={member.beltRank} label={belt.label} />
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block border-2 border-black px-3 py-1 text-[10px] font-black uppercase ${
                          member.status === "ACTIVE"
                            ? "bg-[#2E7D32] text-white"
                            : "bg-gray-300 text-black"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs font-medium text-black/60">
                      {member.email || "-"}
                    </td>
                    <td className="px-4 py-4 text-xs font-medium text-black/60">
                      {member.phone || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {studioId && (
        <AddMemberDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          studioId={studioId}
          onSuccess={() => {
            utils.member.list.invalidate();
            setDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}

function BeltBadge({ rank, label }: { rank: string; label: string }) {
  const colorMap: Record<string, string> = {
    WHITE: "bg-white text-black",
    YELLOW: "bg-[#F4A261] text-black",
    GREEN: "bg-[#2E7D32] text-white",
    BLUE: "bg-[#0047A0] text-white",
    RED: "bg-[#CD2E3A] text-white",
    BLACK_1DAN: "bg-black text-white",
    BLACK_2DAN: "bg-black text-white",
    BLACK_3DAN: "bg-black text-white",
  };
  return (
    <span
      className={`inline-block border-2 border-black px-3 py-1 text-[10px] font-black uppercase ${colorMap[rank] ?? "bg-gray-200 text-black"}`}
    >
      {label}
    </span>
  );
}

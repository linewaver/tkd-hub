"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { getBeltInfo } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddMemberDialog } from "@/components/domain/add-member-dialog";

export default function MembersPage() {
  const [studioId, setStudioId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const studioQuery = trpc.studio.getFirst.useQuery(undefined, {
    enabled: !studioId,
  });

  useEffect(() => {
    if (studioQuery.data && !studioId) {
      setStudioId(studioQuery.data.id);
    }
  }, [studioQuery.data, studioId]);

  const membersQuery = trpc.member.list.useQuery(
    { studioId: studioId!, search: search || undefined },
    { enabled: !!studioId }
  );

  const utils = trpc.useUtils();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Members</h1>
        <Button onClick={() => setDialogOpen(true)}>Add Member</Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Badge variant="secondary">
          {membersQuery.data?.length ?? 0} members
        </Badge>
      </div>

      <div className="rounded-xl border bg-card">
        {membersQuery.isLoading ? (
          <div className="p-6 text-center text-muted-foreground">
            Loading members...
          </div>
        ) : !membersQuery.data?.length ? (
          <div className="p-6 text-center text-muted-foreground">
            No members found. Add your first member to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Belt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membersQuery.data.map((member) => {
                const belt = getBeltInfo(member.beltRank);
                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <Link
                        href={`/studio/members/${member.id}`}
                        className="font-medium hover:underline"
                      >
                        {member.firstName} {member.lastName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${belt.color}`}
                      >
                        {belt.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          member.status === "ACTIVE" ? "default" : "secondary"
                        }
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.email || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.phone || "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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

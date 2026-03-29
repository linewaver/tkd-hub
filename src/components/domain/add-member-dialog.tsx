"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { BELT_RANKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const memberSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").or(z.literal("")).optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  beltRank: z.string(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  notes: z.string().optional(),
});

type MemberForm = z.infer<typeof memberSchema>;

export function AddMemberDialog({
  open,
  onOpenChange,
  studioId,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studioId: string;
  onSuccess: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MemberForm>({
    resolver: zodResolver(memberSchema),
    defaultValues: { beltRank: "WHITE" },
  });

  const createMember = trpc.member.create.useMutation({
    onSuccess: () => {
      reset();
      onSuccess();
    },
  });

  const onSubmit = (data: MemberForm) => {
    createMember.mutate({ ...data, studioId });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
            </div>
            <div>
              <Label>Belt Rank</Label>
              <Select
                value={watch("beltRank")}
                onValueChange={(val) => setValue("beltRank", val ?? "WHITE")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BELT_RANKS.map((belt) => (
                    <SelectItem key={belt.value} value={belt.value}>
                      {belt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergencyContactName">Emergency Contact</Label>
              <Input
                id="emergencyContactName"
                {...register("emergencyContactName")}
                placeholder="Contact name"
              />
            </div>
            <div>
              <Label htmlFor="emergencyContactPhone">Emergency Phone</Label>
              <Input
                id="emergencyContactPhone"
                {...register("emergencyContactPhone")}
                placeholder="Phone number"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Additional notes..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMember.isPending}>
              {createMember.isPending ? "Adding..." : "Add Member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

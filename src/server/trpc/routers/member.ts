import { z } from "zod";
import { router, publicProcedure } from "../init";

export const memberRouter = router({
  list: publicProcedure
    .input(
      z.object({
        studioId: z.string(),
        status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.member.findMany({
        where: {
          studioId: input.studioId,
          ...(input.status && { status: input.status }),
          ...(input.search && {
            OR: [
              { firstName: { contains: input.search } },
              { lastName: { contains: input.search } },
              { email: { contains: input.search } },
            ],
          }),
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.member.findUnique({
        where: { id: input.id },
        include: {
          attendances: { orderBy: { date: "desc" }, take: 10 },
          beltPromotions: { orderBy: { testDate: "desc" } },
          payments: { orderBy: { createdAt: "desc" }, take: 10 },
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        studioId: z.string(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        dateOfBirth: z.string().optional(),
        email: z.string().email().optional().or(z.literal("")),
        phone: z.string().optional(),
        beltRank: z.string().default("WHITE"),
        emergencyContactName: z.string().optional(),
        emergencyContactPhone: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { dateOfBirth, ...rest } = input;
      return ctx.db.member.create({
        data: {
          ...rest,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        dateOfBirth: z.string().optional(),
        email: z.string().email().optional().or(z.literal("")),
        phone: z.string().optional(),
        beltRank: z.string().optional(),
        status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
        emergencyContactName: z.string().optional(),
        emergencyContactPhone: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, dateOfBirth, ...rest } = input;
      return ctx.db.member.update({
        where: { id },
        data: {
          ...rest,
          ...(dateOfBirth !== undefined && {
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          }),
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.member.update({
        where: { id: input.id },
        data: { status: "INACTIVE" },
      });
    }),
});

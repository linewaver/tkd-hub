import { z } from "zod";
import { router, publicProcedure } from "../init";

export const attendanceRouter = router({
  listByDate: publicProcedure
    .input(
      z.object({
        studioId: z.string(),
        date: z.string(), // ISO date string YYYY-MM-DD
      })
    )
    .query(async ({ ctx, input }) => {
      const startOfDay = new Date(input.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(input.date);
      endOfDay.setHours(23, 59, 59, 999);

      return ctx.db.attendance.findMany({
        where: {
          studioId: input.studioId,
          date: { gte: startOfDay, lte: endOfDay },
        },
        include: { member: true },
        orderBy: { checkInTime: "desc" },
      });
    }),

  listByMember: publicProcedure
    .input(
      z.object({
        memberId: z.string(),
        limit: z.number().min(1).max(100).default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.attendance.findMany({
        where: { memberId: input.memberId },
        orderBy: { date: "desc" },
        take: input.limit,
      });
    }),

  checkIn: publicProcedure
    .input(
      z.object({
        memberId: z.string(),
        studioId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const now = new Date();
      return ctx.db.attendance.create({
        data: {
          memberId: input.memberId,
          studioId: input.studioId,
          date: now,
          checkInTime: now,
          status: "PRESENT",
        },
      });
    }),

  checkOut: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.attendance.update({
        where: { id: input.id },
        data: { checkOutTime: new Date() },
      });
    }),
});

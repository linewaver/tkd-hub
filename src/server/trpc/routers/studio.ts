import { z } from "zod";
import { router, publicProcedure } from "../init";

export const studioRouter = router({
  // Get first studio (dev helper - will be replaced with auth)
  getFirst: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.studio.findFirst({ orderBy: { createdAt: "asc" } });
  }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.studio.findUnique({
        where: { id: input.id },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        country: z.string().default("US"),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        timezone: z.string().default("America/New_York"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.studio.create({ data: input });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        timezone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.studio.update({ where: { id }, data });
    }),

  dashboard: publicProcedure
    .input(z.object({ studioId: z.string() }))
    .query(async ({ ctx, input }) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const [totalMembers, activeMembers, todayAttendance, overduePayments] =
        await Promise.all([
          ctx.db.member.count({ where: { studioId: input.studioId } }),
          ctx.db.member.count({
            where: { studioId: input.studioId, status: "ACTIVE" },
          }),
          ctx.db.attendance.count({
            where: {
              studioId: input.studioId,
              date: { gte: today, lte: endOfDay },
            },
          }),
          ctx.db.payment.count({
            where: {
              studioId: input.studioId,
              status: "UNPAID",
              dueDate: { lt: new Date() },
            },
          }),
        ]);

      return {
        totalMembers,
        activeMembers,
        todayAttendance,
        overduePayments,
      };
    }),
});

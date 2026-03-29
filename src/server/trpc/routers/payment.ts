import { z } from "zod";
import { router, publicProcedure } from "../init";

export const paymentRouter = router({
  list: publicProcedure
    .input(
      z.object({
        studioId: z.string(),
        status: z.enum(["PAID", "UNPAID", "OVERDUE", "REFUNDED"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.payment.findMany({
        where: {
          studioId: input.studioId,
          ...(input.status && { status: input.status }),
        },
        include: { member: true },
        orderBy: { createdAt: "desc" },
      });
    }),

  getOverdue: publicProcedure
    .input(z.object({ studioId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.payment.findMany({
        where: {
          studioId: input.studioId,
          status: "UNPAID",
          dueDate: { lt: new Date() },
        },
        include: { member: true },
        orderBy: { dueDate: "asc" },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        memberId: z.string(),
        studioId: z.string(),
        amount: z.number().positive(),
        currency: z.string().default("USD"),
        description: z.string().optional(),
        dueDate: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { dueDate, ...rest } = input;
      return ctx.db.payment.create({
        data: {
          ...rest,
          dueDate: dueDate ? new Date(dueDate) : null,
        },
      });
    }),

  markPaid: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.payment.update({
        where: { id: input.id },
        data: { status: "PAID", paidDate: new Date() },
      });
    }),
});

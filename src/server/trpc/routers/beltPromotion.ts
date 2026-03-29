import { z } from "zod";
import { router, publicProcedure } from "../init";

export const beltPromotionRouter = router({
  listByMember: publicProcedure
    .input(z.object({ memberId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.beltPromotion.findMany({
        where: { memberId: input.memberId },
        orderBy: { testDate: "desc" },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        memberId: z.string(),
        studioId: z.string(),
        fromBelt: z.string(),
        toBelt: z.string(),
        testDate: z.string(),
        passed: z.boolean(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { testDate, ...rest } = input;
      const promotion = await ctx.db.beltPromotion.create({
        data: { ...rest, testDate: new Date(testDate) },
      });

      // Auto-update member belt rank if passed
      if (input.passed) {
        await ctx.db.member.update({
          where: { id: input.memberId },
          data: { beltRank: input.toBelt },
        });
      }

      return promotion;
    }),
});

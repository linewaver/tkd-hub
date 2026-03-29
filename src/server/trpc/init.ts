import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { db } from "@/server/lib/db";

export type Context = {
  db: typeof db;
  userId: string | null;
  studioId: string | null;
};

export const createContext = async (): Promise<Context> => {
  // TODO: Extract user from Supabase session
  return {
    db,
    userId: null,
    studioId: null,
  };
};

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new Error("UNAUTHORIZED");
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
      studioId: ctx.studioId,
    },
  });
});

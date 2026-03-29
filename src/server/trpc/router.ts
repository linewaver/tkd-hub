import { router } from "./init";
import { studioRouter } from "./routers/studio";
import { memberRouter } from "./routers/member";
import { attendanceRouter } from "./routers/attendance";
import { paymentRouter } from "./routers/payment";
import { beltPromotionRouter } from "./routers/beltPromotion";

export const appRouter = router({
  studio: studioRouter,
  member: memberRouter,
  attendance: attendanceRouter,
  payment: paymentRouter,
  beltPromotion: beltPromotionRouter,
});

export type AppRouter = typeof appRouter;

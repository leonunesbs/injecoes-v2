import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

import { patientRouter } from "~/server/api/routers/patient";
import { postRouter } from "~/server/api/routers/post";
import { prescriptionsRouter } from "~/server/api/routers/prescriptions";
import { settingsRouter } from "~/server/api/routers/settings";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  patient: patientRouter,
  prescriptions: prescriptionsRouter,
  settings: settingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

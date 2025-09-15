import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { z } from "zod";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      // This is a placeholder - you can implement actual functionality here
      return {
        id: "placeholder",
        name: input.name,
        createdAt: new Date(),
      };
    }),

  getLatest: protectedProcedure.query(async ({}) => {
    // This is a placeholder - you can implement actual functionality here
    return null as { id: string; name: string; createdAt: Date } | null;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});

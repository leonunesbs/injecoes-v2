import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { indicationSchema } from "~/lib/schemas/indication";
import { medicationSchema } from "~/lib/schemas/medication";
import { swalisClassificationSchema } from "~/lib/schemas/swalis";
import { z } from "zod";

export const settingsRouter = createTRPCRouter({
  // Indication CRUD operations
  createIndication: publicProcedure
    .input(indicationSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.indication.create({
        data: input,
      });
    }),

  getIndications: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.indication.findMany({
      orderBy: { code: "asc" },
    });
  }),

  updateIndication: publicProcedure
    .input(indicationSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.indication.update({
        where: { id },
        data,
      });
    }),

  deleteIndication: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.indication.delete({
        where: { id: input.id },
      });
    }),

  // Medication CRUD operations
  createMedication: publicProcedure
    .input(medicationSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.medication.create({
        data: input,
      });
    }),

  getMedications: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.medication.findMany({
      orderBy: { code: "asc" },
    });
  }),

  updateMedication: publicProcedure
    .input(medicationSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.medication.update({
        where: { id },
        data,
      });
    }),

  deleteMedication: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.medication.delete({
        where: { id: input.id },
      });
    }),

  // Swalis Classification CRUD operations
  createSwalisClassification: publicProcedure
    .input(swalisClassificationSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.swalisClassification.create({
        data: input,
      });
    }),

  getSwalisClassifications: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.swalisClassification.findMany({
      orderBy: { priority: "asc" },
    });
  }),

  updateSwalisClassification: publicProcedure
    .input(swalisClassificationSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.swalisClassification.update({
        where: { id },
        data,
      });
    }),

  deleteSwalisClassification: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.swalisClassification.delete({
        where: { id: input.id },
      });
    }),
});

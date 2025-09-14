import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { patientIndicationSchema } from "~/lib/schemas/patient";
import { z } from "zod";

export const prescriptionsRouter = createTRPCRouter({
  // Create a new patient with indication
  createPatientIndication: publicProcedure
    .input(
      patientIndicationSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verificar se o paciente já existe
      const existingPatient = await ctx.db.patient.findUnique({
        where: { refId: input.patientId },
      });

      if (existingPatient) {
        // Se o paciente já existe, somar as novas indicações ao saldo existente
        return ctx.db.patient.update({
          where: { refId: input.patientId },
          data: {
            indicationId: input.indicationId,
            medicationId: input.medicationId,
            swalisId: input.swalisId,
            balanceOD: existingPatient.balanceOD + input.indicationOD,
            balanceOS: existingPatient.balanceOS + input.indicationOE,
            totalPrescribedOD:
              existingPatient.totalPrescribedOD + input.indicationOD,
            totalPrescribedOS:
              existingPatient.totalPrescribedOS + input.indicationOE,
            startWithOD: input.startWithOD,
          },
        });
      } else {
        // Se é um novo paciente, criar com saldo inicial
        return ctx.db.patient.create({
          data: {
            refId: input.patientId,
            name: input.patientName,
            indicationId: input.indicationId,
            medicationId: input.medicationId,
            swalisId: input.swalisId,
            balanceOD: input.indicationOD,
            balanceOS: input.indicationOE,
            totalPrescribedOD: input.indicationOD,
            totalPrescribedOS: input.indicationOE,
            startWithOD: input.startWithOD,
            createdById: "system", // TODO: Get from session
          },
        });
      }
    }),

  // Get all patients with their indications
  getPatientIndications: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.patient.findMany({
      include: {
        indication: true,
        medication: true,
        swalis: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Get patient by ID
  getPatientIndicationById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.patient.findUnique({
        where: { id: input.id },
        include: {
          indication: true,
          medication: true,
          swalis: true,
        },
      });
    }),

  // Update patient indication (adds to existing balance)
  updatePatientIndication: publicProcedure
    .input(patientIndicationSchema.omit({ createdAt: true }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Buscar o paciente atual para somar ao saldo existente
      const currentPatient = await ctx.db.patient.findUnique({
        where: { id },
      });

      if (!currentPatient) {
        throw new Error("Paciente não encontrado");
      }

      return ctx.db.patient.update({
        where: { id },
        data: {
          refId: data.patientId,
          name: data.patientName,
          indicationId: data.indicationId,
          medicationId: data.medicationId,
          swalisId: data.swalisId,
          balanceOD: currentPatient.balanceOD + data.indicationOD,
          balanceOS: currentPatient.balanceOS + data.indicationOE,
          totalPrescribedOD:
            currentPatient.totalPrescribedOD + data.indicationOD,
          totalPrescribedOS:
            currentPatient.totalPrescribedOS + data.indicationOE,
          startWithOD: data.startWithOD,
        },
      });
    }),

  // Delete patient indication
  deletePatientIndication: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.patient.delete({
        where: { id: input.id },
      });
    }),

  // Get patients for dropdown
  getPatients: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.patient.findMany({
      select: {
        id: true,
        refId: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });
  }),

  // Get indications for dropdown
  getIndications: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.indication.findMany({
      select: {
        id: true,
        code: true,
        name: true,
      },
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }),

  // Get medications for dropdown
  getMedications: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.medication.findMany({
      select: {
        id: true,
        code: true,
        name: true,
      },
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }),

  // Get swalis classifications for dropdown
  getSwalisClassifications: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.swalisClassification.findMany({
      select: {
        id: true,
        code: true,
        name: true,
      },
      where: { isActive: true },
      orderBy: { priority: "asc" },
    });
  }),
});

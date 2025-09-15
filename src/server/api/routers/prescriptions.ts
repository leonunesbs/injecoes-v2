import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { z } from "zod";
import { patientIndicationSchema } from "~/lib/schemas/patient";
import { prescriptionSchema } from "~/lib/schemas/prescription";

export const prescriptionsRouter = createTRPCRouter({
  // Create a new prescription for a patient
  createPrescription: protectedProcedure
    .input(
      prescriptionSchema.omit({
        id: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Create the prescription
      const prescription = await ctx.db.prescription.create({
        data: {
          patientId: input.patientId,
          indicationId: input.indicationId,
          indicationOther: input.indicationOther,
          medicationId: input.medicationId,
          medicationOther: input.medicationOther,
          swalisId: input.swalisId,
          prescribedOD: input.prescribedOD,
          prescribedOS: input.prescribedOS,
          startWithOD: input.startWithOD,
          notes: input.notes,
          status: input.status,
          doctorId: ctx.session.user.id,
        },
      });

      // Update patient balance and totals
      await ctx.db.patient.update({
        where: { id: input.patientId },
        data: {
          balanceOD: {
            increment: input.prescribedOD,
          },
          balanceOS: {
            increment: input.prescribedOS,
          },
          totalPrescribedOD: {
            increment: input.prescribedOD,
          },
          totalPrescribedOS: {
            increment: input.prescribedOS,
          },
        },
      });

      return prescription;
    }),

  // Create a new patient with indication (legacy method for backward compatibility)
  createPatientIndication: protectedProcedure
    .input(
      patientIndicationSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const refIdString = input.patientRefId.toString();

      // Verificar se o paciente já existe
      const existingPatient = await ctx.db.patient.findUnique({
        where: { refId: refIdString },
      });

      if (existingPatient) {
        // Se o paciente já existe, criar uma nova prescrição
        const prescription = await ctx.db.prescription.create({
          data: {
            patientId: existingPatient.id,
            indicationId: input.indicationId,
            indicationOther: input.indicationOther,
            medicationId: input.medicationId,
            medicationOther: input.medicationOther,
            swalisId: input.swalisId,
            prescribedOD: input.indicationOD,
            prescribedOS: input.indicationOE,
            startWithOD: input.startWithOD,
            doctorId: ctx.session.user.id,
          },
        });

        // Atualizar restante do paciente
        await ctx.db.patient.update({
          where: { refId: refIdString },
          data: {
            balanceOD: existingPatient.balanceOD + input.indicationOD,
            balanceOS: existingPatient.balanceOS + input.indicationOE,
            totalPrescribedOD:
              existingPatient.totalPrescribedOD + input.indicationOD,
            totalPrescribedOS:
              existingPatient.totalPrescribedOS + input.indicationOE,
          },
        });

        return prescription;
      } else {
        // Se é um novo paciente, criar paciente e prescrição
        const patient = await ctx.db.patient.create({
          data: {
            refId: refIdString,
            name: input.patientName,
            balanceOD: input.indicationOD,
            balanceOS: input.indicationOE,
            totalPrescribedOD: input.indicationOD,
            totalPrescribedOS: input.indicationOE,
            createdById: ctx.session.user.id,
          },
        });

        // Criar prescrição para o novo paciente
        const prescription = await ctx.db.prescription.create({
          data: {
            patientId: patient.id,
            indicationId: input.indicationId,
            indicationOther: input.indicationOther,
            medicationId: input.medicationId,
            medicationOther: input.medicationOther,
            swalisId: input.swalisId,
            prescribedOD: input.indicationOD,
            prescribedOS: input.indicationOE,
            startWithOD: input.startWithOD,
            doctorId: ctx.session.user.id,
          },
        });

        return prescription;
      }
    }),

  // Get all patients with their balance information
  getPatientIndications: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.patient.findMany({
      select: {
        id: true,
        name: true,
        refId: true,
        balanceOD: true,
        balanceOS: true,
        totalPrescribedOD: true,
        totalPrescribedOS: true,
        totalAppliedOD: true,
        totalAppliedOS: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Get patient by ID
  getPatientIndicationById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.patient.findUnique({
        where: { id: input.id },
        include: {
          prescriptions: {
            include: {
              indication: true,
              medication: true,
              swalis: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });
    }),

  // Update patient indication (adds to existing balance)
  updatePatientIndication: protectedProcedure
    .input(patientIndicationSchema.omit({ createdAt: true }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Buscar o paciente atual para somar ao restante existente
      const currentPatient = await ctx.db.patient.findUnique({
        where: { id },
      });

      if (!currentPatient) {
        throw new Error("Paciente não encontrado");
      }

      // Atualizar dados básicos do paciente
      await ctx.db.patient.update({
        where: { id },
        data: {
          refId: data.patientRefId.toString(),
          name: data.patientName,
          balanceOD: currentPatient.balanceOD + data.indicationOD,
          balanceOS: currentPatient.balanceOS + data.indicationOE,
          totalPrescribedOD:
            currentPatient.totalPrescribedOD + data.indicationOD,
          totalPrescribedOS:
            currentPatient.totalPrescribedOS + data.indicationOE,
        },
      });

      // Criar nova prescrição com as informações de indicação, medicação e swalis
      return ctx.db.prescription.create({
        data: {
          patientId: id,
          indicationId: data.indicationId,
          indicationOther: data.indicationOther,
          medicationId: data.medicationId,
          medicationOther: data.medicationOther,
          swalisId: data.swalisId,
          prescribedOD: data.indicationOD,
          prescribedOS: data.indicationOE,
          startWithOD: data.startWithOD,
          doctorId: ctx.session.user.id,
        },
      });
    }),

  // Delete patient indication
  deletePatientIndication: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.patient.delete({
        where: { id: input.id },
      });
    }),

  // Get patients for dropdown
  getPatients: protectedProcedure.query(async ({ ctx }) => {
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
  getIndications: protectedProcedure.query(async ({ ctx }) => {
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
  getMedications: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.medication.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        activeSubstance: true,
      },
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }),

  // Get swalis classifications for dropdown
  getSwalisClassifications: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.swalisClassification.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
      },
      where: { isActive: true },
      orderBy: { priority: "asc" },
    });
  }),

  // Get all prescriptions
  getPrescriptions: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.prescription.findMany({
      include: {
        patient: {
          select: {
            id: true,
            refId: true,
            name: true,
            balanceOD: true,
            balanceOS: true,
            totalPrescribedOD: true,
            totalPrescribedOS: true,
            totalAppliedOD: true,
            totalAppliedOS: true,
          },
        },
        indication: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        medication: {
          select: {
            id: true,
            name: true,
            code: true,
            activeSubstance: true,
          },
        },
        swalis: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Get prescriptions by patient ID
  getPrescriptionsByPatient: protectedProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.prescription.findMany({
        where: { patientId: input.patientId },
        include: {
          indication: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          medication: {
            select: {
              id: true,
              name: true,
              code: true,
              activeSubstance: true,
            },
          },
          swalis: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          doctor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  // Update prescription
  updatePrescription: protectedProcedure
    .input(prescriptionSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.prescription.update({
        where: { id },
        data,
      });
    }),

  // Delete prescription
  deletePrescription: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.prescription.delete({
        where: { id: input.id },
      });
    }),

  // Get prescription by ID with full details
  getPrescriptionById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.prescription.findUnique({
        where: { id: input.id },
        include: {
          patient: {
            select: {
              id: true,
              refId: true,
              name: true,
              birthDate: true,
              balanceOD: true,
              balanceOS: true,
              totalPrescribedOD: true,
              totalPrescribedOS: true,
              totalAppliedOD: true,
              totalAppliedOS: true,
            },
          },
          indication: {
            select: {
              id: true,
              name: true,
              code: true,
              description: true,
            },
          },
          medication: {
            select: {
              id: true,
              name: true,
              code: true,
              activeSubstance: true,
            },
          },
          swalis: {
            select: {
              id: true,
              name: true,
              code: true,
              description: true,
              priority: true,
            },
          },
          doctor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    }),

  // Get injections for a specific prescription
  getInjectionsByPrescription: protectedProcedure
    .input(z.object({ prescriptionId: z.string() }))
    .query(async ({ ctx, input }) => {
      // First get the prescription to find the patient
      const prescription = await ctx.db.prescription.findUnique({
        where: { id: input.prescriptionId },
        select: { patientId: true },
      });

      if (!prescription) {
        throw new Error("Prescrição não encontrada");
      }

      // Get all injections for this patient that are related to this prescription period
      return ctx.db.injection.findMany({
        where: { patientId: prescription.patientId },
        include: {
          appliedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { scheduledDate: "desc" },
      });
    }),
});

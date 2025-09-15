import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { z } from "zod";

export const patientRouter = createTRPCRouter({
  // Listar todos os pacientes ordenados por SWALIS + data de indicação
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().nullish(),
        search: z.string().optional(),
        swalisFilter: z.string().optional(),
        indicationFilter: z.string().optional(),
        medicationFilter: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search } = input;

      const where = {
        isActive: true,
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { refId: { contains: search, mode: "insensitive" as const } },
          ],
        }),
        // Filtros serão aplicados via prescrições
      };

      const patients = await ctx.db.patient.findMany({
        where,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [
          // 1º critério: Data de indicação (mais antiga = maior prioridade)
          { createdAt: "asc" },
        ],
        include: {
          createdBy: {
            select: { name: true, email: true },
          },
          prescriptions: {
            include: {
              indication: true,
              medication: true,
              swalis: true,
            },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          _count: {
            select: {
              prescriptions: true,
              injections: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (patients.length > limit) {
        const nextItem = patients.pop();
        nextCursor = nextItem?.id;
      }

      return {
        patients,
        nextCursor,
      };
    }),

  // Obter paciente por ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.patient.findUnique({
        where: { id: input.id },
        include: {
          createdBy: {
            select: { name: true, email: true },
          },
          prescriptions: {
            orderBy: { createdAt: "desc" },
            include: {
              indication: true,
              medication: true,
              swalis: true,
              doctor: {
                select: { name: true, email: true },
              },
            },
          },
          injections: {
            orderBy: { scheduledDate: "desc" },
            include: {
              appliedBy: {
                select: { name: true, email: true },
              },
            },
          },
        },
      });
    }),

  // Obter paciente por refId
  getByRefId: protectedProcedure
    .input(z.object({ refId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.patient.findFirst({
        where: {
          refId: input.refId.toString(),
          isActive: true,
        },
        select: {
          id: true,
          refId: true,
          name: true,
        },
      });
    }),

  // Criar novo paciente
  create: protectedProcedure
    .input(
      z.object({
        refId: z.string().min(1),
        name: z.string().min(1),
        birthDate: z.date().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        indicationId: z.string(),
        medicationId: z.string(),
        swalisId: z.string(),
        indicationOther: z.string().optional(),
        medicationOther: z.string().optional(),
        startWithOD: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.patient.create({
        data: {
          ...input,
          createdById: ctx.session.user.id,
        },
        include: {
          prescriptions: {
            include: {
              indication: true,
              medication: true,
              swalis: true,
            },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });
    }),

  // Atualizar paciente
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        refId: z.string().min(1).optional(),
        name: z.string().min(1).optional(),
        birthDate: z.date().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        indicationId: z.string().optional(),
        medicationId: z.string().optional(),
        swalisId: z.string().optional(),
        indicationOther: z.string().optional(),
        medicationOther: z.string().optional(),
        startWithOD: z.boolean().optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      return ctx.db.patient.update({
        where: { id },
        data: updateData,
        include: {
          prescriptions: {
            include: {
              indication: true,
              medication: true,
              swalis: true,
            },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });
    }),

  // Obter estatísticas de pacientes por SWALIS
  getStatsBySwalis: protectedProcedure.query(async ({ ctx }) => {
    const swalisData = await ctx.db.swalisClassification.findMany({
      where: { isActive: true },
      orderBy: { priority: "asc" },
    });

    const stats = await Promise.all(
      swalisData.map(async (swalis) => {
        const count = await ctx.db.patient.count({
          where: {
            isActive: true,
            prescriptions: {
              some: {
                swalisId: swalis.id,
              },
            },
          },
        });

        return {
          swalis: swalis.name,
          priority: swalis.priority,
          count,
        };
      }),
    );

    return stats;
  }),

  // Obter pacientes urgentes (SWALIS A1 e A2)
  getUrgent: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ ctx, input }) => {
      // Buscar classificações A1 e A2
      const urgentSwalis = await ctx.db.swalisClassification.findMany({
        where: {
          isActive: true,
          priority: { lte: 2 }, // A1 (priority=1) e A2 (priority=2)
        },
        select: { id: true },
      });

      const swalisIds = urgentSwalis.map((s) => s.id);

      return ctx.db.patient.findMany({
        where: {
          isActive: true,
          prescriptions: {
            some: {
              swalisId: { in: swalisIds },
            },
          },
        },
        take: input.limit,
        orderBy: [{ createdAt: "asc" }],
        include: {
          createdBy: {
            select: { name: true, email: true },
          },
          prescriptions: {
            include: {
              indication: true,
              medication: true,
              swalis: true,
            },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });
    }),
});

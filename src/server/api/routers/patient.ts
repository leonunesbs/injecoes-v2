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
      const {
        limit,
        cursor,
        search,
        swalisFilter,
        indicationFilter,
        medicationFilter,
      } = input;

      const where = {
        isActive: true,
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { refId: { contains: search, mode: "insensitive" as const } },
          ],
        }),
        ...(swalisFilter && { swalisId: swalisFilter }),
        ...(indicationFilter && { indicationId: indicationFilter }),
        ...(medicationFilter && { medicationId: medicationFilter }),
      };

      const patients = await ctx.db.patient.findMany({
        where,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [
          // 1º critério: Prioridade SWALIS (menor número = maior prioridade)
          { swalis: { priority: "asc" } },
          // 2º critério: Data de indicação (mais antiga = maior prioridade)
          { createdAt: "asc" },
        ],
        include: {
          indication: true,
          medication: true,
          swalis: true,
          createdBy: {
            select: { name: true, email: true },
          },
          _count: {
            select: {
              consultations: true,
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
          indication: true,
          medication: true,
          swalis: true,
          createdBy: {
            select: { name: true, email: true },
          },
          consultations: {
            orderBy: { consultationDate: "desc" },
            include: {
              doctor: {
                select: { name: true, email: true },
              },
              prescriptions: {
                orderBy: { createdAt: "desc" },
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
          indication: true,
          medication: true,
          swalis: true,
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
          indication: true,
          medication: true,
          swalis: true,
        },
      });
    }),

  // Obter estatísticas de pacientes por SWALIS
  getStatsBySwalis: protectedProcedure.query(async ({ ctx }) => {
    const stats = await ctx.db.patient.groupBy({
      by: ["swalisId"],
      where: { isActive: true },
      _count: { id: true },
      orderBy: { swalisId: "asc" },
    });

    const swalisData = await ctx.db.swalisClassification.findMany({
      where: { isActive: true },
      orderBy: { priority: "asc" },
    });

    return stats.map((stat) => {
      const swalis = swalisData.find((s) => s.id === stat.swalisId);
      return {
        swalis: swalis?.name || "Desconhecido",
        priority: swalis?.priority || 999,
        count: stat._count.id ?? 0,
      };
    });
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
          swalisId: { in: swalisIds },
        },
        take: input.limit,
        orderBy: [{ swalis: { priority: "asc" } }, { createdAt: "asc" }],
        include: {
          indication: true,
          medication: true,
          swalis: true,
          createdBy: {
            select: { name: true, email: true },
          },
        },
      });
    }),
});

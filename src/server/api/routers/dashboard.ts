import type { Injection, Patient } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { z } from "zod";

// Tipos específicos para análises do dashboard
type IndicationApplicationData = {
  totalAppliedOD: number;
  totalAppliedOS: number;
  totalBalanceOD: number;
  totalBalanceOS: number;
  patientCount: number;
};

type SwalisApplicationData = {
  totalAppliedOD: number;
  totalAppliedOS: number;
  totalBalanceOD: number;
  totalBalanceOS: number;
  patientCount: number;
};

type MedicationApplicationData = {
  totalAppliedOD: number;
  totalAppliedOS: number;
};

export const dashboardRouter = createTRPCRouter({
  // Análise de perfil clínico das condições
  getClinicalProfileAnalysis: protectedProcedure.query(async ({ ctx }) => {
    // Análise de distribuição de indicações por tipo através de prescrições
    const indicationAnalysis = await ctx.db.prescription.groupBy({
      by: ["indicationId"],
      _count: { id: true },
      _sum: {
        prescribedOD: true,
        prescribedOS: true,
      },
    });

    // Buscar detalhes das indicações
    const indicationDetails = await ctx.db.indication.findMany({
      where: { isActive: true },
      select: { id: true, code: true, name: true, description: true },
    });

    // Buscar dados de aplicação por indicação
    const indicationApplicationData = await ctx.db.prescription.findMany({
      select: {
        indicationId: true,
        patient: {
          select: {
            totalAppliedOD: true,
            totalAppliedOS: true,
            balanceOD: true,
            balanceOS: true,
          },
        },
      },
    });

    // Agrupar dados de aplicação por indicação
    const applicationByIndication = indicationApplicationData.reduce(
      (acc, prescription) => {
        const indicationId = prescription.indicationId;
        acc[indicationId] ??= {
          totalAppliedOD: 0,
          totalAppliedOS: 0,
          totalBalanceOD: 0,
          totalBalanceOS: 0,
          patientCount: 0,
        };
        acc[indicationId].totalAppliedOD += prescription.patient.totalAppliedOD;
        acc[indicationId].totalAppliedOS += prescription.patient.totalAppliedOS;
        acc[indicationId].totalBalanceOD += prescription.patient.balanceOD;
        acc[indicationId].totalBalanceOS += prescription.patient.balanceOS;
        acc[indicationId].patientCount += 1;
        return acc;
      },
      {} as Record<string, IndicationApplicationData>,
    );

    // Combinar dados de análise com detalhes das indicações
    const clinicalProfiles = indicationAnalysis.map((analysis) => {
      const indication = indicationDetails.find(
        (ind) => ind.id === analysis.indicationId,
      );
      const applicationData = applicationByIndication[
        analysis.indicationId
      ] ?? {
        totalAppliedOD: 0,
        totalAppliedOS: 0,
        totalBalanceOD: 0,
        totalBalanceOS: 0,
        patientCount: 0,
      };

      return {
        indication: indication ?? {
          id: analysis.indicationId,
          code: "Unknown",
          name: "Unknown",
          description: null,
        },
        patientCount: analysis._count.id,
        totalPrescribedOD: analysis._sum.prescribedOD ?? 0,
        totalPrescribedOS: analysis._sum.prescribedOS ?? 0,
        totalAppliedOD: applicationData.totalAppliedOD,
        totalAppliedOS: applicationData.totalAppliedOS,
        avgBalanceOD:
          applicationData.patientCount > 0
            ? applicationData.totalBalanceOD / applicationData.patientCount
            : 0,
        avgBalanceOS:
          applicationData.patientCount > 0
            ? applicationData.totalBalanceOS / applicationData.patientCount
            : 0,
        totalPrescribed:
          (analysis._sum.prescribedOD ?? 0) + (analysis._sum.prescribedOS ?? 0),
        totalApplied:
          applicationData.totalAppliedOD + applicationData.totalAppliedOS,
        complianceRate:
          (analysis._sum.prescribedOD ?? 0) +
            (analysis._sum.prescribedOS ?? 0) >
          0
            ? ((applicationData.totalAppliedOD +
                applicationData.totalAppliedOS) /
                ((analysis._sum.prescribedOD ?? 0) +
                  (analysis._sum.prescribedOS ?? 0))) *
              100
            : 0,
      };
    });

    return clinicalProfiles.sort((a, b) => b.patientCount - a.patientCount);
  }),

  // Análise quantitativa geral
  getQuantitativeAnalysis: protectedProcedure.query(async ({ ctx }) => {
    // Estatísticas gerais
    const totalPatients = await ctx.db.patient.count({
      where: { isActive: true },
    });
    const totalIndications = await ctx.db.indication.count({
      where: { isActive: true },
    });
    const totalMedications = await ctx.db.medication.count({
      where: { isActive: true },
    });
    const totalPrescriptions = await ctx.db.prescription.count();
    const totalInjections = await ctx.db.injection.count();

    // Análise por classificação Swalis através de prescrições
    const swalisAnalysis = await ctx.db.prescription.groupBy({
      by: ["swalisId"],
      _count: { id: true },
      _sum: {
        prescribedOD: true,
        prescribedOS: true,
      },
    });

    // Buscar detalhes das classificações Swalis
    const swalisDetails = await ctx.db.swalisClassification.findMany({
      where: { isActive: true },
      select: {
        id: true,
        code: true,
        name: true,
        priority: true,
        description: true,
      },
      orderBy: { priority: "asc" },
    });

    // Buscar dados de aplicação por Swalis
    const swalisApplicationData = await ctx.db.prescription.findMany({
      select: {
        swalisId: true,
        patient: {
          select: {
            totalAppliedOD: true,
            totalAppliedOS: true,
            balanceOD: true,
            balanceOS: true,
          },
        },
      },
    });

    // Agrupar dados de aplicação por Swalis
    const applicationBySwalis = swalisApplicationData.reduce(
      (acc, prescription) => {
        const swalisId = prescription.swalisId;
        acc[swalisId] ??= {
          totalAppliedOD: 0,
          totalAppliedOS: 0,
          totalBalanceOD: 0,
          totalBalanceOS: 0,
          patientCount: 0,
        };
        acc[swalisId].totalAppliedOD += prescription.patient.totalAppliedOD;
        acc[swalisId].totalAppliedOS += prescription.patient.totalAppliedOS;
        acc[swalisId].totalBalanceOD += prescription.patient.balanceOD;
        acc[swalisId].totalBalanceOS += prescription.patient.balanceOS;
        acc[swalisId].patientCount += 1;
        return acc;
      },
      {} as Record<string, SwalisApplicationData>,
    );

    // Combinar dados
    const swalisProfiles = swalisAnalysis.map((analysis) => {
      const swalis = swalisDetails.find((sw) => sw.id === analysis.swalisId);
      const applicationData = applicationBySwalis[analysis.swalisId] ?? {
        totalAppliedOD: 0,
        totalAppliedOS: 0,
        totalBalanceOD: 0,
        totalBalanceOS: 0,
        patientCount: 0,
      };

      return {
        swalis: swalis ?? {
          id: analysis.swalisId,
          code: "Unknown",
          name: "Unknown",
          priority: 999,
          description: null,
        },
        patientCount: analysis._count.id,
        totalBalance:
          applicationData.totalBalanceOD + applicationData.totalBalanceOS,
        totalPrescribed:
          (analysis._sum.prescribedOD ?? 0) + (analysis._sum.prescribedOS ?? 0),
        totalApplied:
          applicationData.totalAppliedOD + applicationData.totalAppliedOS,
        avgBalancePerPatient:
          applicationData.patientCount > 0
            ? (applicationData.totalBalanceOD +
                applicationData.totalBalanceOS) /
              applicationData.patientCount
            : 0,
      };
    });

    // Análise por medicamento através de prescrições
    const medicationAnalysis = await ctx.db.prescription.groupBy({
      by: ["medicationId"],
      _count: { id: true },
      _sum: {
        prescribedOD: true,
        prescribedOS: true,
      },
    });

    const medicationDetails = await ctx.db.medication.findMany({
      where: { isActive: true },
      select: { id: true, code: true, name: true, activeSubstance: true },
    });

    // Buscar dados de aplicação por medicamento
    const medicationApplicationData = await ctx.db.prescription.findMany({
      select: {
        medicationId: true,
        patient: {
          select: {
            totalAppliedOD: true,
            totalAppliedOS: true,
          },
        },
      },
    });

    // Agrupar dados de aplicação por medicamento
    const applicationByMedication = medicationApplicationData.reduce(
      (acc, prescription) => {
        const medicationId = prescription.medicationId;
        acc[medicationId] ??= {
          totalAppliedOD: 0,
          totalAppliedOS: 0,
        };
        acc[medicationId].totalAppliedOD += prescription.patient.totalAppliedOD;
        acc[medicationId].totalAppliedOS += prescription.patient.totalAppliedOS;
        return acc;
      },
      {} as Record<string, MedicationApplicationData>,
    );

    const medicationProfiles = medicationAnalysis.map((analysis) => {
      const medication = medicationDetails.find(
        (med) => med.id === analysis.medicationId,
      );
      const applicationData = applicationByMedication[
        analysis.medicationId
      ] ?? {
        totalAppliedOD: 0,
        totalAppliedOS: 0,
      };

      return {
        medication: medication ?? {
          id: analysis.medicationId,
          code: "Unknown",
          name: "Unknown",
          activeSubstance: "Unknown",
        },
        patientCount: analysis._count.id,
        totalPrescribed:
          (analysis._sum.prescribedOD ?? 0) + (analysis._sum.prescribedOS ?? 0),
        totalApplied:
          applicationData.totalAppliedOD + applicationData.totalAppliedOS,
        usageRate:
          analysis._count.id > 0
            ? (analysis._count.id / totalPatients) * 100
            : 0,
      };
    });

    return {
      general: {
        totalPatients,
        totalIndications,
        totalMedications,
        totalPrescriptions,
        totalInjections,
      },
      swalisAnalysis: swalisProfiles.sort(
        (a, b) => a.swalis.priority - b.swalis.priority,
      ),
      medicationAnalysis: medicationProfiles.sort(
        (a, b) => b.patientCount - a.patientCount,
      ),
    };
  }),

  // Análise de intervalos entre doses no mesmo paciente
  getDoseIntervalAnalysis: protectedProcedure.query(async ({ ctx }) => {
    // Buscar pacientes com múltiplas injeções
    const patientsWithMultipleInjections = await ctx.db.patient.findMany({
      where: {
        isActive: true,
        injections: {
          some: {},
        },
      },
      include: {
        injections: {
          where: { status: "APPLIED" },
          orderBy: { appliedDate: "asc" },
        },
        prescriptions: {
          include: {
            indication: { select: { code: true, name: true } },
            medication: { select: { code: true, name: true } },
            swalis: { select: { code: true, name: true, priority: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 1, // Pegar apenas a prescrição mais recente
        },
      },
    });

    // Calcular intervalos entre doses para cada paciente
    const intervalAnalysis = patientsWithMultipleInjections
      .map((patient) => {
        const appliedInjections = patient.injections.filter(
          (inj) => inj.appliedDate !== null,
        );

        if (appliedInjections.length < 2) {
          return null;
        }

        const intervals = [];
        for (let i = 1; i < appliedInjections.length; i++) {
          const prevDate = new Date(appliedInjections[i - 1]!.appliedDate!);
          const currentDate = new Date(appliedInjections[i]!.appliedDate!);
          const intervalDays = Math.ceil(
            (currentDate.getTime() - prevDate.getTime()) /
              (1000 * 60 * 60 * 24),
          );
          intervals.push(intervalDays);
        }

        const avgInterval =
          intervals.reduce((sum, interval) => sum + interval, 0) /
          intervals.length;
        const minInterval = Math.min(...intervals);
        const maxInterval = Math.max(...intervals);

        const latestPrescription = patient.prescriptions[0];

        return {
          patient: {
            id: patient.id,
            refId: patient.refId,
            name: patient.name,
          },
          indication: latestPrescription?.indication ?? {
            code: "Unknown",
            name: "Unknown",
          },
          medication: latestPrescription?.medication ?? {
            code: "Unknown",
            name: "Unknown",
          },
          swalis: latestPrescription?.swalis ?? {
            code: "Unknown",
            name: "Unknown",
            priority: 999,
          },
          injectionCount: appliedInjections.length,
          intervals,
          avgInterval: Math.round(avgInterval),
          minInterval,
          maxInterval,
          totalInjectedOD: appliedInjections.reduce(
            (sum, inj) => sum + inj.injectionOD,
            0,
          ),
          totalInjectedOS: appliedInjections.reduce(
            (sum, inj) => sum + inj.injectionOS,
            0,
          ),
          firstInjectionDate: appliedInjections[0]?.appliedDate,
          lastInjectionDate:
            appliedInjections[appliedInjections.length - 1]?.appliedDate,
        };
      })
      .filter(Boolean);

    // Análise agregada por indicação
    const indicationIntervalStats = await ctx.db.indication.findMany({
      where: { isActive: true },
      include: {
        prescriptions: {
          include: {
            patient: {
              include: {
                injections: {
                  where: { status: "APPLIED" },
                  orderBy: { appliedDate: "asc" },
                },
              },
            },
          },
        },
      },
    });

    const indicationStats = indicationIntervalStats.map((indication) => {
      // Extrair pacientes únicos das prescrições
      const uniquePatients = new Map<
        string,
        Patient & { injections: Injection[] }
      >();
      indication.prescriptions.forEach((prescription) => {
        if (
          prescription.patient &&
          !uniquePatients.has(prescription.patient.id)
        ) {
          uniquePatients.set(prescription.patient.id, prescription.patient);
        }
      });
      const patients = Array.from(uniquePatients.values());

      const patientsWithIntervals = patients
        .map((patient) => {
          const appliedInjections = patient.injections;
          if (appliedInjections.length < 2) return null;

          const intervals = [];
          for (let i = 1; i < appliedInjections.length; i++) {
            const prevDate = new Date(appliedInjections[i - 1]!.appliedDate!);
            const currentDate = new Date(appliedInjections[i]!.appliedDate!);
            const intervalDays = Math.ceil(
              (currentDate.getTime() - prevDate.getTime()) /
                (1000 * 60 * 60 * 24),
            );
            intervals.push(intervalDays);
          }

          return {
            patientId: patient.id,
            intervals,
            avgInterval:
              intervals.reduce((sum, interval) => sum + interval, 0) /
              intervals.length,
          };
        })
        .filter(Boolean);

      if (patientsWithIntervals.length === 0) {
        return {
          indication: {
            id: indication.id,
            code: indication.code,
            name: indication.name,
          },
          patientCount: patients.length,
          patientsWithMultipleInjections: 0,
          avgIntervalAcrossPatients: 0,
          minIntervalAcrossPatients: 0,
          maxIntervalAcrossPatients: 0,
        };
      }

      const allIntervals = patientsWithIntervals
        .flatMap((p) => (Array.isArray(p?.intervals) ? p.intervals : []))
        .filter((i): i is number => typeof i === "number" && !isNaN(i));

      const avgIntervalAcrossPatients =
        allIntervals.length > 0
          ? allIntervals.reduce((sum, interval) => sum + interval, 0) /
            allIntervals.length
          : 0;

      return {
        indication: {
          id: indication.id,
          code: indication.code,
          name: indication.name,
        },
        patientCount: patients.length,
        patientsWithMultipleInjections: patientsWithIntervals.length,
        avgIntervalAcrossPatients: Math.round(avgIntervalAcrossPatients),
        minIntervalAcrossPatients:
          allIntervals.length > 0 ? Math.min(...allIntervals) : 0,
        maxIntervalAcrossPatients:
          allIntervals.length > 0 ? Math.max(...allIntervals) : 0,
        intervalDistribution: {
          lessThan30Days: allIntervals.filter(
            (i): i is number => typeof i === "number" && i < 30,
          ).length,
          between30And60Days: allIntervals.filter(
            (i): i is number => typeof i === "number" && i >= 30 && i < 60,
          ).length,
          between60And90Days: allIntervals.filter(
            (i): i is number => typeof i === "number" && i >= 60 && i < 90,
          ).length,
          moreThan90Days: allIntervals.filter(
            (i): i is number => typeof i === "number" && i >= 90,
          ).length,
        },
      };
    });

    return {
      patientIntervals: intervalAnalysis.sort(
        (a, b) => b!.injectionCount - a!.injectionCount,
      ),
      indicationStats: indicationStats.sort(
        (a, b) => b.patientCount - a.patientCount,
      ),
    };
  }),

  // Ranking de pacientes por número de prontuário
  getPatientRanking: protectedProcedure
    .input(
      z.object({
        sortBy: z
          .enum([
            "refId",
            "totalInjections",
            "totalPrescribed",
            "avgInterval",
            "swalisPriority",
          ])
          .default("refId"),
        order: z.enum(["asc", "desc"]).default("asc"),
        limit: z.number().min(1).max(100).default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { sortBy, order, limit } = input;

      // Buscar pacientes com estatísticas
      const patients = await ctx.db.patient.findMany({
        where: { isActive: true },
        include: {
          prescriptions: {
            include: {
              indication: { select: { code: true, name: true } },
              medication: { select: { code: true, name: true } },
              swalis: { select: { code: true, name: true, priority: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 1, // Pegar apenas a prescrição mais recente
          },
          injections: {
            where: { status: "APPLIED" },
            orderBy: { appliedDate: "asc" },
          },
          _count: {
            select: {
              prescriptions: true,
              injections: true,
            },
          },
        },
        take: limit,
      });

      // Calcular estatísticas para cada paciente
      const patientsWithStats = patients.map((patient) => {
        const appliedInjections = patient.injections.filter(
          (inj) => inj.appliedDate !== null,
        );

        // Calcular intervalos se houver múltiplas injeções
        let avgInterval = 0;
        if (appliedInjections.length >= 2) {
          const intervals = [];
          for (let i = 1; i < appliedInjections.length; i++) {
            const prevDate = new Date(appliedInjections[i - 1]!.appliedDate!);
            const currentDate = new Date(appliedInjections[i]!.appliedDate!);
            const intervalDays = Math.ceil(
              (currentDate.getTime() - prevDate.getTime()) /
                (1000 * 60 * 60 * 24),
            );
            intervals.push(intervalDays);
          }
          avgInterval =
            intervals.reduce((sum, interval) => sum + interval, 0) /
            intervals.length;
        }

        const totalPrescribed =
          patient.totalPrescribedOD + patient.totalPrescribedOS;
        const totalApplied = patient.totalAppliedOD + patient.totalAppliedOS;
        const complianceRate =
          totalPrescribed > 0 ? (totalApplied / totalPrescribed) * 100 : 0;

        const latestPrescription = patient.prescriptions[0];

        return {
          id: patient.id,
          refId: patient.refId,
          name: patient.name,
          birthDate: patient.birthDate,
          indication: latestPrescription?.indication ?? {
            code: "Unknown",
            name: "Unknown",
          },
          medication: latestPrescription?.medication ?? {
            code: "Unknown",
            name: "Unknown",
          },
          swalis: latestPrescription?.swalis ?? {
            code: "Unknown",
            name: "Unknown",
            priority: 999,
          },
          totalPrescribedOD: patient.totalPrescribedOD,
          totalPrescribedOS: patient.totalPrescribedOS,
          totalAppliedOD: patient.totalAppliedOD,
          totalAppliedOS: patient.totalAppliedOS,
          balanceOD: patient.balanceOD,
          balanceOS: patient.balanceOS,
          totalPrescribed,
          totalApplied,
          complianceRate: Math.round(complianceRate * 100) / 100,
          prescriptionCount: patient._count.prescriptions,
          injectionCount: patient._count.injections,
          appliedInjectionCount: appliedInjections.length,
          avgInterval: Math.round(avgInterval),
          createdAt: patient.createdAt,
          lastInjectionDate:
            appliedInjections.length > 0
              ? appliedInjections[appliedInjections.length - 1]?.appliedDate
              : null,
        };
      });

      // Ordenar baseado no critério escolhido
      const sortedPatients = [...patientsWithStats];

      switch (sortBy) {
        case "refId":
          sortedPatients.sort((a, b) => {
            const aNum = parseInt(a.refId.replace(/\D/g, "")) ?? 0;
            const bNum = parseInt(b.refId.replace(/\D/g, "")) ?? 0;
            return order === "asc" ? aNum - bNum : bNum - aNum;
          });
          break;
        case "totalInjections":
          sortedPatients.sort((a, b) =>
            order === "asc"
              ? a.injectionCount - b.injectionCount
              : b.injectionCount - a.injectionCount,
          );
          break;
        case "totalPrescribed":
          sortedPatients.sort((a, b) =>
            order === "asc"
              ? a.totalPrescribed - b.totalPrescribed
              : b.totalPrescribed - a.totalPrescribed,
          );
          break;
        case "avgInterval":
          sortedPatients.sort((a, b) =>
            order === "asc"
              ? a.avgInterval - b.avgInterval
              : b.avgInterval - a.avgInterval,
          );
          break;
        case "swalisPriority":
          sortedPatients.sort((a, b) =>
            order === "asc"
              ? a.swalis.priority - b.swalis.priority
              : b.swalis.priority - a.swalis.priority,
          );
          break;
      }

      return sortedPatients;
    }),

  // Estatísticas gerais do dashboard
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const [
      totalPatients,
      totalActivePatients,
      totalInjections,
      totalAppliedInjections,
      totalPrescriptions,
      activePrescriptions,
    ] = await Promise.all([
      ctx.db.patient.count(),
      ctx.db.patient.count({ where: { isActive: true } }),
      ctx.db.injection.count(),
      ctx.db.injection.count({ where: { status: "APPLIED" } }),
      ctx.db.prescription.count(),
      ctx.db.prescription.count({ where: { status: "ACTIVE" } }),
    ]);

    // Pacientes por classificação Swalis através de prescrições
    const swalisDistribution = await ctx.db.prescription.groupBy({
      by: ["swalisId"],
      _count: { id: true },
    });

    const swalisDetails = await ctx.db.swalisClassification.findMany({
      where: { isActive: true },
      select: { id: true, code: true, name: true, priority: true },
      orderBy: { priority: "asc" },
    });

    const swalisStats = swalisDistribution.map((dist) => {
      const swalis = swalisDetails.find((sw) => sw.id === dist.swalisId);
      return {
        code: swalis?.code ?? "Unknown",
        name: swalis?.name ?? "Unknown",
        priority: swalis?.priority ?? 999,
        count: dist._count.id,
        percentage:
          totalActivePatients > 0
            ? (dist._count.id / totalActivePatients) * 100
            : 0,
      };
    });

    return {
      general: {
        totalPatients,
        totalActivePatients,
        totalInjections,
        totalAppliedInjections,
        totalPrescriptions,
        activePrescriptions,
        applicationRate:
          totalInjections > 0
            ? (totalAppliedInjections / totalInjections) * 100
            : 0,
      },
      swalisDistribution: swalisStats.sort((a, b) => a.priority - b.priority),
    };
  }),
});

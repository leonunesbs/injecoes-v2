import {
  Activity,
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Syringe,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { db } from "~/server/db";
import { api } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Dashboard - Sistema de Injeções",
  description:
    "Análise crítica dos dados de indicações e perfil clínico das condições. Visualize estatísticas de pacientes, prescrições, medicamentos e adesão ao tratamento.",
  keywords: [
    "dashboard",
    "injeções",
    "medicamentos",
    "prescrições",
    "pacientes",
    "análise clínica",
    "adesão ao tratamento",
    "sistema médico",
  ],
  openGraph: {
    title: "Dashboard - Sistema de Injeções",
    description:
      "Análise crítica dos dados de indicações e perfil clínico das condições",
    type: "website",
  },
  robots: {
    index: false, // Dashboard é área privada, não deve ser indexado
    follow: false,
  },
};

export default async function DashboardPage() {
  // Buscar todos os dados no servidor
  const [
    dashboardStats,
    clinicalProfile,
    quantitativeAnalysis,
    doseIntervalAnalysis,
    patientRanking,
    notifications,
  ] = await Promise.all([
    api.dashboard.getDashboardStats(),
    api.dashboard.getClinicalProfileAnalysis(),
    api.dashboard.getQuantitativeAnalysis(),
    api.dashboard.getDoseIntervalAnalysis(),
    api.dashboard.getPatientRanking({
      sortBy: "refId",
      order: "asc",
      limit: 20,
    }),
    (async () => {
      const now = new Date();
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0,
      );
      const endOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999,
      );

      const [overdueScheduled, dueToday, missed] = await Promise.all([
        db.injection.count({
          where: {
            status: "SCHEDULED",
            scheduledDate: { lt: startOfToday },
            patient: { isActive: true },
          },
        }),
        db.injection.count({
          where: {
            status: "SCHEDULED",
            scheduledDate: { gte: startOfToday, lte: endOfToday },
            patient: { isActive: true },
          },
        }),
        db.injection.count({
          where: { status: "MISSED", patient: { isActive: true } },
        }),
      ]);

      return {
        overdueScheduled,
        dueToday,
        missed,
        total: overdueScheduled + dueToday + missed,
      };
    })(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Análise crítica dos dados de indicações e perfil clínico das condições
        </p>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notificações</CardTitle>
            <BarChart3 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.total}</div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-md border p-2">
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>Vencidas</span>
                </div>
                <p className="mt-1 text-center text-sm font-semibold">
                  {notifications.overdueScheduled}
                </p>
              </div>
              <div className="rounded-md border p-2">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Hoje</span>
                </div>
                <p className="mt-1 text-center text-sm font-semibold">
                  {notifications.dueToday}
                </p>
              </div>
              <div className="rounded-md border p-2">
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>Perdidas</span>
                </div>
                <p className="mt-1 text-center text-sm font-semibold">
                  {notifications.missed}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pacientes Ativos
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.general.totalActivePatients}
            </div>
            <p className="text-muted-foreground text-xs">
              {dashboardStats.general.totalPatients} total de pacientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Injeções Aplicadas
            </CardTitle>
            <Syringe className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.general.totalAppliedInjections}
            </div>
            <p className="text-muted-foreground text-xs">
              {Math.round(dashboardStats.general.applicationRate)}% taxa de
              aplicação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prescrições</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.general.totalPrescriptions}
            </div>
            <p className="text-muted-foreground text-xs">
              {dashboardStats.general.activePrescriptions} prescrições ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Indicações</CardTitle>
            <Activity className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clinicalProfile.length}</div>
            <p className="text-muted-foreground text-xs">
              tipos diferentes de indicações
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid Layout Integrado - Flexível */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Perfil Clínico Compacto */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4" />
              Perfil Clínico
            </CardTitle>
            <CardDescription className="text-xs">
              Adesão ao tratamento por indicação
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {clinicalProfile.slice(0, 4).map((profile) => (
                <div
                  key={profile.indication.id}
                  className="flex items-center justify-between rounded-lg border p-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">
                      {profile.indication.code}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {profile.patientCount} pacientes
                    </p>
                  </div>
                  <div className="ml-2 flex items-center gap-1">
                    <Badge
                      variant={
                        profile.complianceRate >= 80
                          ? "default"
                          : profile.complianceRate >= 60
                            ? "secondary"
                            : "destructive"
                      }
                      className="px-1 py-0 text-xs"
                    >
                      {Math.round(profile.complianceRate)}%
                    </Badge>
                    {profile.complianceRate >= 80 ? (
                      <CheckCircle className="h-3 w-3 flex-shrink-0" />
                    ) : profile.complianceRate < 60 ? (
                      <AlertCircle className="h-3 w-3 flex-shrink-0" />
                    ) : (
                      <Eye className="h-3 w-3 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
              {clinicalProfile.length > 4 && (
                <p className="text-muted-foreground text-center text-xs">
                  +{clinicalProfile.length - 4} outras indicações
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Medicamentos Compacto */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              Medicamentos
            </CardTitle>
            <CardDescription className="text-xs">
              Uso mais frequente
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {quantitativeAnalysis.medicationAnalysis
                .slice(0, 5)
                .map((medication) => (
                  <div
                    key={medication.medication.id}
                    className="flex items-center justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">
                        {medication.medication.name}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {medication.medication.activeSubstance}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 text-right">
                      <p className="text-xs font-medium">
                        {medication.patientCount}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {Math.round(medication.usageRate)}%
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Intervalos Compacto */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
              Intervalos de Doses
            </CardTitle>
            <CardDescription className="text-xs">
              Resumo por indicação
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {doseIntervalAnalysis.indicationStats.slice(0, 3).map((stat) => (
                <div key={stat.indication.id} className="rounded-lg border p-2">
                  <div className="mb-1 flex items-center justify-between">
                    <h4 className="truncate text-xs font-medium">
                      {stat.indication.code}
                    </h4>
                    <Badge
                      variant="outline"
                      className="ml-1 flex-shrink-0 px-1 py-0 text-xs"
                    >
                      {stat.avgIntervalAcrossPatients}d
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    <div>
                      <p className="text-muted-foreground">Min</p>
                      <p className="font-medium">
                        {stat.minIntervalAcrossPatients}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Max</p>
                      <p className="font-medium">
                        {stat.maxIntervalAcrossPatients}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">&lt;30d</p>
                      <p className="font-medium">
                        {stat.intervalDistribution?.lessThan30Days ?? 0}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Pacientes */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4" />
              Top Pacientes
            </CardTitle>
            <CardDescription className="text-xs">
              Maior frequência de aplicações
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {doseIntervalAnalysis.patientIntervals
                .slice(0, 6)
                .map((patient) => (
                  <div
                    key={patient?.patient.id}
                    className="flex items-center justify-between rounded-lg border p-2"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <div className="flex-shrink-0 text-center">
                        <p className="text-xs font-bold">
                          {patient?.patient.refId}
                        </p>
                        <Badge
                          variant={
                            (patient?.swalis.priority ?? 5) <= 2
                              ? "destructive"
                              : (patient?.swalis.priority ?? 5) <= 3
                                ? "default"
                                : "secondary"
                          }
                          className="px-1 py-0 text-xs"
                        >
                          {patient?.swalis.code}
                        </Badge>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">
                          {patient?.patient.name}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {patient?.indication.name}
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 text-right">
                      <p className="text-xs font-medium">
                        {patient?.injectionCount}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {patient?.avgInterval}d
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Resumo de Adesão */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4" />
              Resumo de Adesão
            </CardTitle>
            <CardDescription className="text-xs">
              Status geral do tratamento
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {patientRanking.slice(0, 6).map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between rounded-lg border p-2"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <Link
                      href={`/patients/${patient.id}`}
                      className="flex-shrink-0 text-xs font-bold hover:underline"
                    >
                      {patient.refId}
                    </Link>
                  </div>
                  <div className="ml-2 flex flex-shrink-0 items-center gap-2">
                    <Badge
                      variant={
                        patient.complianceRate >= 80
                          ? "default"
                          : patient.complianceRate >= 60
                            ? "secondary"
                            : "destructive"
                      }
                      className="px-1 py-0 text-xs"
                    >
                      {patient.complianceRate}%
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                      {patient.totalApplied}/{patient.totalPrescribed}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

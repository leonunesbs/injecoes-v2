import {
  Activity,
  AlertCircle,
  Calendar,
  Eye,
  FileText,
  Syringe,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import Link from "next/link";
import { BackButton } from "~/components/BackButton";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/server";

export default async function PrescriptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const prescriptionId = (await params).id;
  const prescription = await api.prescriptions.getPrescriptionById({
    id: prescriptionId,
  });
  const injections = await api.prescriptions.getInjectionsByPrescription({
    prescriptionId,
  });

  if (!prescription) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h2 className="mb-2 text-xl font-semibold">
                Prescrição não encontrada
              </h2>
              <p className="text-muted-foreground mb-4">
                A prescrição solicitada não foi encontrada ou não existe.
              </p>
              <BackButton />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="default">Ativa</Badge>;
      case "COMPLETED":
        return <Badge variant="secondary">Completa</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelada</Badge>;
      case "EXPIRED":
        return <Badge variant="outline">Expirada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSwalisBadgeVariant = (priority: number) => {
    if (priority <= 2) return "destructive" as const;
    if (priority <= 4) return "secondary" as const;
    return "default" as const;
  };

  const appliedInjections = (injections ?? []).filter(
    (inj) => inj.status === "APPLIED",
  );
  const scheduledInjections = (injections ?? []).filter(
    (inj) => inj.status === "SCHEDULED",
  );

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h1 className="text-3xl font-bold">Detalhes da Prescrição</h1>
          <p className="text-muted-foreground">
            Criada em {prescription.createdAt.toLocaleDateString("pt-BR")}
          </p>
        </div>
        <div className="ml-auto">{getStatusBadge(prescription.status)}</div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Paciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  <Link
                    href={`/patients/${prescription.patient.id}`}
                    className="hover:underline"
                  >
                    {prescription.patient.name}
                  </Link>
                </h3>
                <p className="text-muted-foreground">
                  ID: {prescription.patient.refId}
                </p>
              </div>
              <Link href={`/patients/${prescription.patient.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Paciente
                </Button>
              </Link>
            </div>

            {prescription.patient.birthDate && (
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Data de Nascimento:
                </span>
                <p className="text-lg">
                  {prescription.patient.birthDate.toLocaleDateString("pt-BR")}
                </p>
              </div>
            )}

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold">
                  {prescription.patient.balanceOD}
                </div>
                <div className="text-muted-foreground text-sm">Restante OD</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">
                  {prescription.patient.balanceOS}
                </div>
                <div className="text-muted-foreground text-sm">Restante OE</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detalhes da Prescrição
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-muted-foreground text-sm font-medium">
                Indicação:
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-medium">
                  {prescription.indication?.name}
                </span>
                <Badge variant="outline">{prescription.indication?.code}</Badge>
              </div>
            </div>

            <div>
              <span className="text-muted-foreground text-sm font-medium">
                Medicação:
              </span>
              <div className="mt-1">
                <p className="font-medium">{prescription.medication?.name}</p>
                <p className="text-muted-foreground text-sm">
                  {prescription.medication?.activeSubstance} -{" "}
                  {prescription.medication?.code}
                </p>
              </div>
            </div>

            <div>
              <span className="text-muted-foreground text-sm font-medium">
                Classificação SWALIS:
              </span>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  variant={getSwalisBadgeVariant(
                    prescription.swalis?.priority || 999,
                  )}
                >
                  {prescription.swalis?.code}
                </Badge>
                <span className="text-sm">{prescription.swalis?.name}</span>
              </div>
            </div>

            <div>
              <span className="text-muted-foreground text-sm font-medium">
                Médico Responsável:
              </span>
              <p className="font-medium">{prescription.doctor?.name}</p>
              <p className="text-muted-foreground text-sm">
                {prescription.doctor?.email}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Eye className="h-4 w-4" />
              Prescrito OD
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {prescription.prescribedOD}
            </div>
            <p className="text-muted-foreground text-xs">
              Injeções olho direito
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Eye className="h-4 w-4" />
              Prescrito OE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {prescription.prescribedOS}
            </div>
            <p className="text-muted-foreground text-xs">
              Injeções olho esquerdo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Activity className="h-4 w-4" />
              Aplicadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appliedInjections.length}</div>
            <p className="text-muted-foreground text-xs">
              {injections
                ? Math.round(
                    (appliedInjections.length / injections.length) * 100,
                  )
                : 0}
              % concluído
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              Agendadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scheduledInjections.length}
            </div>
            <p className="text-muted-foreground text-xs">
              Aguardando aplicação
            </p>
          </CardContent>
        </Card>
      </div>

      {prescription.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {prescription.notes}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Syringe className="h-5 w-5" />
            Histórico de Injeções
          </CardTitle>
        </CardHeader>
        <CardContent>
          {injections && injections.length > 0 ? (
            <div className="space-y-4">
              {injections.map((injection) => {
                return (
                  <div
                    key={injection.id}
                    className="hover:bg-muted/50 rounded-lg border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <Badge
                            variant={
                              injection.status === "APPLIED"
                                ? "default"
                                : injection.status === "SCHEDULED"
                                  ? "secondary"
                                  : injection.status === "CANCELLED"
                                    ? "destructive"
                                    : "outline"
                            }
                          >
                            {injection.status === "APPLIED"
                              ? "Aplicada"
                              : injection.status === "SCHEDULED"
                                ? "Agendada"
                                : injection.status === "CANCELLED"
                                  ? "Cancelada"
                                  : "Reagendada"}
                          </Badge>
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {injection.injectionOD} OD / {injection.injectionOS}{" "}
                          OE
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          Agendada:{" "}
                          {injection.scheduledDate.toLocaleDateString("pt-BR")}
                        </div>
                        {injection.appliedAt ? (
                          <div className="text-muted-foreground text-xs">
                            Aplicada:{" "}
                            {injection.appliedAt.toLocaleDateString("pt-BR")}
                          </div>
                        ) : null}
                        {injection.appliedBy ? (
                          <div className="text-muted-foreground text-xs">
                            Por: {injection.appliedBy.name}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground py-8 text-center">
              Nenhuma injeção registrada para esta prescrição.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

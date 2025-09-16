// import { format } from "date-fns";
// import { ptBR } from "date-fns/locale";
import { AlertCircle, CalendarDays, FileText, Syringe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import Link from "next/link";
import { PatientEditor } from "~/components/forms/PatientEditor";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
// import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/server";

export default async function PatientPage({
  params,
}: {
  params: { id: string };
}) {
  const patientId = params.id;
  const patient = await api.patient.getById({ id: patientId });

  if (!patient) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h2 className="mb-2 text-xl font-semibold">
                Paciente não encontrado
              </h2>
              <p className="text-muted-foreground mb-4">
                O paciente solicitado não foi encontrado ou não existe.
              </p>
              <Link href="/prescriptions">
                <Button variant="outline">Voltar</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPrescriptions = patient.prescriptions.length;
  const totalInjections = patient.injections.length;
  const appliedInjections = patient.injections.filter(
    (inj) => inj.status === "APPLIED",
  ).length;

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{patient.name}</h1>
          <p className="text-muted-foreground">ID: {patient.refId}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PatientEditor patient={patient} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Syringe className="h-5 w-5" />
              Restante de Injeções
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{patient.balanceOD}</div>
                <div className="text-muted-foreground text-sm">
                  OD Disponível
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{patient.balanceOS}</div>
                <div className="text-muted-foreground text-sm">
                  OE Disponível
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Prescrito OD:</span>
                <span className="font-mono">{patient.totalPrescribedOD}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Prescrito OE:</span>
                <span className="font-mono">{patient.totalPrescribedOS}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Aplicado OD:</span>
                <span className="font-mono">{patient.totalAppliedOD}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Aplicado OE:</span>
                <span className="font-mono">{patient.totalAppliedOS}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Prescrições
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPrescriptions}</div>
            <p className="text-muted-foreground text-xs">
              Prescrições realizadas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Injeções
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInjections}</div>
            <p className="text-muted-foreground text-xs">Injeções agendadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Injeções Aplicadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appliedInjections}</div>
            <p className="text-muted-foreground text-xs">
              {totalInjections > 0
                ? Math.round((appliedInjections / totalInjections) * 100)
                : 0}
              % concluído
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Prescrições Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patient.prescriptions.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              Nenhuma prescrição encontrada.
            </p>
          ) : (
            <div className="space-y-4">
              {patient.prescriptions.slice(0, 5).map((prescription) => (
                <Link
                  href={`/prescriptions/${prescription.id}`}
                  key={prescription.id}
                  className="block"
                >
                  <div className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-medium">
                          {prescription.indication?.name}
                        </span>
                        <Badge variant="outline">
                          {prescription.swalis?.code}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {prescription.medication?.name} -{" "}
                        {prescription.medication?.activeSubstance}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Prescrito: {prescription.prescribedOD} OD /{" "}
                        {prescription.prescribedOS} OE
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {prescription.createdAt.toLocaleDateString("pt-BR")}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {prescription.doctor?.name}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {patient.prescriptions.length > 5 && (
                <div className="pt-2 text-center">
                  <Link href={`/patients/${patient.id}`}>
                    <Button variant="outline" size="sm">
                      Ver todas as prescrições ({patient.prescriptions.length})
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Injeções Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patient.injections.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              Nenhuma injeção agendada.
            </p>
          ) : (
            <div className="space-y-4">
              {patient.injections.slice(0, 5).map((injection) => (
                <div
                  key={injection.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
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
                      {injection.injectionOD} OD / {injection.injectionOS} OE
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {injection.scheduledDate.toLocaleDateString("pt-BR")}
                    </div>
                    {injection.appliedAt && (
                      <div className="text-muted-foreground text-xs">
                        Aplicada em:{" "}
                        {injection.appliedAt.toLocaleDateString("pt-BR")}
                      </div>
                    )}
                    {injection.appliedBy && (
                      <div className="text-muted-foreground text-xs">
                        Por: {injection.appliedBy.name}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {patient.injections.length > 5 && (
                <div className="pt-2 text-center">
                  <Link href={`/patients/${patient.id}`}>
                    <Button variant="outline" size="sm">
                      Ver todas as injeções ({patient.injections.length})
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

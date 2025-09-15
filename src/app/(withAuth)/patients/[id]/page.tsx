"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertCircle,
  CalendarDays,
  ChevronDownIcon,
  FileText,
  Syringe,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import {
  patientBasicInfoSchema,
  type PatientBasicInfoFormData,
} from "~/lib/schemas/patient";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function PatientPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<PatientBasicInfoFormData>({
    resolver: zodResolver(patientBasicInfoSchema),
    defaultValues: {
      refId: "",
      name: "",
      birthDate: undefined,
    },
  });

  const {
    data: patient,
    isLoading,
    refetch,
  } = api.patient.getById.useQuery({ id: patientId }, { enabled: !!patientId });

  const updatePatientMutation = api.patient.update.useMutation({
    onSuccess: () => {
      toast.success("Paciente atualizado com sucesso!");
      setIsEditing(false);
      void refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar paciente: ${error.message}`);
    },
  });

  const handleEdit = () => {
    if (patient) {
      form.reset({
        refId: patient.refId,
        name: patient.name,
        birthDate: patient.birthDate ?? undefined,
      });
      setIsEditing(true);
    }
  };

  const onSubmit = (data: PatientBasicInfoFormData) => {
    if (!patient) return;

    updatePatientMutation.mutate({
      id: patient.id,
      refId: data.refId,
      name: data.name,
      birthDate: data.birthDate,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

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
              <Button onClick={() => router.back()}>Voltar</Button>
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
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{patient.name}</h1>
          <p className="text-muted-foreground">ID: {patient.refId}</p>
        </div>
        <Button onClick={handleEdit} variant="outline">
          Editar Paciente
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Patient Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Paciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="refId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID de Referência</FormLabel>
                        <FormControl>
                          <Input placeholder="ID do paciente" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data de Nascimento (Opcional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: ptBR })
                                ) : (
                                  <span>Selecionar data</span>
                                )}
                                <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              captionLayout="dropdown"
                              locale={ptBR}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={updatePatientMutation.isPending}
                    >
                      {updatePatientMutation.isPending
                        ? "Salvando..."
                        : "Salvar"}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancel}
                      variant="outline"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="space-y-3">
                <div>
                  <Label className="text-muted-foreground text-sm font-medium">
                    ID de Referência
                  </Label>
                  <p className="font-mono text-lg">{patient.refId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm font-medium">
                    Nome
                  </Label>
                  <p className="text-lg">{patient.name}</p>
                </div>
                {patient.birthDate && (
                  <div>
                    <Label className="text-muted-foreground text-sm font-medium">
                      Data de Nascimento
                    </Label>
                    <p className="text-lg">
                      {format(patient.birthDate, "PPP", { locale: ptBR })}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground text-sm font-medium">
                    Data de Cadastro
                  </Label>
                  <p className="text-lg">
                    {patient.createdAt.toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Balance Information Card */}
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

      {/* Statistics Cards */}
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

      {/* Recent Prescriptions */}
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
                <div
                  key={prescription.id}
                  className="hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg border p-4"
                  onClick={() =>
                    router.push(`/prescriptions/${prescription.id}`)
                  }
                >
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
              ))}
              {patient.prescriptions.length > 5 && (
                <div className="pt-2 text-center">
                  <Button variant="outline" size="sm">
                    Ver todas as prescrições ({patient.prescriptions.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Injections */}
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
                  <Button variant="outline" size="sm">
                    Ver todas as injeções ({patient.injections.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

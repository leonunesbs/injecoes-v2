"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronDownIcon, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
import {
  patientBasicInfoSchema,
  type PatientBasicInfoFormData,
} from "~/lib/schemas/patient";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

type PatientEditorProps = {
  patient: {
    id: string;
    refId: string;
    name: string;
    birthDate: Date | null;
    createdAt: Date;
  };
};

export function PatientEditor({ patient }: PatientEditorProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<PatientBasicInfoFormData>({
    resolver: zodResolver(patientBasicInfoSchema),
    defaultValues: {
      refId: patient.refId ?? "",
      name: patient.name ?? "",
      birthDate: patient.birthDate ?? undefined,
    },
  });

  const updatePatientMutation = api.patient.update.useMutation({
    onSuccess: () => {
      toast.success("Paciente atualizado com sucesso!");
      setIsEditing(false);
      router.refresh();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar paciente: ${error.message}`);
    },
  });

  const onSubmit = (data: PatientBasicInfoFormData) => {
    updatePatientMutation.mutate({
      id: patient.id,
      refId: data.refId,
      name: data.name,
      birthDate: data.birthDate ?? undefined,
    });
  };

  return (
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
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
                  {updatePatientMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    form.reset({
                      refId: patient.refId ?? "",
                      name: patient.name ?? "",
                      birthDate: patient.birthDate ?? undefined,
                    });
                  }}
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
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Editar Paciente
            </Button>
          </div>
        )}
        <Separator className="hidden" />
      </CardContent>
    </Card>
  );
}

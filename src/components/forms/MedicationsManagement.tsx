"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Prisma } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MedicationTable } from "~/components/tables/MedicationTable";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import {
  medicationSchema,
  type MedicationFormData,
} from "~/lib/schemas/medication";
import { api } from "~/trpc/react";

type Medication = Prisma.MedicationGetPayload<{
  select: {
    id: true;
    name: true;
    code: true;
    activeSubstance: true;
    isActive: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

interface MedicationsManagementProps {
  initialData: Medication[];
}

export function MedicationsManagement({
  initialData,
}: MedicationsManagementProps) {
  const utils = api.useUtils();
  const { data: medications } = api.settings.getMedications.useQuery(
    undefined,
    {
      initialData,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const form = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      code: "",
      name: "",
      activeSubstance: "",
      isActive: true,
    },
  });

  const createMedication = api.settings.createMedication.useMutation({
    onSuccess: () => {
      toast.success("Medicamento criado com sucesso!");
      void utils.settings.getMedications.invalidate();
      form.reset();
    },
    onError: (error) => {
      toast.error(`Erro ao criar medicamento: ${error.message}`);
    },
  });

  const handleMedicationSubmit = (data: MedicationFormData) => {
    createMedication.mutate(data);
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Medicamentos</h2>
        <p className="text-muted-foreground">
          Configure os medicamentos disponíveis para injeções intravítreas.
          Inclua o nome comercial e a substância ativa de cada medicamento.
        </p>
      </div>

      {medications && medications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Medicamentos Cadastrados</CardTitle>
            <CardDescription>
              Visualize, edite ou exclua os medicamentos existentes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MedicationTable
              data={medications.map((med) => ({
                id: med.id,
                code: med.code,
                name: med.name,
                activeSubstance: med.activeSubstance,
                isActive: med.isActive,
              }))}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Novo Medicamento</CardTitle>
          <CardDescription>
            Adicione um novo medicamento ao sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleMedicationSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: LUCENTIS, AVASTIN, EYLIA"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Código único para identificação do medicamento
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Comercial</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome comercial do medicamento"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Nome comercial do medicamento
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activeSubstance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Substância Ativa</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Substância ativa do medicamento"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Substância ativa principal do medicamento
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Ativo</FormLabel>
                      <FormDescription>
                        Indica se este medicamento está disponível para uso
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={createMedication.isPending}
              >
                {createMedication.isPending
                  ? "Salvando..."
                  : "Salvar Medicamento"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

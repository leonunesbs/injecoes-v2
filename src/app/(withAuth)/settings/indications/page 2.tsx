"use client";

import { toast } from "sonner";
import { IndicationForm } from "~/components/forms/IndicationForm";
import { IndicationTable } from "~/components/tables/IndicationTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type IndicationFormData } from "~/lib/schemas/settings";
import { api } from "~/trpc/react";

export default function IndicationsPage() {
  const utils = api.useUtils();

  // Query para buscar as indicações
  const { data: indications } = api.settings.getIndications.useQuery();

  const createIndication = api.settings.createIndication.useMutation({
    onSuccess: () => {
      toast.success("Indicação criada com sucesso!");
      void utils.settings.getIndications.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao criar indicação: ${error.message}`);
    },
  });

  const handleIndicationSubmit = (data: IndicationFormData) => {
    createIndication.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Indicações Médicas
        </h1>
        <p className="text-muted-foreground">
          Configure as indicações médicas disponíveis no sistema. Estas são as
          condições que justificam o uso de injeções intravítreas.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nova Indicação</CardTitle>
            <CardDescription>
              Adicione uma nova indicação médica ao sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IndicationForm
              onSubmit={handleIndicationSubmit}
              isLoading={createIndication.isPending}
            />
          </CardContent>
        </Card>

        {indications && indications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Indicações Cadastradas</CardTitle>
              <CardDescription>
                Visualize, edite ou exclua as indicações existentes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IndicationTable data={indications} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

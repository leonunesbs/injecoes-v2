"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Prisma } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { IndicationTable } from "~/components/tables/IndicationTable";
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
import { Textarea } from "~/components/ui/textarea";
import {
  indicationSchema,
  type IndicationFormData,
} from "~/lib/schemas/indication";
import { api } from "~/trpc/react";

type Indication = Prisma.IndicationGetPayload<{
  select: {
    id: true;
    name: true;
    code: true;
    description: true;
    isActive: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

interface IndicationsManagementProps {
  initialData: Indication[];
}

export function IndicationsManagement({
  initialData,
}: IndicationsManagementProps) {
  const utils = api.useUtils();
  const { data: indications } = api.settings.getIndications.useQuery(
    undefined,
    {
      initialData,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const form = useForm<IndicationFormData>({
    resolver: zodResolver(indicationSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      isActive: true,
    },
  });

  const createIndication = api.settings.createIndication.useMutation({
    onSuccess: () => {
      toast.success("Indicação criada com sucesso!");
      void utils.settings.getIndications.invalidate();
      form.reset();
    },
    onError: (error) => {
      toast.error(`Erro ao criar indicação: ${error.message}`);
    },
  });

  const handleIndicationSubmit = (data: IndicationFormData) => {
    createIndication.mutate(data);
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Indicações Médicas
        </h2>
        <p className="text-muted-foreground">
          Configure as indicações médicas disponíveis no sistema. Estas são as
          condições que justificam o uso de injeções intravítreas.
        </p>
      </div>

      {indications && indications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Indicações Cadastradas</CardTitle>
            <CardDescription>
              Visualize, edite ou exclua as indicações existentes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IndicationTable
              data={indications.map((indication) => ({
                id: indication.id,
                code: indication.code,
                name: indication.name,
                description: indication.description ?? "",
                isActive: indication.isActive,
              }))}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Nova Indicação</CardTitle>
          <CardDescription>
            Adicione uma nova indicação médica ao sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleIndicationSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: RD/EMD, RD/HV, DMRI" {...field} />
                    </FormControl>
                    <FormDescription>
                      Código único para identificação da indicação
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
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome completo da indicação"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Nome descritivo da indicação médica
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descrição detalhada da indicação..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Descrição opcional da indicação médica
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
                        Indica se esta indicação está disponível para uso
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
                disabled={createIndication.isPending}
              >
                {createIndication.isPending
                  ? "Salvando..."
                  : "Salvar Indicação"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

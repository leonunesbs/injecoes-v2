"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Prisma } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SwalisTable } from "~/components/tables/SwalisTable";
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
  swalisClassificationSchema,
  type SwalisClassificationFormData,
} from "~/lib/schemas/swalis";
import { api } from "~/trpc/react";

type SwalisClassification = Prisma.SwalisClassificationGetPayload<{
  select: {
    id: true;
    name: true;
    code: true;
    priority: true;
    description: true;
    isActive: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

interface SwalisManagementProps {
  initialData: SwalisClassification[];
}

export function SwalisManagement({ initialData }: SwalisManagementProps) {
  const utils = api.useUtils();
  const { data: swalisClassifications } =
    api.settings.getSwalisClassifications.useQuery(undefined, {
      initialData,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  const form = useForm<SwalisClassificationFormData>({
    resolver: zodResolver(swalisClassificationSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      priority: 1,
      isActive: true,
    },
  });

  const createSwalisClassification =
    api.settings.createSwalisClassification.useMutation({
      onSuccess: () => {
        toast.success("Classificação Swalis criada com sucesso!");
        void utils.settings.getSwalisClassifications.invalidate();
        form.reset();
      },
      onError: (error) => {
        toast.error(`Erro ao criar classificação Swalis: ${error.message}`);
      },
    });

  const handleSwalisSubmit = (data: SwalisClassificationFormData) => {
    createSwalisClassification.mutate(data);
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Classificação Swalis
        </h2>
        <p className="text-muted-foreground">
          Configure as classificações de prioridade Swalis para triagem de
          pacientes. Defina códigos, nomes e níveis de prioridade para cada
          classificação.
        </p>
      </div>

      {swalisClassifications && swalisClassifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Classificações Swalis Cadastradas</CardTitle>
            <CardDescription>
              Visualize, edite ou exclua as classificações existentes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SwalisTable
              data={swalisClassifications.map((item) => ({
                id: item.id,
                code: item.code,
                name: item.name,
                description: item.description ?? "",
                priority: item.priority,
                isActive: item.isActive,
              }))}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Nova Classificação Swalis</CardTitle>
          <CardDescription>
            Adicione uma nova classificação de prioridade Swalis ao sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSwalisSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: A1, A2, B, C, D" {...field} />
                    </FormControl>
                    <FormDescription>
                      Código único para identificação da classificação
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
                      <Input placeholder="Nome da classificação" {...field} />
                    </FormControl>
                    <FormDescription>
                      Nome descritivo da classificação
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
                        placeholder="Descrição detalhada da classificação..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Descrição detalhada da classificação Swalis
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        placeholder="1-10 (1 = mais urgente)"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Prioridade da classificação (1 = mais urgente, 10 = menos
                      urgente)
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
                        Indica se esta classificação está disponível para uso
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
                disabled={createSwalisClassification.isPending}
              >
                {createSwalisClassification.isPending
                  ? "Salvando..."
                  : "Salvar Classificação"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

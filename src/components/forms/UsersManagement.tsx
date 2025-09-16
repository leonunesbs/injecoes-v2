"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Prisma } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserTable } from "~/components/tables/UserTable";
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
import { userSchema, type UserFormData } from "~/lib/schemas/user";
import { api } from "~/trpc/react";

type User = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    emailVerified: true;
    image: true;
    createdAt: true;
    updatedAt: true;
    isStaff: true;
  };
}>;

interface UsersManagementProps {
  initialData: User[];
}

export function UsersManagement({ initialData }: UsersManagementProps) {
  const utils = api.useUtils();
  const { data: users } = api.settings.getUsers.useQuery(undefined, {
    initialData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      image: "",
    },
  });

  const createUser = api.settings.createUser.useMutation({
    onSuccess: () => {
      toast.success("Usuário criado com sucesso!");
      void utils.settings.getUsers.invalidate();
      form.reset();
    },
    onError: (error) => {
      toast.error(`Erro ao criar usuário: ${error.message}`);
    },
  });

  const handleUserSubmit = (data: UserFormData) => {
    createUser.mutate(data);
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Usuários do Sistema
        </h2>
        <p className="text-muted-foreground">
          Gerencie os usuários que têm acesso ao sistema de injeções
          intravítreas.
        </p>
      </div>

      {users && users.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Usuários Cadastrados</CardTitle>
            <CardDescription>
              Visualize, edite ou exclua os usuários existentes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserTable
              data={users.map((user) => ({
                id: user.id,
                name: user.name ?? "",
                email: user.email ?? "",
                image: user.image ?? "",
              }))}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Novo Usuário</CardTitle>
          <CardDescription>
            Adicione um novo usuário ao sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUserSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome completo do usuário"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Nome completo do usuário</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="usuario@exemplo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Email único para login no sistema
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://exemplo.com/imagem.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL da imagem de perfil do usuário
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={createUser.isPending}
              >
                {createUser.isPending ? "Salvando..." : "Salvar Usuário"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

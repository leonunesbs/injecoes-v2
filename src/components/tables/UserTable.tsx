"use client";

import type { Prisma } from "@prisma/client";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { type UserFormData } from "~/lib/schemas/user";
import { api } from "~/trpc/react";

type UserTableData = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    image: true;
  };
}>;

interface UserTableProps {
  data: UserTableData[];
}

export function UserTable({ data }: UserTableProps) {
  const utils = api.useUtils();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<UserFormData>({
    name: "",
    email: "",
    image: "",
  });

  const updateUser = api.settings.updateUser.useMutation({
    onSuccess: () => {
      toast.success("Usuário atualizado com sucesso!");
      void utils.settings.getUsers.invalidate();
      setEditingId(null);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar usuário: ${error.message}`);
    },
  });

  const deleteUser = api.settings.deleteUser.useMutation({
    onSuccess: () => {
      toast.success("Usuário excluído com sucesso!");
      void utils.settings.getUsers.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao excluir usuário: ${error.message}`);
    },
  });

  const handleEdit = (item: UserTableData) => {
    setEditingId(item.id);
    setEditData({
      name: item.name ?? "",
      email: item.email ?? "",
      image: item.image ?? "",
    });
  };

  const handleSave = () => {
    if (editingId) {
      updateUser.mutate({
        id: editingId,
        ...editData,
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({
      name: "",
      email: "",
      image: "",
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      deleteUser.mutate({ id });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Imagem</TableHead>
            <TableHead className="w-[120px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {editingId === item.id ? (
                  <Input
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="h-8"
                  />
                ) : (
                  <span className="font-medium">{item.name ?? "Sem nome"}</span>
                )}
              </TableCell>
              <TableCell>
                {editingId === item.id ? (
                  <Input
                    type="email"
                    value={editData.email}
                    onChange={(e) =>
                      setEditData({ ...editData, email: e.target.value })
                    }
                    className="h-8"
                  />
                ) : (
                  <span className="text-muted-foreground">
                    {item.email ?? "Sem email"}
                  </span>
                )}
              </TableCell>
              <TableCell>
                {editingId === item.id ? (
                  <Input
                    value={editData.image}
                    onChange={(e) =>
                      setEditData({ ...editData, image: e.target.value })
                    }
                    className="h-8"
                    placeholder="URL da imagem"
                  />
                ) : (
                  <span className="text-muted-foreground">
                    {item.image ? "Imagem definida" : "Sem imagem"}
                  </span>
                )}
              </TableCell>
              <TableCell>
                {editingId === item.id ? (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleSave}
                      disabled={updateUser.isPending}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancel}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteUser.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

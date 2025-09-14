"use client";

import type { Prisma } from "@prisma/client";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Textarea } from "~/components/ui/textarea";
import { type SwalisClassificationFormData } from "~/lib/schemas/swalis";
import { api } from "~/trpc/react";

type SwalisTableData = Prisma.SwalisClassificationGetPayload<{
  select: {
    id: true;
    code: true;
    name: true;
    description: true;
    priority: true;
    isActive: true;
  };
}>;

interface SwalisTableProps {
  data: SwalisTableData[];
}

export function SwalisTable({ data }: SwalisTableProps) {
  const utils = api.useUtils();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<SwalisClassificationFormData>({
    code: "",
    name: "",
    description: "",
    priority: 1,
    isActive: true,
  });

  const updateSwalisClassification =
    api.settings.updateSwalisClassification.useMutation({
      onSuccess: () => {
        toast.success("Classificação Swalis atualizada com sucesso!");
        void utils.settings.getSwalisClassifications.invalidate();
        setEditingId(null);
      },
      onError: (error) => {
        toast.error(`Erro ao atualizar classificação Swalis: ${error.message}`);
      },
    });

  const deleteSwalisClassification =
    api.settings.deleteSwalisClassification.useMutation({
      onSuccess: () => {
        toast.success("Classificação Swalis excluída com sucesso!");
        void utils.settings.getSwalisClassifications.invalidate();
      },
      onError: (error) => {
        toast.error(`Erro ao excluir classificação Swalis: ${error.message}`);
      },
    });

  const handleEdit = (item: SwalisClassificationFormData & { id: string }) => {
    setEditingId(item.id);
    setEditData({
      code: item.code,
      name: item.name,
      description: item.description,
      priority: item.priority,
      isActive: item.isActive,
    });
  };

  const handleSave = () => {
    if (editingId) {
      updateSwalisClassification.mutate({
        id: editingId,
        ...editData,
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({
      code: "",
      name: "",
      description: "",
      priority: 1,
      isActive: true,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta classificação Swalis?")) {
      deleteSwalisClassification.mutate({ id });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="w-[100px]">Prioridade</TableHead>
            <TableHead className="w-[100px]">Ativo</TableHead>
            <TableHead className="w-[120px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {editingId === item.id ? (
                  <Input
                    value={editData.code}
                    onChange={(e) =>
                      setEditData({ ...editData, code: e.target.value })
                    }
                    className="h-8"
                  />
                ) : (
                  <span className="font-medium">{item.code}</span>
                )}
              </TableCell>
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
                  item.name
                )}
              </TableCell>
              <TableCell>
                {editingId === item.id ? (
                  <Textarea
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                    className="min-h-[32px] resize-none"
                    rows={1}
                  />
                ) : (
                  <span className="text-muted-foreground">
                    {item.description}
                  </span>
                )}
              </TableCell>
              <TableCell>
                {editingId === item.id ? (
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={editData.priority}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        priority: parseInt(e.target.value) || 1,
                      })
                    }
                    className="h-8 w-20"
                  />
                ) : (
                  <span className="font-medium">{item.priority}</span>
                )}
              </TableCell>
              <TableCell>
                {editingId === item.id ? (
                  <Switch
                    checked={editData.isActive}
                    onCheckedChange={(checked) =>
                      setEditData({ ...editData, isActive: checked })
                    }
                  />
                ) : (
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      item.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.isActive ? "Ativo" : "Inativo"}
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
                      disabled={updateSwalisClassification.isPending}
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
                      disabled={deleteSwalisClassification.isPending}
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

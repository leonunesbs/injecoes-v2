"use client";

import type { Prisma } from "@prisma/client";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
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
import { type IndicationFormData } from "~/lib/schemas/indication";
import { api } from "~/trpc/react";

type IndicationTableData = Prisma.IndicationGetPayload<{
  select: {
    id: true;
    code: true;
    name: true;
    description: true;
    isActive: true;
  };
}>;

interface IndicationTableProps {
  data: IndicationTableData[];
}

export function IndicationTable({ data }: IndicationTableProps) {
  const utils = api.useUtils();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<IndicationFormData>({
    code: "",
    name: "",
    description: "",
    isActive: true,
  });

  const updateIndication = api.settings.updateIndication.useMutation({
    onSuccess: () => {
      toast.success("Indicação atualizada com sucesso!");
      void utils.settings.getIndications.invalidate();
      setEditingId(null);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar indicação: ${error.message}`);
    },
  });

  const deleteIndication = api.settings.deleteIndication.useMutation({
    onSuccess: () => {
      toast.success("Indicação excluída com sucesso!");
      void utils.settings.getIndications.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao excluir indicação: ${error.message}`);
    },
  });

  const handleEdit = (item: IndicationTableData) => {
    setEditingId(item.id);
    setEditData({
      code: item.code,
      name: item.name,
      description: item.description ?? "",
      isActive: item.isActive,
    });
  };

  const handleSave = () => {
    if (editingId) {
      updateIndication.mutate({
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
      isActive: true,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta indicação?")) {
      deleteIndication.mutate({ id });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
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
                    {item.description ?? "Sem descrição"}
                  </span>
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
                  <Badge variant={item.isActive ? "default" : "destructive"}>
                    {item.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {editingId === item.id ? (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleSave}
                      disabled={updateIndication.isPending}
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
                      disabled={deleteIndication.isPending}
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

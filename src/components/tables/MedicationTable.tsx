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
import { type MedicationFormData } from "~/lib/schemas/medication";
import { api } from "~/trpc/react";

type MedicationTableData = Prisma.MedicationGetPayload<{
  select: {
    id: true;
    code: true;
    name: true;
    activeSubstance: true;
    isActive: true;
  };
}>;

interface MedicationTableProps {
  data: MedicationTableData[];
}

export function MedicationTable({ data }: MedicationTableProps) {
  const utils = api.useUtils();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<MedicationFormData>({
    code: "",
    name: "",
    activeSubstance: "",
    isActive: true,
  });

  const updateMedication = api.settings.updateMedication.useMutation({
    onSuccess: () => {
      toast.success("Medicamento atualizado com sucesso!");
      void utils.settings.getMedications.invalidate();
      setEditingId(null);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar medicamento: ${error.message}`);
    },
  });

  const deleteMedication = api.settings.deleteMedication.useMutation({
    onSuccess: () => {
      toast.success("Medicamento excluído com sucesso!");
      void utils.settings.getMedications.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao excluir medicamento: ${error.message}`);
    },
  });

  const handleEdit = (item: MedicationFormData & { id: string }) => {
    setEditingId(item.id);
    setEditData({
      code: item.code,
      name: item.name,
      activeSubstance: item.activeSubstance,
      isActive: item.isActive,
    });
  };

  const handleSave = () => {
    if (editingId) {
      updateMedication.mutate({
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
      activeSubstance: "",
      isActive: true,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este medicamento?")) {
      deleteMedication.mutate({ id });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Substância Ativa</TableHead>
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
                  <Input
                    value={editData.activeSubstance}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        activeSubstance: e.target.value,
                      })
                    }
                    className="h-8"
                  />
                ) : (
                  item.activeSubstance
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
                      disabled={updateMedication.isPending}
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
                      disabled={deleteMedication.isPending}
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

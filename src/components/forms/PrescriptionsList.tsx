"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Prisma } from "@prisma/client";

type Prescription = Prisma.PatientGetPayload<{
  select: {
    id: true;
    name: true;
    refId: true;
    balanceOD: true;
    balanceOS: true;
    createdAt: true;
    indication: {
      select: {
        name: true;
        code: true;
      };
    };
    medication: {
      select: {
        name: true;
        code: true;
      };
    };
    swalis: {
      select: {
        name: true;
        code: true;
      };
    };
  };
}>;

interface PrescriptionsListProps {
  prescriptions: Prescription[];
}

function PrescriptionsTable({ prescriptions }: PrescriptionsListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left font-medium">Paciente</th>
            <th className="px-4 py-3 text-left font-medium">Indicação</th>
            <th className="px-4 py-3 text-left font-medium">Medicação</th>
            <th className="px-4 py-3 text-left font-medium">Swalis</th>
            <th className="px-4 py-3 text-left font-medium">Saldo OD</th>
            <th className="px-4 py-3 text-left font-medium">Saldo OE</th>
            <th className="px-4 py-3 text-left font-medium">Data</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((prescription) => (
            <tr key={prescription.id} className="hover:bg-muted/50 border-b">
              <td className="px-4 py-3">
                <div>
                  <div className="font-medium">{prescription.name}</div>
                  <div className="text-muted-foreground text-sm">
                    ID: {prescription.refId}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div>
                  <div className="font-medium">
                    {prescription.indication?.name}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {prescription.indication?.code}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div>
                  <div className="font-medium">
                    {prescription.medication?.name}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {prescription.medication?.code}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div>
                  <div className="font-medium">{prescription.swalis?.name}</div>
                  <div className="text-muted-foreground text-sm">
                    {prescription.swalis?.code}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="font-mono font-medium">
                  {prescription.balanceOD}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="font-mono font-medium">
                  {prescription.balanceOS}
                </span>
              </td>
              <td className="text-muted-foreground px-4 py-3 text-sm">
                {prescription.createdAt.toLocaleDateString("pt-BR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="text-muted-foreground mb-4">
        Nenhuma prescrição encontrada
      </div>
      <Link href="/prescriptions/new">
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Criar primeira prescrição
        </Button>
      </Link>
    </div>
  );
}

export function PrescriptionsList({ prescriptions }: PrescriptionsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prescrições Realizadas</CardTitle>
      </CardHeader>
      <CardContent>
        {prescriptions.length === 0 ? (
          <EmptyState />
        ) : (
          <PrescriptionsTable prescriptions={prescriptions} />
        )}
      </CardContent>
    </Card>
  );
}

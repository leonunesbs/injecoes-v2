"use client";

import { type Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PatientIndicationForm } from "~/components/forms/PatientIndicationForm";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { type PatientIndicationFormData } from "~/lib/schemas/patient";
import { api } from "~/trpc/react";

type PatientSelect = Prisma.PatientGetPayload<{
  select: {
    id: true;
    refId: true;
    name: true;
  };
}>;

type IndicationSelect = Prisma.IndicationGetPayload<{
  select: {
    id: true;
    code: true;
    name: true;
  };
}>;

type MedicationSelect = Prisma.MedicationGetPayload<{
  select: {
    id: true;
    code: true;
    name: true;
  };
}>;

type SwalisClassificationSelect = Prisma.SwalisClassificationGetPayload<{
  select: {
    id: true;
    code: true;
    name: true;
  };
}>;

interface NewPrescriptionFormProps {
  patients: PatientSelect[];
  indications: IndicationSelect[];
  medications: MedicationSelect[];
  swalisClassifications: SwalisClassificationSelect[];
}

export function NewPrescriptionForm({
  patients,
  indications,
  medications,
  swalisClassifications,
}: NewPrescriptionFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const createPrescription =
    api.prescriptions.createPatientIndication.useMutation({
      onSuccess: () => {
        router.push("/prescriptions");
      },
      onError: (error) => {
        console.error("Erro ao criar prescrição:", error);
        setIsLoading(false);
      },
    });

  const handleSubmit = async (data: PatientIndicationFormData) => {
    setIsLoading(true);
    try {
      await createPrescription.mutateAsync(data);
    } catch (error) {
      console.error("Erro ao criar prescrição:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados da Prescrição</CardTitle>
      </CardHeader>
      <CardContent>
        <PatientIndicationForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          patients={patients}
          indications={indications}
          medications={medications}
          swalisClassifications={swalisClassifications}
        />
      </CardContent>
    </Card>
  );
}

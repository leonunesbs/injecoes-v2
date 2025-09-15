"use client";

import { type Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PatientIndicationForm } from "~/components/forms/PatientIndicationForm";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { type PatientIndicationFormData } from "~/lib/schemas/patient";
import { api } from "~/trpc/react";
import {
  createPatientPdfBlob,
  fillPatientPdfTemplateWithData,
  type PatientData,
} from "~/utils/patientPdfGenerator";

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
    activeSubstance: true;
  };
}>;

type SwalisClassificationSelect = Prisma.SwalisClassificationGetPayload<{
  select: {
    id: true;
    code: true;
    name: true;
    description: true;
  };
}>;

interface NewPrescriptionFormProps {
  indications: IndicationSelect[];
  medications: MedicationSelect[];
  swalisClassifications: SwalisClassificationSelect[];
}

export function NewPrescriptionForm({
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

      // Generate PDF after successful prescription creation
      await generatePatientPdf(
        data,
        indications,
        medications,
        swalisClassifications,
      );
    } catch (error) {
      console.error("Erro ao criar prescrição:", error);
    }
  };

  const generatePatientPdf = async (
    data: PatientIndicationFormData,
    indications: IndicationSelect[],
    medications: MedicationSelect[],
    swalisClassifications: SwalisClassificationSelect[],
  ) => {
    try {
      // Find the selected items
      const selectedIndication = indications.find(
        (ind) => ind.id === data.indicationId,
      );
      const selectedMedication = medications.find(
        (med) => med.id === data.medicationId,
      );
      const selectedSwalis = swalisClassifications.find(
        (swalis) => swalis.id === data.swalisId,
      );

      // Prepare data for PDF generation
      const patientData: PatientData = {
        refId: data.patientRefId.toString(),
        name: data.patientName,
        indication: data.indicationOther ?? selectedIndication?.name ?? "",
        medication: data.medicationOther ?? selectedMedication?.name ?? "",
        swalisClassification: selectedSwalis?.code ?? "",
        observations: data.observations ?? "",
        remainingOD: data.indicationOD,
        remainingOS: data.indicationOE,
        startEye: data.startWithOD ? "OD" : "OS",
      };

      // Load the PDF template
      const modelPDFBytes = await fetch("/modeloAA.pdf").then((res) =>
        res.arrayBuffer(),
      );

      // Generate PDF
      const pdfBytes = await fillPatientPdfTemplateWithData(
        patientData,
        modelPDFBytes,
      );
      const blobUrl = createPatientPdfBlob(pdfBytes);

      // Open PDF in new window
      const newWindow = window.open(blobUrl, "_blank");
      if (!newWindow) {
        alert("Por favor, permita pop-ups para visualizar o PDF.");
      }
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF. Verifique o console para mais detalhes.");
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
          indications={indications}
          medications={medications}
          swalisClassifications={swalisClassifications}
        />
      </CardContent>
    </Card>
  );
}

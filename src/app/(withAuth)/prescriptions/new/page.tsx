import { NewPrescriptionForm } from "~/components/forms/NewPrescriptionForm";
import { api } from "~/trpc/server";

export default async function NewPrescriptionPage() {
  // Buscar dados no servidor
  const [patients, indications, medications, swalisClassifications] =
    await Promise.all([
      api.prescriptions.getPatients(),
      api.prescriptions.getIndications(),
      api.prescriptions.getMedications(),
      api.prescriptions.getSwalisClassifications(),
    ]);

  return (
    <NewPrescriptionForm
      patients={patients}
      indications={indications}
      medications={medications}
      swalisClassifications={swalisClassifications}
    />
  );
}

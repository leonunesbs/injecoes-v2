import { NewPrescriptionForm } from "~/components/forms/NewPrescriptionForm";
import { api } from "~/trpc/server";

export default async function NewPrescriptionPage() {
  // Buscar dados no servidor (removendo busca de pacientes)
  const [indications, medications, swalisClassifications] = await Promise.all([
    api.settings.getIndications(),
    api.prescriptions.getMedications(),
    api.prescriptions.getSwalisClassifications(),
  ]);

  return (
    <NewPrescriptionForm
      indications={indications}
      medications={medications}
      swalisClassifications={swalisClassifications}
    />
  );
}

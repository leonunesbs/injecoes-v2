import { MedicationsManagement } from "~/components/forms/MedicationsManagement";
import { api } from "~/trpc/server";

export default async function MedicationsPage() {
  const medications = await api.settings.getMedications();

  return <MedicationsManagement initialData={medications} />;
}

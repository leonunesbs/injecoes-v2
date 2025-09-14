import { PrescriptionsList } from "~/components/forms/PrescriptionsList";
import { api } from "~/trpc/server";

export default async function PrescriptionsPage() {
  const prescriptions = await api.prescriptions.getPatientIndications();

  return <PrescriptionsList prescriptions={prescriptions} />;
}

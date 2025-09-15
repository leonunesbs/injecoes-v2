import { PrescriptionsList } from "~/components/forms/PrescriptionsList";
import { api } from "~/trpc/server";

export default async function PrescriptionsPage() {
  const prescriptions = await api.prescriptions.getPrescriptions();

  return <PrescriptionsList prescriptions={prescriptions} />;
}

import { IndicationsManagement } from "~/components/forms/IndicationsManagement";
import { api } from "~/trpc/server";

export default async function IndicationsPage() {
  const indications = await api.settings.getIndications();

  return <IndicationsManagement initialData={indications} />;
}

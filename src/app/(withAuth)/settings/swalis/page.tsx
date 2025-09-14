import { SwalisManagement } from "~/components/forms/SwalisManagement";
import { api } from "~/trpc/server";

export default async function SwalisPage() {
  const swalisClassifications = await api.settings.getSwalisClassifications();

  return <SwalisManagement swalisClassifications={swalisClassifications} />;
}

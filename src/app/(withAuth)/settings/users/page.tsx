import { UsersManagement } from "~/components/forms/UsersManagement";
import { api } from "~/trpc/server";

export default async function UsersPage() {
  const users = await api.settings.getUsers();

  return <UsersManagement initialData={users} />;
}

import { redirect } from "next/navigation";

export default function SettingsPage() {
  // Redireciona para a primeira tab por padrão
  redirect("/settings/indications");
}

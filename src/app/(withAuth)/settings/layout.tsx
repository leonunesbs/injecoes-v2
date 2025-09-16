"use client";

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  // Determina qual tab está ativa baseado na URL
  const getActiveTab = () => {
    if (pathname.includes("/indications")) return "indications";
    if (pathname.includes("/medications")) return "medications";
    if (pathname.includes("/swalis")) return "swalis";
    if (pathname.includes("/users")) return "users";
    return "indications"; // default
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Configurações do Sistema
        </h1>
        <p className="text-muted-foreground">
          Gerencie as configurações básicas do sistema de injeções
        </p>
      </div>

      <Tabs value={getActiveTab()} className="space-y-6">
        <TabsList className="bg-muted/50 grid h-auto w-full grid-cols-2 gap-1 p-1 lg:grid-cols-4">
          <TabsTrigger
            value="indications"
            asChild
            className="h-auto min-h-[36px] flex-1 px-2 py-2 text-xs sm:text-sm"
          >
            <Link href="/settings/indications" className="w-full text-center">
              Indicações
            </Link>
          </TabsTrigger>
          <TabsTrigger
            value="medications"
            asChild
            className="h-auto min-h-[36px] flex-1 px-2 py-2 text-xs sm:text-sm"
          >
            <Link href="/settings/medications" className="w-full text-center">
              Medicamentos
            </Link>
          </TabsTrigger>
          <TabsTrigger
            value="swalis"
            asChild
            className="h-auto min-h-[36px] flex-1 px-2 py-2 text-xs sm:text-sm"
          >
            <Link href="/settings/swalis" className="w-full text-center">
              Swalis
            </Link>
          </TabsTrigger>
          <TabsTrigger
            value="users"
            asChild
            className="h-auto min-h-[36px] flex-1 px-2 py-2 text-xs sm:text-sm"
          >
            <Link href="/settings/users" className="w-full text-center">
              Usuários
            </Link>
          </TabsTrigger>
        </TabsList>

        <div className="space-y-6">{children}</div>
      </Tabs>
    </div>
  );
}

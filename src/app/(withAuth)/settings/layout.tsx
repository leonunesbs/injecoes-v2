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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="indications" asChild>
            <Link href="/settings/indications">Indicações</Link>
          </TabsTrigger>
          <TabsTrigger value="medications" asChild>
            <Link href="/settings/medications">Medicamentos</Link>
          </TabsTrigger>
          <TabsTrigger value="swalis" asChild>
            <Link href="/settings/swalis">Classificação Swalis</Link>
          </TabsTrigger>
        </TabsList>

        <div className="space-y-6">{children}</div>
      </Tabs>
    </div>
  );
}

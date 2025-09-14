"use client";

import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";

interface PrescriptionsLayoutProps {
  children: React.ReactNode;
}

export default function PrescriptionsLayout({ children }: PrescriptionsLayoutProps) {
  const pathname = usePathname();
  const isNewPage = pathname.includes("/new");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isNewPage && (
            <Link href="/prescriptions">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isNewPage ? "Nova Prescrição" : "Prescrições"}
            </h1>
            <p className="text-muted-foreground">
              {isNewPage 
                ? "Prescrever injeções para um paciente"
                : "Gerencie as prescrições de injeções para pacientes"
              }
            </p>
          </div>
        </div>
        {!isNewPage && (
          <Link href="/prescriptions/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Prescrição
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-6">{children}</div>
    </div>
  );
}

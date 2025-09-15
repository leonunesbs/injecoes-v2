"use client";

import { ArrowLeft, Plus } from "lucide-react";

import { Button } from "~/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PrescriptionsLayoutProps {
  children: React.ReactNode;
}

export default function PrescriptionsLayout({
  children,
}: PrescriptionsLayoutProps) {
  const pathname = usePathname();
  const isNewPage = pathname.includes("/new");

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          {isNewPage && (
            <Link href="/prescriptions">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {isNewPage ? "Nova Prescrição" : "Prescrições"}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {isNewPage
                ? "Prescrever injeções para um paciente"
                : "Gerencie as prescrições de injeções para pacientes"}
            </p>
          </div>
        </div>
        {!isNewPage && (
          <Link href="/prescriptions/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Nova Prescrição</span>
              <span className="sm:hidden">Nova</span>
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-4 sm:space-y-6">{children}</div>
    </div>
  );
}

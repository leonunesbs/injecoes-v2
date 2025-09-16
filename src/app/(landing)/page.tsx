import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle,
  FileText,
  List,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Início",
  description:
    "Injecções — Gerenciamento AntiVEGF: acesse rapidamente prescrições, pacientes e relatórios.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Início",
    description:
      "Injecções — Gerenciamento AntiVEGF: acesse rapidamente prescrições, pacientes e relatórios.",
    url: "/",
    type: "website",
  },
  twitter: {
    title: "Início",
    description:
      "Injecções — Gerenciamento AntiVEGF: acesse rapidamente prescrições, pacientes e relatórios.",
    card: "summary_large_image",
  },
};

export default async function LandingPage() {
  const mainActions = [
    {
      title: "Nova Prescrição",
      description: "Criar uma nova prescrição de injeção para um paciente",
      href: "/prescriptions/new",
      icon: FileText,
      variant: "default" as const,
    },
    {
      title: "Lista de Prescrições",
      description: "Visualizar e gerenciar todas as prescrições existentes",
      href: "/prescriptions",
      icon: List,
      variant: "secondary" as const,
    },
    {
      title: "Gerar Relatório",
      description: "Acessar relatórios detalhados do sistema",
      href: "https://injecoes.seoft.app",
      icon: BarChart3,
      variant: "outline" as const,
      external: true,
    },
    {
      title: "Prescrições Realizadas",
      description: "Verificar status das prescrições aplicadas",
      href: "/dashboard",
      icon: CheckCircle,
      variant: "outline" as const,
    },
  ];

  return (
    <HydrateClient>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-background relative overflow-hidden">
          <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-12 lg:py-24">
            <div className="mx-auto max-w-5xl text-center">
              <h1 className="text-foreground mb-6 text-3xl font-bold tracking-tight sm:mb-8 sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="block">Sistema de</span>
                <span className="text-primary block">Injeções</span>
                <span className="block">Intravítreas</span>
              </h1>

              <p className="text-muted-foreground mx-auto mb-12 max-w-3xl text-base leading-relaxed sm:mb-16 sm:text-lg md:text-xl lg:text-2xl">
                Acesse rapidamente as principais funcionalidades do sistema
              </p>
            </div>
          </div>
        </section>

        {/* Main Actions Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
              {mainActions.map((action) => {
                const IconComponent = action.icon;
                const linkProps = action.external
                  ? {
                      href: action.href,
                      target: "_blank",
                      rel: "noopener noreferrer",
                    }
                  : { href: action.href };

                return (
                  <Card
                    key={action.title}
                    className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:hover:-translate-y-2 sm:hover:shadow-xl"
                  >
                    <CardHeader className="px-4 pt-4 pb-4 sm:px-6 sm:pt-6 sm:pb-6">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="bg-primary text-primary-foreground flex-shrink-0 rounded-xl p-2.5 shadow-lg sm:p-3">
                          <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-card-foreground mb-1.5 text-base font-semibold sm:mb-2 sm:text-lg">
                            {action.title}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                            {action.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                      <Button
                        variant={action.variant}
                        className="h-10 w-full text-sm transition-all duration-200 group-hover:shadow-md sm:h-11"
                        asChild
                      >
                        <Link {...linkProps}>
                          {action.external ? "Acessar" : "Abrir"}
                          <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick Access Section */}
        <section className="bg-muted/50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
              <Card className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader className="px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
                  <CardTitle className="flex items-center space-x-3 text-lg sm:space-x-4 sm:text-xl">
                    <div className="bg-primary text-primary-foreground rounded-lg p-2.5 shadow-lg sm:p-3">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <span>Gerenciar Pacientes</span>
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm leading-relaxed sm:mt-3 sm:text-base">
                    Visualize, edite e gerencie informações dos pacientes
                    cadastrados
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                  <Button
                    variant="outline"
                    className="group-hover:bg-accent h-10 w-full text-sm transition-colors sm:h-11"
                    asChild
                  >
                    <Link href="/patients">
                      Acessar Pacientes
                      <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader className="px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
                  <CardTitle className="flex items-center space-x-3 text-lg sm:space-x-4 sm:text-xl">
                    <div className="bg-primary text-primary-foreground rounded-lg p-2.5 shadow-lg sm:p-3">
                      <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <span>Configurações</span>
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm leading-relaxed sm:mt-3 sm:text-base">
                    Configure indicações, medicamentos e parâmetros do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                  <Button
                    variant="outline"
                    className="group-hover:bg-accent h-10 w-full text-sm transition-colors sm:h-11"
                    asChild
                  >
                    <Link href="/settings">
                      Abrir Configurações
                      <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </HydrateClient>
  );
}

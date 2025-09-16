import {
  BarChart3,
  Bell,
  FileText,
  LogIn,
  LogOut,
  Menu,
  Settings,
  Syringe,
  User,
  Users,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { auth, signIn, signOut } from "~/server/auth";

import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default async function LandingLayout({ children }: LandingLayoutProps) {
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const notificationsCount = isAuthenticated
    ? await (async () => {
        const now = new Date();
        const startOfToday = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0,
          0,
          0,
          0,
        );
        const endOfToday = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59,
          999,
        );

        const [overdueScheduled, dueToday, missed] = await Promise.all([
          db.injection.count({
            where: {
              status: "SCHEDULED",
              scheduledDate: { lt: startOfToday },
              patient: { isActive: true },
            },
          }),
          db.injection.count({
            where: {
              status: "SCHEDULED",
              scheduledDate: { gte: startOfToday, lte: endOfToday },
              patient: { isActive: true },
            },
          }),
          db.injection.count({
            where: { status: "MISSED", patient: { isActive: true } },
          }),
        ]);

        return overdueScheduled + dueToday + missed;
      })()
    : 0;
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-background/95 sticky top-0 z-50 w-full border-b shadow-sm backdrop-blur-md">
        <div className="container mx-auto px-3 sm:px-4 lg:px-12">
          <div className="flex h-14 items-center justify-between sm:h-16 lg:h-18">
            {/* Logo e Título */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg shadow-lg sm:h-10 sm:w-10 sm:rounded-xl lg:h-12 lg:w-12">
                <Syringe className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-foreground text-base font-bold sm:text-lg lg:text-xl">
                  <span className="hidden sm:inline">Injecções</span>
                  <span className="sm:hidden">Sistema</span>
                </h1>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  <span className="hidden sm:inline">
                    Gerenciamento AntiVEGF
                  </span>
                  <span className="sm:hidden">Injeções</span>
                </p>
              </div>
            </div>

            {/* Navegação Desktop */}
            <nav className="hidden items-center space-x-4 lg:space-x-6 xl:flex">
              <Link
                href="/prescriptions"
                className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg px-2 py-1.5 text-sm font-medium transition-colors lg:px-3 lg:py-2"
              >
                Prescrições
              </Link>
              <Link
                href="/patients"
                className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg px-2 py-1.5 text-sm font-medium transition-colors lg:px-3 lg:py-2"
              >
                Pacientes
              </Link>
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg px-2 py-1.5 text-sm font-medium transition-colors lg:px-3 lg:py-2"
              >
                Dashboard
              </Link>
              <Link
                href="/settings"
                className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg px-2 py-1.5 text-sm font-medium transition-colors lg:px-3 lg:py-2"
              >
                Configurações
              </Link>
            </nav>

            {/* Ações do Usuário */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
              {/* Notificações - Ocultar em telas muito pequenas */}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hidden h-8 w-8 sm:flex sm:h-9 sm:w-9 lg:h-10 lg:w-10"
                  asChild
                  aria-label={`Notificações: ${notificationsCount}`}
                >
                  <Link href="/dashboard">
                    <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                    {notificationsCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full p-0 text-xs sm:h-4 sm:w-4 lg:h-5 lg:w-5"
                      >
                        {notificationsCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
              )}

              {/* Menu do Usuário - Simplificado em mobile */}
              <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
                <div className="flex items-center space-x-1 sm:space-x-1.5 lg:space-x-2">
                  {isAuthenticated ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hidden h-8 w-8 sm:flex sm:h-9 sm:w-9 lg:h-10 lg:w-10"
                        asChild
                      >
                        <Link href="/settings">
                          <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                        </Link>
                      </Button>
                      <form
                        action={async () => {
                          "use server";
                          await signOut();
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
                          type="submit"
                          aria-label="Sair"
                        >
                          <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                        </Button>
                      </form>
                    </>
                  ) : (
                    <>
                      <form
                        action={async () => {
                          "use server";
                          await signIn();
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
                          type="submit"
                          aria-label="Entrar"
                        >
                          <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                        </Button>
                      </form>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hidden h-8 w-8 sm:flex sm:h-9 sm:w-9 lg:h-10 lg:w-10"
                        asChild
                      >
                        <Link href="/settings">
                          <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Menu Mobile */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 xl:hidden"
                  >
                    <Menu className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center space-x-3">
                      <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-xl shadow-lg">
                        <Syringe className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">Injecções</h2>
                        <p className="text-muted-foreground text-sm">
                          Navegação
                        </p>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <nav className="space-y-2">
                      <Link
                        href="/prescriptions"
                        className="text-muted-foreground hover:text-foreground hover:bg-accent flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors"
                      >
                        <FileText className="mr-3 h-5 w-5" />
                        Prescrições
                      </Link>
                      <Link
                        href="/patients"
                        className="text-muted-foreground hover:text-foreground hover:bg-accent flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors"
                      >
                        <Users className="mr-3 h-5 w-5" />
                        Pacientes
                      </Link>
                      <Link
                        href="/dashboard"
                        className="text-muted-foreground hover:text-foreground hover:bg-accent flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors"
                      >
                        <BarChart3 className="mr-3 h-5 w-5" />
                        Dashboard
                      </Link>
                      <Link
                        href="/settings"
                        className="text-muted-foreground hover:text-foreground hover:bg-accent flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors"
                      >
                        <Settings className="mr-3 h-5 w-5" />
                        Configurações
                      </Link>
                    </nav>

                    <div className="border-t pt-4">
                      <div className="space-y-2">
                        {isAuthenticated ? (
                          <form
                            action={async () => {
                              "use server";
                              await signOut();
                            }}
                          >
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              type="submit"
                            >
                              <LogOut className="mr-3 h-4 w-4" />
                              Sair
                            </Button>
                          </form>
                        ) : (
                          <form
                            action={async () => {
                              "use server";
                              await signIn();
                            }}
                          >
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              type="submit"
                            >
                              <User className="mr-3 h-4 w-4" />
                              Entrar
                            </Button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-muted/50 border-t shadow-sm backdrop-blur-sm">
        <div className="container mx-auto px-3 py-6 sm:px-4 sm:py-8 lg:px-12 lg:py-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {/* Informações do Sistema */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Syringe className="text-primary h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                <span className="text-foreground text-sm font-bold sm:text-base lg:text-lg">
                  Injecções
                </span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                Plataforma especializada para gerenciamento de prescrições de
                injeções intravítreas com foco em eficiência e precisão.
              </p>
            </div>

            {/* Links Rápidos */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-foreground text-base font-semibold sm:text-lg">
                Acesso Rápido
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <Link
                  href="/prescriptions/new"
                  className="text-muted-foreground hover:text-foreground block py-1 text-xs transition-colors sm:text-sm"
                >
                  Nova Prescrição
                </Link>
                <Link
                  href="/prescriptions"
                  className="text-muted-foreground hover:text-foreground block py-1 text-xs transition-colors sm:text-sm"
                >
                  Lista de Prescrições
                </Link>
                <Link
                  href="/patients"
                  className="text-muted-foreground hover:text-foreground block py-1 text-xs transition-colors sm:text-sm"
                >
                  Pacientes
                </Link>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground block py-1 text-xs transition-colors sm:text-sm"
                >
                  Dashboard
                </Link>
              </div>
            </div>

            {/* Relatórios */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-foreground text-base font-semibold sm:text-lg">
                Relatórios
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <a
                  href="https://https://injecoes.seoft.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground block py-1 text-xs transition-colors sm:text-sm"
                >
                  Relatório Principal
                </a>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground block py-1 text-xs transition-colors sm:text-sm"
                >
                  Análises Clínicas
                </Link>
                <Link
                  href="/settings"
                  className="text-muted-foreground hover:text-foreground block py-1 text-xs transition-colors sm:text-sm"
                >
                  Configurações
                </Link>
              </div>
            </div>

            {/* Suporte */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-foreground text-base font-semibold sm:text-lg">
                Suporte
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Versão 2.0.0
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Última atualização: {new Date().toLocaleDateString("pt-BR")}
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Sistema interno - Uso restrito
                </p>
                <div className="pt-2">
                  <Link
                    href="/termos"
                    className="text-muted-foreground hover:text-foreground block py-1 text-xs transition-colors sm:text-sm"
                  >
                    Termos de Uso
                  </Link>
                  <Link
                    href="/privacidade"
                    className="text-muted-foreground hover:text-foreground block py-1 text-xs transition-colors sm:text-sm"
                  >
                    Política de Privacidade
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 border-t pt-4 sm:mt-8">
            <p className="text-muted-foreground text-center text-xs sm:text-sm">
              © {new Date().getFullYear()} Injecções. Todos os direitos
              reservados.
            </p>
          </div>

          {/* Créditos do Desenvolvedor */}
          <div className="mt-4">
            <div className="flex">
              <span className="bg-primary text-primary-foreground w-full rounded-lg py-2 text-center text-xs">
                Coded with ❤️ by{" "}
                <Link
                  href="https://instagram.com/leonunesbs"
                  className="font-bold hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @leonunesbs
                </Link>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

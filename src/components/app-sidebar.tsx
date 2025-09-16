"use client";

import { FileText, Home, Settings, Stethoscope } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";

import Link from "next/link";
import { NavMain } from "~/components/nav-main";
import { NavUser } from "~/components/nav-user";
import { usePathname } from "next/navigation";

// This is sample data.
const data = {
  user: {
    name: "Dr. João Silva",
    email: "joao.silva@clinica.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Prescrições",
      url: "/prescriptions",
      icon: FileText,
      items: [
        {
          title: "Todas as Prescrições",
          url: "/prescriptions",
        },
        {
          title: "Nova Prescrição",
          url: "/prescriptions/new",
        },
      ],
    },
    {
      title: "Configurações",
      url: "/settings",
      icon: Settings,
      items: [
        {
          title: "Indicações",
          url: "/settings/indications",
        },
        {
          title: "Medicamentos",
          url: "/settings/medications",
        },
        {
          title: "Classificação Swalis",
          url: "/settings/swalis",
        },
        {
          title: "Usuários",
          url: "/settings/users",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Stethoscope className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Sistema de Injeções
                  </span>
                  <span className="truncate text-xs">Gestão Médica</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} pathname={pathname} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

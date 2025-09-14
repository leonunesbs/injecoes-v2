"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

const navigation = [
  {
    name: "Prescrições",
    href: "/prescriptions",
    description: "Prescrever injeções para pacientes",
  },
  {
    name: "Configurações",
    href: "/settings",
    description: "Configurar indicações, medicamentos e Swalis",
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-8">
      {navigation.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex max-w-xs flex-col gap-2 rounded-xl p-4 transition-colors",
              isActive
                ? "bg-white/20 text-white"
                : "bg-white/10 text-white hover:bg-white/20",
            )}
          >
            <h3 className="text-xl font-bold">{item.name} →</h3>
            <div className="text-sm opacity-80">{item.description}</div>
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

interface BackButtonProps {
  label?: string;
  size?: "sm" | "default" | "lg" | "icon";
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link";
}

export function BackButton({
  label = "Voltar",
  size = "sm",
  variant = "outline",
}: BackButtonProps) {
  const router = useRouter();
  return (
    <Button variant={variant} size={size} onClick={() => router.back()}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}

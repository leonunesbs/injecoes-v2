import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
}

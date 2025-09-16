import { auth, signOut } from "~/server/auth";

import { LogOut } from "lucide-react";
import Form from "next/form";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";

export default async function Unauthorized() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }
  if (session?.user.isStaff) {
    redirect("/");
  }
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-4xl font-bold">401</h1>
      <p className="text-center text-lg">
        Você não tem permissão para acessar esta página.
      </p>
      <Form
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
      </Form>
    </div>
  );
}

import { redirect } from "next/navigation";
import { LoginForm } from "~/components/login-form";
import { auth } from "~/server/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const session = await auth();
  const params = await searchParams;
  const redirectUrl = params?.redirectUrl;
  if (session?.user) {
    redirect(redirectUrl ?? "/dashboard");
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm redirectUrl={redirectUrl} />
      </div>
    </div>
  );
}

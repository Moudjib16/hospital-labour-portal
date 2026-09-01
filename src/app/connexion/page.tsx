import { AuthError } from "next-auth";
import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";

type AuthState = React.ReactNode | null;

async function authenticate(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  "use server";

  try {
    const callbackUrl =
      (formData.get("callbackUrl") as string) || "/tableau-de-bord";
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirectTo: callbackUrl,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return <p className="text-sm text-red-600">Identifiants invalides.</p>;
    }
    throw error;
  }

  redirect("/tableau-de-bord");
}

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const targetUrl = callbackUrl || "/tableau-de-bord";

  const session = await auth();
  if (session?.user) {
    redirect("/tableau-de-bord");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <LoginForm action={authenticate} callbackUrl={targetUrl} />
    </div>
  );
}

/**
 * Portail Hospitalier — Rapports Médicaux
 * Développé par Zerrougue Abdelmoudjib
 */
import { AuthError } from "next-auth";
import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";

type AuthState = React.ReactNode | null;

// Only allow same-origin relative paths as post-login destinations, to avoid
// open-redirects through the callbackUrl query parameter or hidden form field.
function safeCallbackUrl(value: string | undefined): string {
  if (
    value &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.startsWith("/\\")
  ) {
    return value;
  }
  return "/tableau-de-bord";
}

async function authenticate(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  "use server";

  const callbackUrl = safeCallbackUrl(
    (formData.get("callbackUrl") as string) || undefined
  );

  try {
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

  redirect(callbackUrl);
}

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const targetUrl = safeCallbackUrl(callbackUrl);

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

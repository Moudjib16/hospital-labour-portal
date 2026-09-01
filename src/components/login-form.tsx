"use client";

import { useActionState } from "react";
import { Activity } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type LoginFormProps = {
  action: (
    prevState: React.ReactNode | null,
    formData: FormData
  ) => Promise<React.ReactNode | null>;
  callbackUrl: string;
};

export function LoginForm({ action, callbackUrl }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Activity className="mx-auto h-10 w-10 text-cyan-600" aria-hidden="true" />
        <CardTitle className="text-xl">Connexion</CardTitle>
        <CardDescription>
          Portail Hospitalier — Rapports Médicaux
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <div className="space-y-2">
            <Label htmlFor="username">Nom d&apos;utilisateur</Label>
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              placeholder="Entrez votre identifiant"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Entrez votre mot de passe"
            />
          </div>

          <div aria-live="polite">{state}</div>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

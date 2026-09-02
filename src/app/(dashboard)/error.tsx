"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <Card className="max-w-lg">
        <CardHeader>
          <AlertTriangle className="mb-2 size-8 text-destructive" aria-hidden="true" />
          <CardTitle>Une erreur est survenue</CardTitle>
          <CardDescription>
            Une erreur inattendue a empêché le chargement de cette page. Veuillez
            réessayer ou revenir au tableau de bord.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            {error.message || "Aucun détail disponible."}
          </p>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant="outline" onClick={reset}>
            Réessayer
          </Button>
          <Button render={<Link href="/tableau-de-bord" />}>
            Tableau de bord
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

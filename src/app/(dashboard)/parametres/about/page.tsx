/**
 * Portail Hospitalier — Rapports Médicaux
 * Développé par Zerrougue Abdelmoudjib
 */
import type { Metadata } from "next";
import { Activity } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "À propos",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <PageHeader
        title="À propos"
        description="Informations sur l'application et son développement."
      />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" aria-hidden="true" />
            <div>
              <CardTitle>Portail Hospitalier</CardTitle>
              <CardDescription>Rapports Médicaux</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Application interne permettant la numérisation et le suivi des
            rapports médicaux post-opératoires (accouchements naturels et
            césariennes).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Développement</CardTitle>
          <CardDescription>Credits et informations techniques.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Développé par
            </span>
            <span className="text-sm font-semibold text-foreground">
              Zerrougue Abdelmoudjib
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Technologies</span>
            <span className="text-sm text-foreground">
              Next.js, React, TypeScript, Tailwind CSS, Prisma, PostgreSQL
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

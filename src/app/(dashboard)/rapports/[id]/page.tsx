import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { db } from "@/lib/db";
import {
  bloodTypeLabels,
  operationTypeLabels,
} from "@/lib/report-labels";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Détail du rapport",
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
});

type ReportDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReportDetailPage({
  params,
}: ReportDetailPageProps) {
  const { id } = await params;

  const report = await db.labourReport.findUnique({ where: { id } });
  if (!report) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <header className="flex flex-col gap-2">
        <Link
          href="/rapports"
          className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Retour aux rapports
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">
          Rapport d&apos;accouchement
        </h1>
        <p className="text-sm text-muted-foreground">
          {report.firstName} {report.lastName} —{" "}
          {operationTypeLabels[report.operationType]}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Description de l&apos;intervention</CardTitle>
          </CardHeader>
          <CardContent className="whitespace-pre-wrap text-sm leading-relaxed">
            {report.fullDescription}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient</CardTitle>
              <CardDescription>Informations enregistrées.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow label="Nom" value={`${report.firstName} ${report.lastName}`} />
              <InfoRow label="Âge" value={String(report.age)} />
              <InfoRow label="Nationalité" value={report.nationality} />
              <InfoRow
                label="Groupe sanguin"
                value={bloodTypeLabels[report.bloodType]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Intervention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow
                label="Type"
                value={operationTypeLabels[report.operationType]}
              />
              <InfoRow label="Date" value={dateFormatter.format(report.deliveryDate)} />
              <InfoRow label="Opérateur" value={report.operatorFullName} />
              <InfoRow
                label="Anesthésiste"
                value={report.anesthesiologistFullName}
              />
              <InfoRow
                label="Complications"
                value={report.complications ?? "Aucune"}
              />
              <InfoRow
                label="Notes post-op"
                value={report.postOpNotes ?? "—"}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
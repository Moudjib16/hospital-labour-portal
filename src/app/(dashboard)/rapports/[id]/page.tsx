import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Baby, Stethoscope } from "lucide-react";

import { db } from "@/lib/db";
import {
  bloodTypeLabels,
  operationTypeLabels,
} from "@/lib/report-labels";
import { AutoPrint } from "@/components/auto-print";
import { PrintButton } from "@/components/print-button";
import { PageHeader } from "@/components/page-header";
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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ReportDetailPage({
  params,
  searchParams,
}: ReportDetailPageProps) {
  const { id } = await params;
  const sp = await searchParams;

  const report = await db.labourReport.findUnique({ where: { id } });
  if (!report) {
    notFound();
  }

  const patientName = `${report.firstName} ${report.lastName}`;

  return (
    <div className="report-print flex flex-col gap-6 p-6 lg:p-8">
      <AutoPrint enabled={sp.print === "1"} />

      <div className="flex flex-col gap-2 print:hidden">
        <Link
          href="/rapports"
          className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Retour aux rapports
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <PageHeader
            title="Rapport d'accouchement"
            description={`${patientName} — ${operationTypeLabels[report.operationType]}`}
          />
          <PrintButton />
        </div>
      </div>

      <div className="hidden print:flex print:mb-6 print:flex-col print:gap-1">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="font-medium">{patientName}</span>
          <span className="text-muted-foreground">
            {dateFormatter.format(report.deliveryDate)}
          </span>
        </div>
        <h1 className="border-b-2 border-slate-900 pb-1 text-sm font-bold uppercase tracking-tight">
          Rapport d&apos;accouchement
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 print:grid-cols-2 print:gap-2">
        <Card className="print:break-inside-avoid">
          <CardHeader className="flex flex-row items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary print:hidden">
              <Baby className="size-4" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>Patient</CardTitle>
              <CardDescription className="print:hidden">
                Informations enregistrées.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm print-compact-info print:grid-cols-2 print:gap-x-4 print:gap-y-1">
              <InfoRow label="Nom" value={`${report.firstName} ${report.lastName}`} />
              <InfoRow label="Âge" value={`${report.age} ans`} />
              <InfoRow label="Nationalité" value={report.nationality} />
              <InfoRow
                label="Groupe sanguin"
                value={bloodTypeLabels[report.bloodType]}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="print:break-inside-avoid">
          <CardHeader className="flex flex-row items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary print:hidden">
              <Stethoscope className="size-4" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>Intervention</CardTitle>
              <CardDescription className="print:hidden">
                Détails de l&apos;opération.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm print-compact-info print:space-y-1">
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
          </CardContent>
        </Card>
      </div>

      <Card className="print:break-inside-avoid">
        <CardHeader>
          <CardTitle>Description de l&apos;intervention</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed print-compact-desc print:space-y-2">
          <div className="whitespace-pre-wrap">{report.fullDescription}</div>

          <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2 print-compact-info print:grid-cols-2 print:gap-x-4 print:gap-y-1 print:border-t print:pt-2">
            <InfoRow
              label="Complications"
              value={report.complications ?? "Aucune"}
            />
            <InfoRow
              label="Notes post-op"
              value={report.postOpNotes ?? "—"}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-dashed border-border/60 pb-1.5">
      <dt className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}

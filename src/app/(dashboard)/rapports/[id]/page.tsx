import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { db } from "@/lib/db";
import {
  bloodTypeLabels,
  operationTypeLabels,
} from "@/lib/report-labels";
import { ageFrom } from "@/lib/date-utils";
import { AutoPrint } from "@/components/auto-print";
import { PrintButton } from "@/components/print-button";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Détail du rapport",
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
});

const shortDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
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
    <div className="flex flex-col gap-6 p-6 lg:p-8">
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
            title="Protocole opératoire"
            description={`${patientName} — ${operationTypeLabels[report.operationType]}`}
          />
          <PrintButton />
        </div>
      </div>

      <div className="report-doc mx-auto w-full max-w-4xl bg-background text-sm text-foreground print:max-w-none print:text-[0.72rem]">
        {/* 1. Hospital header / En-tête */}
        <header className="border-b-2 border-slate-900 pb-2 text-center">
          <div className="text-sm font-bold uppercase leading-snug sm:text-base">
            Établissement Hospitalier Spécialisé
          </div>
          <div className="text-sm font-bold uppercase leading-snug sm:text-base">
            Mère Enfant de Sidi Mabrouk
          </div>
          <div className="mt-0.5 text-xs sm:text-sm">
            Service de Gynécologie Obstétrique
          </div>
          <div className="mt-0.5 text-xs sm:text-sm">Pr. A. SELLAHI</div>
          <div className="text-xs sm:text-sm">Chef de Service</div>
        </header>

        {/* 2. Patient & staff metadata grid */}
        <section className="mt-5 grid gap-5 sm:grid-cols-2 print:mt-3 print:gap-4">
          <div className="rounded-lg border border-border p-4 sm:p-5 print:border print:border-border print:p-3">
            <FieldLabel>Patient</FieldLabel>
            <dl className="mt-3 space-y-2.5 print:mt-2 print:space-y-1.5">
              <Field label="Nom" value={report.lastName} />
              <Field label="Prénom" value={report.firstName} />
              <Field label="Âge" value={`${ageFrom(report.dateOfBirth, report.deliveryDate)} ans`} />
              <Field label="Nationalité" value={report.nationality} />
              <Field
                label="Groupe sanguin"
                value={bloodTypeLabels[report.bloodType]}
              />
            </dl>
          </div>

          <div className="rounded-lg border border-border p-4 sm:p-5 print:border print:border-border print:p-3">
            <FieldLabel>Équipe & intervention</FieldLabel>
            <dl className="mt-3 space-y-2.5 print:mt-2 print:space-y-1.5">
              <Field label="Opérateur" value={report.operatorFullName} />
              <Field
                label="Anesthésiste"
                value={report.anesthesiologistFullName}
              />
              {report.assistantFullName ? (
                <Field label="Assistant" value={report.assistantFullName} />
              ) : null}
              <Field
                label="Intervention"
                value={operationTypeLabels[report.operationType]}
              />
              <Field
                label="Opérée le"
                value={shortDateFormatter.format(report.deliveryDate)}
              />
            </dl>
          </div>
        </section>

        {/* 3. Detailed operative protocol */}
        <section className="mt-4 print:mt-3">
          <div className="border-b border-slate-900 pb-1 text-xs font-bold uppercase tracking-wide sm:text-sm">
            Compte-Rendu Opératoire
          </div>
          <div className="mt-2 whitespace-pre-wrap leading-relaxed">
            {report.fullDescription}
          </div>

          {(report.complications || report.postOpNotes) && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 print:mt-2 print:gap-3">
              {report.complications ? (
                <div className="space-y-1">
                  <FieldLabel>Complications</FieldLabel>
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {report.complications}
                  </p>
                </div>
              ) : null}
              {report.postOpNotes ? (
                <div className="space-y-1">
                  <FieldLabel>Notes post-opératoires</FieldLabel>
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {report.postOpNotes}
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </section>

        {/* 4. Footer / sign-off */}
        <footer className="mt-6 flex items-end justify-between print:mt-4">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Secrétariat médical
            </p>
            <div className="mt-1 h-14 w-44 rounded border border-dashed border-slate-400 print:h-12 print:w-36">
              <div className="flex h-full items-center justify-center px-2 text-center text-[0.68rem] text-muted-foreground">
                Signature / Cachet
              </div>
            </div>
          </div>
          <p className="text-[0.68rem] text-muted-foreground">
            Du : {dateFormatter.format(report.createdAt)}
          </p>
        </footer>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-900">
      {children}
      <span className="h-0.5 flex-1 rounded-full bg-primary/40" />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-dashed border-slate-300 pb-2 print:pb-1">
      <dt className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="text-right text-sm font-bold text-slate-900">
        {value || "—"}
      </dd>
    </div>
  );
}

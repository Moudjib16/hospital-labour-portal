import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";

import { db } from "@/lib/db";
import { ageFrom, formatBirthDate } from "@/lib/date-utils";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Détail du patient",
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

type PatientDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PatientDetailPage({
  params,
}: PatientDetailPageProps) {
  const { id } = await params;

  const patient = await db.patient.findUnique({
    where: { id },
    include: {
      reports: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!patient) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <header className="flex flex-col gap-2">
        <Link
          href="/patients"
          className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Retour aux patients
        </Link>
        <PageHeader
          title={`${patient.firstName} ${patient.lastName}`}
          description="Dossier médical du patient de la maternité."
          className="!gap-y-1"
        />
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Historique des rapports</CardTitle>
            <CardDescription>
              {patient.reports.length} rapport
              {patient.reports.length > 1 ? "s" : ""} d&apos;accouchement
              enregistré{patient.reports.length > 1 ? "s" : ""}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {patient.reports.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucun rapport enregistré pour ce patient.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Opération</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Opérateur</TableHead>
                    <TableHead>Anesthésiste</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patient.reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/rapports/${report.id}`}
                          className="flex items-center gap-2 transition-colors hover:text-foreground/70"
                        >
                          <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          {operationTypeLabels[report.operationType]}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {dateFormatter.format(report.deliveryDate)}
                      </TableCell>
                      <TableCell>{report.operatorFullName}</TableCell>
                      <TableCell>{report.anesthesiologistFullName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
              <CardDescription>Données enregistrées.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow label="Nom" value={`${patient.firstName} ${patient.lastName}`} />
              <InfoRow label="Âge" value={`${ageFrom(patient.dateOfBirth)} ans`} />
              <InfoRow
                label="Date de naissance"
                value={formatBirthDate(patient.dateOfBirth)}
              />
              <InfoRow label="Nationalité" value={patient.nationality} />
              <InfoRow
                label="Groupe sanguin"
                value={bloodTypeLabels[patient.bloodType]}
              />
              <InfoRow label="Lieu de naissance" value={patient.birthPlace ?? "—"} />
              <InfoRow label="Rapports" value={String(patient.reports.length)} />
            </CardContent>
          </Card>

          {patient.medicalHistory ? (
            <Card>
              <CardHeader>
                <CardTitle>Antécédents médicaux</CardTitle>
              </CardHeader>
              <CardContent className="whitespace-pre-wrap text-sm leading-relaxed">
                {patient.medicalHistory}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
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

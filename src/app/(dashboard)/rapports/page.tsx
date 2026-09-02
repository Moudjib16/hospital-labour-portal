import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { db } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
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
import { operationTypeLabels } from "@/lib/report-labels";
import { OperationType } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import { ReportFilters, type ReportFiltersValue } from "@/components/report-filters";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rapports",
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

export default async function RapportsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const operation = typeof sp.operation === "string" ? sp.operation : "";
  const from = typeof sp.from === "string" ? sp.from : "";
  const to = typeof sp.to === "string" ? sp.to : "";

  const where: Prisma.LabourReportWhereInput = {};

  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { operatorFullName: { contains: q, mode: "insensitive" } },
      { anesthesiologistFullName: { contains: q, mode: "insensitive" } },
    ];
  }

  if (operation && (Object.values(OperationType) as string[]).includes(operation)) {
    where.operationType = operation as OperationType;
  }

  if (from || to) {
    where.deliveryDate = {};
    if (from) {
      where.deliveryDate.gte = new Date(`${from}T00:00:00`);
    }
    if (to) {
      where.deliveryDate.lte = new Date(`${to}T23:59:59`);
    }
  }

  const reports = await db.labourReport.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const filters: ReportFiltersValue = {
    q: q || undefined,
    operation: operation || undefined,
    from: from || undefined,
    to: to || undefined,
  };

  const filtered =
    !!(q || operation || from || to) || reports.length === 100;

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <PageHeader
        title="Rapports"
        description="Rapports médicaux post-opératoires et post-accouchement."
        action={
          <Link
            href="/rapports/nouveau"
            className={buttonVariants({ variant: "default" })}
          >
            <Plus aria-hidden="true" />
            Nouveau rapport
          </Link>
        }
      />

      <ReportFilters filters={filters} />

      {reports.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Liste des rapports</CardTitle>
            <CardDescription>
              Aucun rapport ne correspond aux critères sélectionnés.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Modifiez vos filtres ou créez un nouveau rapport.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Liste des rapports</CardTitle>
            <CardDescription>
              {reports.length} rapport{reports.length > 1 ? "s" : ""} trouvé
              {reports.length > 1 ? "s" : ""}
              {filtered && reports.length === 100 ? " (limité aux 100 plus récents)" : ""}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Opération</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Opérateur</TableHead>
                  <TableHead>Anesthésiste</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/rapports/${report.id}`}
                        className="transition-colors hover:text-foreground/70"
                      >
                        {report.firstName} {report.lastName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {operationTypeLabels[report.operationType]}
                    </TableCell>
                    <TableCell>{formatDate(report.deliveryDate)}</TableCell>
                    <TableCell>{report.operatorFullName}</TableCell>
                    <TableCell>{report.anesthesiologistFullName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
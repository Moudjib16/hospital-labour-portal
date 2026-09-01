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
import {
  operationTypeLabels,
} from "@/lib/report-labels";

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

export default async function RapportsPage() {
  const reports = await db.labourReport.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rapports</h1>
          <p className="text-sm text-muted-foreground">
            Rapports médicaux post-opératoires et post-accouchement.
          </p>
        </div>
        <Link
          href="/rapports/nouveau"
          className={buttonVariants({ variant: "default" })}
        >
          <Plus aria-hidden="true" />
          Nouveau rapport
        </Link>
      </header>

      {reports.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Liste des rapports</CardTitle>
            <CardDescription>
              Créez votre premier rapport d&apos;accouchement.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Aucun rapport créé pour le moment.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Liste des rapports</CardTitle>
            <CardDescription>
              {reports.length} rapport{reports.length > 1 ? "s" : ""} trouvé
              {reports.length > 1 ? "s" : ""}.
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
import Link from "next/link";
import { FileText, User } from "lucide-react";

import { operationTypeLabels } from "@/lib/report-labels";
import type {
  ReportSearchResult,
  PatientSearchResult,
} from "@/lib/search";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function ReportResultList({
  results,
}: {
  results: ReportSearchResult[];
}) {
  if (results.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucun rapport.</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {results.map((report) => (
        <li key={report.id} className="py-4">
          <Link
            href={`/rapports/${report.id}`}
            className="group block space-y-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-2 font-medium text-foreground transition-colors group-hover:text-primary">
                <FileText className="size-4 shrink-0 text-muted-foreground" />
                {report.lastName} {report.firstName}
                <span className="text-xs font-normal text-muted-foreground">
                  {report.age} ans
                </span>
              </span>
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {operationTypeLabels[report.operationType]}
              </span>
            </div>
            {report.snippet ? (
              <p
                className="text-sm leading-relaxed text-muted-foreground [&_mark]:rounded-sm [&_mark]:bg-amber-200 [&_mark]:px-0.5 [&_mark]:font-semibold [&_mark]:text-foreground"
                dangerouslySetInnerHTML={{ __html: report.snippet }}
              />
            ) : null}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>{dateFormatter.format(report.deliveryDate)}</span>
              <span>Opérateur : {report.operatorFullName}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function PatientResultList({
  results,
}: {
  results: PatientSearchResult[];
}) {
  if (results.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucun patient.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Âge</TableHead>
          <TableHead>Nationalité</TableHead>
          <TableHead>Rapports</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell>
              <Link
                href={`/patients/${patient.id}`}
                className="flex items-center gap-2 font-medium transition-colors hover:text-primary"
              >
                <User className="size-4 shrink-0 text-muted-foreground" />
                {patient.lastName} {patient.firstName}
              </Link>
            </TableCell>
            <TableCell>{patient.age} ans</TableCell>
            <TableCell>{patient.nationality}</TableCell>
            <TableCell>{patient.reportCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
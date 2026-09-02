import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { bloodTypeLabels } from "@/lib/report-labels";

export type PatientRow = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  nationality: string;
  bloodType: keyof typeof bloodTypeLabels;
  birthPlace: string | null;
  _count: { reports: number };
};

type PatientTableProps = {
  patients: PatientRow[];
};

export function PatientTable({ patients }: PatientTableProps) {
  if (patients.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucun patient correspondant.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Âge</TableHead>
          <TableHead>Nationalité</TableHead>
          <TableHead>Groupe sanguin</TableHead>
          <TableHead>Lieu de naissance</TableHead>
          <TableHead>Rapports</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell className="font-medium">
              <Link
                href={`/patients/${patient.id}`}
                className="transition-colors hover:text-foreground/70"
              >
                {patient.firstName} {patient.lastName}
              </Link>
            </TableCell>
            <TableCell>{patient.age}</TableCell>
            <TableCell>{patient.nationality}</TableCell>
            <TableCell>{bloodTypeLabels[patient.bloodType]}</TableCell>
            <TableCell>{patient.birthPlace ?? "—"}</TableCell>
            <TableCell>{patient._count.reports}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
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
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    if (!q) {
      return patients;
    }
    return patients.filter((patient) =>
      [
        patient.firstName,
        patient.lastName,
        patient.nationality,
        patient.birthPlace ?? "",
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes(q)
    );
  }, [query, patients]);

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-sm">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Rechercher un patient..."
          className="pl-8"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucun patient correspondant.
        </p>
      ) : (
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
            {filtered.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">
                  {patient.firstName} {patient.lastName}
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
      )}
    </div>
  );
}
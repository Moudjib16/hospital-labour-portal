import type { Metadata } from "next";

import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PatientTable } from "@/components/patient-table";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Patients",
};

export default async function PatientsPage() {
  const patients = await db.patient.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    include: { _count: { select: { reports: true } } },
  });

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <PageHeader
        title="Patients"
        description="Gestion des dossiers patients de la maternité."
      />

      <Card>
        <CardHeader>
          <CardTitle>Liste des patients</CardTitle>
          <CardDescription>
            {patients.length} patient{patients.length > 1 ? "s" : ""}{" "}
            enregistré{patients.length > 1 ? "s" : ""}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {patients.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucun patient enregistré pour le moment.
            </p>
          ) : (
            <PatientTable patients={patients} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
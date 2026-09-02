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
import { PatientSearch } from "@/components/patient-search";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/pagination";
import { Prisma } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Patients",
};

const PAGE_SIZE = 20;

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const rawPage = typeof sp.page === "string" ? Number.parseInt(sp.page, 10) : 1;
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const where: Prisma.PatientWhereInput = {};
  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { nationality: { contains: q, mode: "insensitive" } },
      { birthPlace: { contains: q, mode: "insensitive" } },
    ];
  }

  const totalPatients = await db.patient.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalPatients / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const patients = await db.patient.findMany({
    where,
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    include: { _count: { select: { reports: true } } },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const filtered = !!q;

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
            {totalPatients} patient{totalPatients > 1 ? "s" : ""} enregistré
            {totalPatients > 1 ? "s" : ""}
            {filtered ? " selon les critères sélectionnés." : "."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PatientSearch q={q || undefined} />
          {totalPatients === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucun patient enregistré pour le moment.
            </p>
          ) : (
            <>
              <PatientTable patients={patients} />
              <Pagination
                path="/patients"
                page={currentPage}
                totalPages={totalPages}
                params={{ q }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

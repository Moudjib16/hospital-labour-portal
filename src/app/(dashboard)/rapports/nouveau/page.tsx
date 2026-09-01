import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ReportForm } from "@/components/report-form";

export const metadata: Metadata = {
  title: "Nouveau rapport",
};

export default async function NouveauRapportPage() {
  const session = await auth();

  const patientsPromise = db.patient.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    select: { id: true, firstName: true, lastName: true, nationalId: true },
  });
  const doctorPromise = session?.user?.id
    ? db.user.findUnique({
        where: { id: session.user.id },
        select: { name: true },
      })
    : Promise.resolve(null);

  const [patients, doctor] = await Promise.all([
    patientsPromise,
    doctorPromise,
  ]);

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <header className="flex flex-col gap-2">
        <Link
          href="/rapports"
          className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Retour aux rapports
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">
          Nouveau rapport d&apos;accouchement
        </h1>
        <p className="text-sm text-muted-foreground">
          Créez et enregistrez un rapport médical post-opératoire.
        </p>
      </header>

      <ReportForm patients={patients} operatorName={doctor?.name ?? ""} />
    </div>
  );
}
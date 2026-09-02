import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ReportForm } from "@/components/report-form";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Nouveau rapport",
};

export default async function NouveauRapportPage() {
  const session = await auth();

  const doctor = session?.user?.id
    ? await db.user.findUnique({
        where: { id: session.user.id },
        select: { name: true },
      })
    : null;

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <header className="flex flex-col gap-2">
        <Link
          href="/rapports"
          className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Retour aux rapports
        </Link>
        <PageHeader
          title="Nouveau rapport d'accouchement"
          description="Créez et enregistrez un rapport médical post-opératoire."
          className="!gap-y-1"
        />
      </header>

      <ReportForm operatorName={doctor?.name ?? ""} />
    </div>
  );
}
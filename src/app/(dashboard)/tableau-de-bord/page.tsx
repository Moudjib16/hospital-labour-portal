import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { db } from "@/lib/db";
import { operationTypeLabels } from "@/lib/report-labels";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function DashboardPage() {
  const [
    totalBirths,
    naturalDeliveries,
    emergencyCSections,
    scheduledCSections,
    totalPatients,
    recentReports,
  ] = await Promise.all([
    db.labourReport.count(),
    db.labourReport.count({ where: { operationType: "NATURAL_DELIVERY" } }),
    db.labourReport.count({
      where: { operationType: "EMERGENCY_C_SECTION" },
    }),
    db.labourReport.count({
      where: { operationType: "SCHEDULED_C_SECTION" },
    }),
    db.patient.count(),
    db.labourReport.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const cSections = emergencyCSections + scheduledCSections;

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de l'activité du service de maternité."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Naissances totales" value={String(totalBirths)} />
        <StatCard
          label="Accouchements naturels"
          value={String(naturalDeliveries)}
        />
        <StatCard label="Césariennes" value={String(cSections)} />
        <StatCard label="Patients enregistrés" value={String(totalPatients)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>
            Les derniers rapports créés.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {recentReports.length === 0 ? (
            <p>Aucun rapport pour le moment.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentReports.map((report) => (
                <li
                  key={report.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3"
                >
                  <span className="font-medium text-foreground">
                    {report.firstName} {report.lastName}
                  </span>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {operationTypeLabels[report.operationType]}
                  </span>
                  <span>{dateFormatter.format(report.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <CardTitle className="text-3xl font-bold text-foreground">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        Statistiques en temps réel
      </CardContent>
    </Card>
  );
}
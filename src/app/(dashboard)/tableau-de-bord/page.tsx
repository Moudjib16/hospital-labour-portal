import type { ReactNode } from "react";
import {
  Activity,
  Baby,
  CalendarDays,
  CalendarClock,
  Stethoscope,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

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
import { cn } from "@/lib/utils";
import { OperationType } from "@/generated/prisma/enums";
import type { LabourReport } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

const monthFormatter = new Intl.DateTimeFormat("fr-FR", { month: "short" });

type ReportMeta = Pick<
  LabourReport,
  "id" | "createdAt" | "operationType" | "operatorFullName"
>;

export default async function DashboardPage() {
  const [
    totalPatients,
    reports,
  ] = await Promise.all([
    db.patient.count(),
    db.labourReport.findMany({
      select: {
        id: true,
        createdAt: true,
        operationType: true,
        operatorFullName: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const stats = computeStats(reports);

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de l'activité du service de maternité."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Opérations totales"
          value={String(stats.totalOperations)}
          icon={<Activity className="size-5" />}
          accent="border-l-primary"
          gradient="from-primary/10 to-primary/15"
          iconClass="bg-primary/10 text-primary"
        />
        <StatCard
          label="Césariennes"
          value={String(stats.cesarians)}
          icon={<Baby className="size-5" />}
          accent="border-l-emerald-500"
          gradient="from-emerald-500/10 to-emerald-500/15"
          iconClass="bg-emerald-500/10 text-emerald-600"
        />
        <StatCard
          label="Opérations programmées"
          value={String(stats.scheduledOps)}
          icon={<Stethoscope className="size-5" />}
          accent="border-l-sky-500"
          gradient="from-sky-500/10 to-sky-500/15"
          iconClass="bg-sky-500/10 text-sky-600"
        />
        <StatCard
          label="Patients enregistrés"
          value={String(totalPatients)}
          icon={<Users className="size-5" />}
          accent="border-l-violet-500"
          gradient="from-violet-500/10 to-violet-500/15"
          iconClass="bg-violet-500/10 text-violet-600"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <PeriodCard
          label="Césariennes aujourd'hui"
          value={stats.cesariansToday}
          delta={stats.cesariansTodayDelta}
          icon={<CalendarClock className="size-4" />}
        />
        <PeriodCard
          label="Césariennes cette semaine"
          value={stats.cesariansWeek}
          delta={stats.cesariansWeekDelta}
          icon={<CalendarDays className="size-4" />}
        />
        <PeriodCard
          label="Césariennes ce mois-ci"
          value={stats.cesariansMonth}
          delta={stats.cesariansMonthDelta}
          icon={<CalendarDays className="size-4" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Opérations par mois</CardTitle>
            <CardDescription>Les 6 derniers mois.</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyChart data={stats.monthlyCounts} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Répartition par type</CardTitle>
            <CardDescription>Type d&apos;intervention.</CardDescription>
          </CardHeader>
          <CardContent>
            <OperationTypeChart stats={stats} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>Les derniers rapports créés.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {reports.length === 0 ? (
            <p>Aucun rapport pour le moment.</p>
          ) : (
            <ul className="divide-y divide-border">
              {reports.slice(0, 5).map((report) => (
                <li
                  key={report.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3"
                >
                  <span className="font-medium text-foreground">
                    {report.operatorFullName}
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

// ─────────────────────────────────────────────────────────────
// Stat components
// ─────────────────────────────────────────────────────────────

type StatCardProps = {
  label: string;
  value: string;
  icon: ReactNode;
  accent: string;
  gradient: string;
  iconClass: string;
};

function StatCard({ label, value, icon, accent, gradient, iconClass }: StatCardProps) {
  return (
    <Card className={cn("border-l-4 bg-gradient-to-br", accent, gradient)}>
      <CardHeader className="pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {label}
          </CardTitle>
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-lg",
              iconClass
            )}
          >
            {icon}
          </span>
        </div>
        <CardTitle className="text-3xl font-bold text-foreground">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <span className="text-xs text-muted-foreground">
          Enregistré dans la base
        </span>
      </CardContent>
    </Card>
  );
}

type PeriodCardProps = {
  label: string;
  value: number;
  delta: number;
  icon: ReactNode;
};

function PeriodCard({ label, value, delta, icon }: PeriodCardProps) {
  const hasDelta = delta !== 0;
  const up = delta > 0;
  const DeltaIcon = up ? TrendingUp : TrendingDown;
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-1">
        <CardTitle className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-3xl font-bold text-foreground">
          {value}
        </CardTitle>
        {hasDelta ? (
          <p
            className={cn(
              "mt-1 flex items-center gap-1 text-xs font-medium",
              up ? "text-emerald-600" : "text-destructive"
            )}
          >
            <DeltaIcon className="size-3.5" />
            {up ? "+" : ""}
            {delta} vs période précédente
          </p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">
            vs période précédente
          </p>
        )}
      </CardContent>
    </Card>
  );
}

type Bar = { label: string; value: number };

function MonthlyChart({ data }: { data: Bar[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex h-44 items-end gap-2">
      {data.map((d) => (
        <div
          key={d.label}
          className="group flex flex-1 flex-col items-center gap-1.5"
        >
          <span className="text-xs font-medium text-foreground">
            {d.value}
          </span>
          <div
            className="w-full rounded-t-md bg-primary/20 transition-colors group-hover:bg-primary/40"
            style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value > 0 ? 6 : 2 }}
          />
          <span className="text-center text-[10px] uppercase text-muted-foreground">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function OperationTypeChart({ stats }: { stats: DashboardStats }) {
  const total = Math.max(1, stats.totalOperations);
  const segments = [
    {
      label: operationTypeLabels.CESARIAN,
      value: stats.cesarians,
      color: "bg-emerald-500",
      dot: "bg-emerald-500",
    },
    {
      label: operationTypeLabels.OPERATION_PROGRAMME,
      value: stats.scheduledOps,
      color: "bg-sky-500",
      dot: "bg-sky-500",
    },
  ];

  if (stats.totalOperations === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucune donnée pour le moment.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-4 w-full overflow-hidden rounded-full">
        {segments.map(
          (seg) =>
            seg.value > 0 && (
              <div
                key={seg.label}
                className={seg.color}
                style={{ width: `${(seg.value / total) * 100}%` }}
              />
            )
        )}
      </div>
      <ul className="space-y-2.5">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center justify-between gap-4 text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className={cn("size-2.5 rounded-full", seg.dot)} />
              {seg.label}
            </span>
            <span className="font-medium text-foreground">
              {seg.value}
              <span className="ml-1 text-xs text-muted-foreground">
                ({Math.round((seg.value / total) * 100)}%)
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Data computation
// ─────────────────────────────────────────────────────────────

type DashboardStats = {
  totalOperations: number;
  cesarians: number;
  scheduledOps: number;
  cesariansToday: number;
  cesariansWeek: number;
  cesariansMonth: number;
  cesariansTodayDelta: number;
  cesariansWeekDelta: number;
  cesariansMonthDelta: number;
  monthlyCounts: Bar[];
};

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function startOfWeek(d: Date): Date {
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = (day.getDay() + 6) % 7; // Monday = 0
  day.setDate(day.getDate() - dow);
  return day;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function countInRange(
  reports: ReportMeta[],
  from: Date,
  to: Date
): number {
  return reports.filter((r) => r.createdAt >= from && r.createdAt < to).length;
}

function countCesariansInRange(
  reports: ReportMeta[],
  from: Date,
  to: Date
): number {
  return reports.filter(
    (r) =>
      r.operationType === OperationType.CESARIAN &&
      r.createdAt >= from &&
      r.createdAt < to
  ).length;
}

function computeStats(reports: ReportMeta[]): DashboardStats {
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);
  const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);

  const cesariansToday = countCesariansInRange(reports, todayStart, new Date(todayStart.getTime() + 86400000));
  const cesariansWeek = countCesariansInRange(reports, weekStart, new Date(weekStart.getTime() + 7 * 86400000));
  const cesariansMonth = countCesariansInRange(reports, monthStart, monthEnd);

  const prevDayStart = new Date(todayStart.getTime() - 86400000);
  const prevCesariansDay = countCesariansInRange(reports, prevDayStart, todayStart);
  const prevWeekStart = new Date(weekStart.getTime() - 7 * 86400000);
  const prevCesariansWeek = countCesariansInRange(reports, prevWeekStart, weekStart);
  const prevMonthStart = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth() - 1,
    1
  );
  const prevCesariansMonth = countCesariansInRange(reports, prevMonthStart, monthStart);

  const cesariansTodayDelta = cesariansToday - prevCesariansDay;
  const cesariansWeekDelta = cesariansWeek - prevCesariansWeek;
  const cesariansMonthDelta = cesariansMonth - prevCesariansMonth;

  const monthlyCounts: Bar[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = startOfMonth(d);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const isJanStart = d.getMonth() === 0;
    monthlyCounts.push({
      label: `${isJanStart ? "'" + String(d.getFullYear()).slice(2) : ""} ${monthFormatter.format(d)}`.trim(),
      value: countInRange(reports, start, end),
    });
  }

  return {
    totalOperations: reports.length,
    cesarians: reports.filter(
      (r) => r.operationType === OperationType.CESARIAN
    ).length,
    scheduledOps: reports.filter(
      (r) => r.operationType === OperationType.OPERATION_PROGRAMME
    ).length,
    cesariansToday,
    cesariansWeek,
    cesariansMonth,
    cesariansTodayDelta,
    cesariansWeekDelta,
    cesariansMonthDelta,
    monthlyCounts,
  };
}

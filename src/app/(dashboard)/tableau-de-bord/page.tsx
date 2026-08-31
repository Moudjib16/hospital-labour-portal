import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground">
          Vue d&apos;ensemble de l&apos;activité du service de maternité.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Naissances totales" value="0" />
        <StatCard label="Accouchements naturels" value="0" />
        <StatCard label="Césariennes" value="0" />
        <StatCard label="Patients enregistrés" value="0" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>
            Les derniers rapports créés apparaîtront ici.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Aucun rapport pour le moment.
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
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        Statistiques en temps réel
      </CardContent>
    </Card>
  );
}

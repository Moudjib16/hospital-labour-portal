import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PatientsPage() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
          <p className="text-sm text-muted-foreground">
            Gestion des dossiers patients de la maternité.
          </p>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Liste des patients</CardTitle>
          <CardDescription>
            Recherchez ou enregistrez de nouveaux patients.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Aucun patient enregistré pour le moment.
        </CardContent>
      </Card>
    </div>
  );
}

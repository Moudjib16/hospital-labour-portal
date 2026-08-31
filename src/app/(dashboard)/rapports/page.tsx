import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RapportsPage() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rapports</h1>
          <p className="text-sm text-muted-foreground">
            Rapports médicaux post-opératoires et post-accouchement.
          </p>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Liste des rapports</CardTitle>
          <CardDescription>
            Créez et consultez les rapports d&apos;accouchement.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Aucun rapport créé pour le moment.
        </CardContent>
      </Card>
    </div>
  );
}

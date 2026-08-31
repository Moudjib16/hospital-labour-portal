import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ParametresPage() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-sm text-muted-foreground">
          Configuration du compte et de l&apos;application.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>
            Gestion de vos informations personnelles.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Les options de configuration seront disponibles dans une version
          ultérieure.
        </CardContent>
      </Card>
    </div>
  );
}

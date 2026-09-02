import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardNotFound() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <Card className="max-w-lg">
        <CardHeader>
          <FileQuestion className="mb-2 size-8 text-muted-foreground" aria-hidden="true" />
          <CardTitle>Page introuvable</CardTitle>
          <CardDescription>
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button render={<Link href="/tableau-de-bord" />}>
            Retour au tableau de bord
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

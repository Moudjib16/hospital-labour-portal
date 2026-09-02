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

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="max-w-lg">
        <CardHeader>
          <FileQuestion className="mb-2 size-8 text-muted-foreground" aria-hidden="true" />
          <CardTitle>Page introuvable</CardTitle>
          <CardDescription>
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button render={<Link href="/connexion" />}>
            Retour à la connexion
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

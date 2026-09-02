import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserManagement } from "@/components/user-management";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Paramètres",
};

export default async function ParametresPage() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/tableau-de-bord");
  }

  const users = await db.user.findMany({
    orderBy: [{ role: "asc" }, { username: "asc" }],
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <PageHeader
        title="Paramètres"
        description="Gestion des comptes utilisateurs et configuration de l'application."
      />

      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs</CardTitle>
          <CardDescription>
            Gérez les comptes médecins et administrateurs, ainsi que leurs
            accès.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserManagement
            users={users}
            currentUserId={session.user.id ?? ""}
          />
        </CardContent>
      </Card>
    </div>
  );
}
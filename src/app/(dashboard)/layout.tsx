import { type ReactNode } from "react";

import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar isAdmin={isAdmin} />
      <main className="flex flex-1 flex-col overflow-y-auto bg-slate-50">
        {children}
      </main>
    </div>
  );
}

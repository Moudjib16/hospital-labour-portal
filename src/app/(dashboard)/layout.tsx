import { type ReactNode } from "react";

import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <main className="flex flex-1 flex-col overflow-y-auto bg-slate-50">
        {children}
      </main>
    </div>
  );
}

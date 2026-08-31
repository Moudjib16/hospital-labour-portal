"use client";

import { usePathname } from "next/navigation";

import { Sidebar } from "@/components/sidebar";

export function AppSidebar() {
  const pathname = usePathname();
  return <Sidebar activePath={pathname} />;
}

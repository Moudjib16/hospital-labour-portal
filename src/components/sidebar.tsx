import Link from "next/link";
import { Activity, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  mainNavLinks,
  footerNavLinks,
  type NavLinkDef,
} from "@/components/nav-links";

type SidebarProps = {
  activePath: string;
};

export function Sidebar({ activePath }: SidebarProps) {
  const isActive = (href: string) => activePath === href;

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-slate-900 text-slate-100">
      <div className="flex h-16 items-center gap-3 px-6">
        <Activity className="h-7 w-7 text-cyan-400" aria-hidden="true" />
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight text-white">
            Portail Hospitalier
          </p>
          <p className="text-xs text-slate-400">Rapports Médicaux</p>
        </div>
      </div>

      <Separator className="bg-slate-800" />

      <nav
        className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4"
        aria-label="Navigation principale"
      >
        <div className="space-y-1">
          {mainNavLinks.map((link) => (
            <NavItem key={link.href} link={link} active={isActive(link.href)} />
          ))}
        </div>

        <div className="mt-auto space-y-1">
          {footerNavLinks.map((link) => (
            <NavItem key={link.href} link={link} active={isActive(link.href)} />
          ))}
          <SidebarFooter />
        </div>
      </nav>
    </aside>
  );
}

type NavItemProps = {
  link: NavLinkDef;
  active: boolean;
};

function NavItem({ link, active }: NavItemProps) {
  const Icon = link.icon;

  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-cyan-500/15 text-cyan-300"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span>{link.label}</span>
    </Link>
  );
}

function SidebarFooter() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
    >
      <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span>Déconnexion</span>
    </Link>
  );
}

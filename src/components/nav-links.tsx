import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Info,
  type LucideIcon,
} from "lucide-react";

export type NavLinkDef = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const mainNavLinks: NavLinkDef[] = [
  {
    href: "/tableau-de-bord",
    label: "Tableau de bord",
    icon: LayoutDashboard,
  },
  {
    href: "/patients",
    label: "Patients",
    icon: Users,
  },
  {
    href: "/rapports",
    label: "Rapports",
    icon: FileText,
  },
];

export const footerNavLinks: NavLinkDef[] = [
  {
    href: "/parametres",
    label: "Paramètres",
    icon: Settings,
  },
  {
    href: "/a-propos",
    label: "À propos",
    icon: Info,
  },
];

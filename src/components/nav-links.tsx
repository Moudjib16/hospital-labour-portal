import {
  LayoutDashboard,
  Users,
  FileText,
  Search,
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
  {
    href: "/recherche",
    label: "Recherche",
    icon: Search,
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

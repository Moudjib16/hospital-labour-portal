/**
 * Portail Hospitalier — Rapports Médicaux
 * Développé par Zerrougue Abdelmoudjib
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Portail Hospitalier — Rapports Médicaux",
    template: "%s | Portail Hospitalier",
  },
  description:
    "Application interne permettant la numérisation et le suivi des rapports médicaux post-opératoires (accouchements naturels et césariennes).",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

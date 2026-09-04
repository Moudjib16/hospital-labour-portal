import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";

import { searchReports, searchPatients } from "@/lib/search";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportSearch } from "@/components/report-search";
import { ReportResultList, PatientResultList } from "@/components/search-results";
import { Pagination } from "@/components/pagination";
import { PageHeader } from "@/components/page-header";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Recherche",
};

type SearchPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function tabHref(q: string, tab: string): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  params.set("tab", tab);
  return `/recherche?${params.toString()}`;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const tab = typeof sp.tab === "string" ? sp.tab : "rapports";
  const activeTab = tab === "patients" ? "patients" : "rapports";
  const rawPage = typeof sp.page === "string" ? Number.parseInt(sp.page, 10) : 1;
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const [reportResponse, patientResponse] = await Promise.all([
    searchReports(q, page),
    searchPatients(q, page),
  ]);

  const reportTotalPages = Math.max(1, reportResponse.totalPages);
  const reportPage = Math.min(page, reportTotalPages);
  const patientTotalPages = Math.max(1, patientResponse.totalPages);
  const patientPage = Math.min(page, patientTotalPages);

  const activeTotal =
    activeTab === "rapports" ? reportResponse.total : patientResponse.total;
  const activeTotalPages =
    activeTab === "rapports" ? reportTotalPages : patientTotalPages;
  const activePage = activeTab === "rapports" ? reportPage : patientPage;

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <PageHeader
        title="Recherche"
        description="Recherchez dans le contenu des rapports médicaux et dans les dossiers patients."
      />

      <Card>
        <CardHeader>
          <CardTitle>Recherche narrative</CardTitle>
          <CardDescription>
            Recherche plein texte dans les comptes-rendus opératoires,
            complications, notes post-opératoires et antécédents.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ReportSearch q={q || undefined} />

          {!q ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Search className="size-4" aria-hidden="true" />
              Saisissez une recherche pour parcourir les rapports et les
              patients.
            </p>
          ) : (
            <>
              <div
                className="flex gap-1 rounded-lg bg-muted p-1"
                role="tablist"
                aria-label="Résultats"
              >
                <TabLink
                  href={tabHref(q, "rapports")}
                  active={activeTab === "rapports"}
                >
                  Rapports ({reportResponse.total})
                </TabLink>
                <TabLink
                  href={tabHref(q, "patients")}
                  active={activeTab === "patients"}
                >
                  Patients ({patientResponse.total})
                </TabLink>
              </div>

              <p className="text-xs text-muted-foreground">
                {activeTotal} résultat{activeTotal > 1 ? "s" : ""} pour «{" "}
                {q} ».
              </p>

              {activeTab === "rapports" ? (
                <>
                  <ReportResultList results={reportResponse.results} />
                  <Pagination
                    path="/recherche"
                    page={activePage}
                    totalPages={activeTotalPages}
                    params={{ q, tab: "rapports" }}
                  />
                </>
              ) : (
                <>
                  <PatientResultList results={patientResponse.results} />
                  <Pagination
                    path="/recherche"
                    page={activePage}
                    totalPages={activeTotalPages}
                    params={{ q, tab: "patients" }}
                  />
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TabLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      role="tab"
      aria-selected={active ? "true" : "false"}
      className={cn(
        "flex-1 rounded-md px-3 py-1.5 text-center text-sm font-medium transition-colors",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}
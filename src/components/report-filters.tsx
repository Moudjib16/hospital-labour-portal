"use client";

import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, X } from "lucide-react";

import { OperationType } from "@/generated/prisma/enums";
import { operationTypeLabels } from "@/lib/report-labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ReportFiltersValue = {
  q?: string;
  operation?: string;
  from?: string;
  to?: string;
};

type ReportFiltersProps = {
  filters: ReportFiltersValue;
};

export function ReportFilters({ filters }: ReportFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const apply = useCallback(
    (next: ReportFiltersValue) => {
      const params = new URLSearchParams();
      if (next.q) params.set("q", next.q);
      if (next.operation) params.set("operation", next.operation);
      if (next.from) params.set("from", next.from);
      if (next.to) params.set("to", next.to);

      const query = params.toString();
      startTransition(() => {
        router.push(query ? `/rapports?${query}` : "/rapports");
      });
    },
    [router]
  );

  const reset = useCallback(() => {
    router.push("/rapports");
  }, [router]);

  const hasFilters = !!(
    filters.q ||
    filters.operation ||
    filters.from ||
    filters.to
  );

  const filterKey = JSON.stringify({ filters });

  return (
    <form
      key={filterKey}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        apply({
          q: (formData.get("q") as string) || undefined,
          operation: (formData.get("operation") as string) || undefined,
          from: (formData.get("from") as string) || undefined,
          to: (formData.get("to") as string) || undefined,
        });
      }}
      className="grid gap-4 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]"
      data-pending={isPending ? "" : undefined}
    >
      <div className="space-y-1.5">
        <Label htmlFor="filter-q">Rechercher</Label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            id="filter-q"
            name="q"
            type="search"
            defaultValue={filters.q ?? ""}
            placeholder="Patient, opérateur, anesthésiste"
            className="pl-8"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Type d&apos;opération</Label>
        <Select name="operation" defaultValue={filters.operation ?? ""}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tous" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous</SelectItem>
            {Object.values(OperationType).map((value) => (
              <SelectItem key={value} value={value}>
                {operationTypeLabels[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="filter-from">Du</Label>
        <Input id="filter-from" name="from" type="date" defaultValue={filters.from ?? ""} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="filter-to">Au</Label>
        <Input id="filter-to" name="to" type="date" defaultValue={filters.to ?? ""} />
      </div>

      <div className="flex items-end gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Filtrage..." : "Filtrer"}
        </Button>
        {hasFilters ? (
          <Button type="button" variant="outline" onClick={reset}>
            <X aria-hidden="true" />
            Réinitialiser
          </Button>
        ) : null}
      </div>
    </form>
  );
}

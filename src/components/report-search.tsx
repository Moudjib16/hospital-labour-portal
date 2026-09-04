"use client";

import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export function ReportSearch({ q }: { q?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const apply = useCallback(
    (next: string) => {
      const params = new URLSearchParams();
      if (next) params.set("q", next);

      const query = params.toString();
      startTransition(() => {
        router.push(query ? `/recherche?${query}` : "/recherche");
      });
    },
    [router]
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        apply(((formData.get("q") as string) ?? "").trim());
      }}
      className="relative w-full max-w-lg"
      data-pending={isPending ? "" : undefined}
    >
      <Search
        className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        name="q"
        placeholder="Rechercher dans les rapports et les patients..."
        defaultValue={q ?? ""}
        className="pl-8"
      />
    </form>
  );
}
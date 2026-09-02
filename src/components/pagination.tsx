import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type PaginationProps = {
  path: string;
  page: number;
  totalPages: number;
  params?: Record<string, string | number | undefined>;
};

function pageHref(
  path: string,
  page: number,
  params: PaginationProps["params"]
): string {
  const search = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        search.set(key, String(value));
      }
    }
  }
  search.set("page", String(page));
  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

export function Pagination({
  path,
  page,
  totalPages,
  params,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = collectPages(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="mt-4 flex flex-wrap items-center justify-between gap-3"
    >
      <p className="text-xs text-muted-foreground">
        Page {page} sur {totalPages}
      </p>

      <div className="flex items-center gap-1">
        <PageLink
          href={pageHref(path, page - 1, params)}
          disabled={page <= 1}
          className="gap-1"
        >
          <ChevronLeft aria-hidden="true" />
          Précédent
        </PageLink>

        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span
              key={`ellipsis-${i}`}
              className="px-1.5 text-sm text-muted-foreground"
            >
              …
            </span>
          ) : (
            <PageNumber
              key={p}
              href={pageHref(path, p, params)}
              active={p === page}
            >
              {p}
            </PageNumber>
          )
        )}

        <PageLink
          href={pageHref(path, page + 1, params)}
          disabled={page >= totalPages}
          className="flex-row-reverse gap-1"
        >
          <ChevronRight aria-hidden="true" />
          Suivant
        </PageLink>
      </div>
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  className,
  children,
}: {
  href: string;
  disabled: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "pointer-events-none opacity-50",
          className
        )}
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant: "outline" }), className)}
    >
      {children}
    </Link>
  );
}

function PageNumber({
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
      aria-current={active ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: active ? "default" : "ghost",
          size: "icon",
        })
      )}
    >
      {children}
    </Link>
  );
}

function collectPages(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  let start = Math.max(2, current - 1);
  let end = Math.min(total - 1, current + 1);

  if (current <= 3) {
    start = 2;
    end = 4;
  } else if (current >= total - 2) {
    start = total - 3;
    end = total - 1;
  }

  if (start > 2) {
    pages.push("ellipsis");
  }
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (end < total - 1) {
    pages.push("ellipsis");
  }

  pages.push(total);
  return pages;
}

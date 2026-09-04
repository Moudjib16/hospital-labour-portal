"use client";

import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PrintButton({ documentTitle }: { documentTitle?: string }) {
  return (
    <Button
      variant="outline"
      onClick={() => {
        const originalTitle = document.title;
        if (documentTitle) document.title = documentTitle;
        window.print();
        document.title = originalTitle;
      }}
    >
      <Printer aria-hidden="true" />
      Imprimer / PDF
    </Button>
  );
}

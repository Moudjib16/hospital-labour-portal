"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Printer } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createReport, createAndPrintReport } from "@/actions/reports";
import { BloodType, OperationType } from "@/generated/prisma/enums";
import {
  bloodTypeLabels,
  operationTypeLabels,
} from "@/lib/report-labels";

type ReportFormProps = {
  operatorName: string;
};

type ReportDraft = {
  firstName: string;
  lastName: string;
  age: string;
  nationality: string;
  bloodType: string;
  birthPlace: string;
  medicalHistory: string;
  operationType: string;
  deliveryDate: string;
  anesthesiologistFullName: string;
  fullDescription: string;
  complications: string;
  postOpNotes: string;
};

const initialDraft: ReportDraft = {
  firstName: "",
  lastName: "",
  age: "",
  nationality: "",
  bloodType: "",
  birthPlace: "",
  medicalHistory: "",
  operationType: "",
  deliveryDate: "",
  anesthesiologistFullName: "",
  fullDescription: "",
  complications: "",
  postOpNotes: "",
};

export function ReportForm({ operatorName }: ReportFormProps) {
  const [state, formAction, pending] = useActionState(createReport, {
    error: undefined,
  });
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [printing, setPrinting] = useState(false);
  const [printError, setPrintError] = useState<string | null>(null);
  const [draft, setDraft] = useState<ReportDraft>(initialDraft);

  const set = (key: keyof ReportDraft) => (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => setDraft((d) => ({ ...d, [key]: event.target.value }));

  async function handlePrint() {
    const form = formRef.current;
    if (!form) return;
    if (!form.reportValidity()) {
      form.requestSubmit();
      return;
    }

    setPrinting(true);
    setPrintError(null);
    const result = await createAndPrintReport(new FormData(form));
    setPrinting(false);

    if ("error" in result) {
      setPrintError(result.error);
      return;
    }

    router.push(`/rapports/${result.id}?print=1`);
  }

  return (
    <>
      <Card>
        <form ref={formRef} action={formAction} className="contents">
          <CardHeader>
            <CardTitle>Informations du rapport</CardTitle>
            <CardDescription>
              Renseignez les informations du patient. Le patient est
              automatiquement enregistré dans la base lors de la sauvegarde. Les
              champs marqués d&apos;un astérisque (&nbsp;*&nbsp;) sont
              obligatoires.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="operatorFullName">Opérateur</Label>
              <Input
                id="operatorFullName"
                value={operatorName}
                disabled
                readOnly
              />
            </div>

            <fieldset className="space-y-4 border-t border-border pt-4">
              <legend className="flex items-center gap-2 px-0 text-xs font-semibold uppercase tracking-wider text-primary">
                <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                Informations du patient
              </legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={draft.lastName}
                    onChange={set("lastName")}
                    placeholder="Nom de famille"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={draft.firstName}
                    onChange={set("firstName")}
                    placeholder="Prénom"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="age">Âge *</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={draft.age}
                    onChange={set("age")}
                    placeholder="Ex. 31"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationalité *</Label>
                  <Input
                    id="nationality"
                    name="nationality"
                    value={draft.nationality}
                    onChange={set("nationality")}
                    placeholder="Ex. Algérienne"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Groupe sanguin *</Label>
                  <Select
                    name="bloodType"
                    value={draft.bloodType}
                    onValueChange={(value) =>
                      setDraft((d) => ({ ...d, bloodType: value ?? "" }))
                    }
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(BloodType).map((value) => (
                        <SelectItem key={value} value={value}>
                          {bloodTypeLabels[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthPlace">Lieu de naissance</Label>
                <Input
                  id="birthPlace"
                  name="birthPlace"
                  value={draft.birthPlace}
                  onChange={set("birthPlace")}
                  placeholder="Ex. Mila"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Antécédents médicaux</Label>
                <Textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  rows={2}
                  value={draft.medicalHistory}
                  onChange={set("medicalHistory")}
                  placeholder="Antécédents éventuels"
                />
              </div>
            </fieldset>

            <fieldset className="space-y-4 border-t border-border pt-4">
              <legend className="flex items-center gap-2 px-0 text-xs font-semibold uppercase tracking-wider text-primary">
                <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                Informations de l&apos;intervention
              </legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Type d&apos;opération *</Label>
                  <Select
                    name="operationType"
                    value={draft.operationType}
                    onValueChange={(value) =>
                      setDraft((d) => ({ ...d, operationType: value ?? "" }))
                    }
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(OperationType).map((value) => (
                        <SelectItem key={value} value={value}>
                          {operationTypeLabels[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">Date d&apos;accouchement</Label>
                  <Input
                    id="deliveryDate"
                    name="deliveryDate"
                    type="datetime-local"
                    value={draft.deliveryDate}
                    onChange={set("deliveryDate")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="anesthesiologistFullName">
                  Anesthésiste *
                </Label>
                <Input
                  id="anesthesiologistFullName"
                  name="anesthesiologistFullName"
                  value={draft.anesthesiologistFullName}
                  onChange={set("anesthesiologistFullName")}
                  placeholder="Nom de l'anesthésiste"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullDescription">
                  Description complète de l&apos;intervention *
                </Label>
                <Textarea
                  id="fullDescription"
                  name="fullDescription"
                  rows={8}
                  value={draft.fullDescription}
                  onChange={set("fullDescription")}
                  required
                  placeholder="Compte-rendu opératoire détaillé..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="complications">Complications</Label>
                <Input
                  id="complications"
                  name="complications"
                  value={draft.complications}
                  onChange={set("complications")}
                  placeholder="Complications éventuelles"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postOpNotes">Notes post-opératoires</Label>
                <Textarea
                  id="postOpNotes"
                  name="postOpNotes"
                  rows={3}
                  value={draft.postOpNotes}
                  onChange={set("postOpNotes")}
                  placeholder="Suites opératoires, sortie..."
                />
              </div>
            </fieldset>

            {state.error ? (
              <p aria-live="polite" className="text-sm text-red-600">
                {state.error}
              </p>
            ) : null}
            {printError ? (
              <p aria-live="polite" className="text-sm text-red-600">
                {printError}
              </p>
            ) : null}
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Link
              href="/rapports"
              className={buttonVariants({ variant: "outline" })}
            >
              Annuler
            </Link>
            <Button
              type="button"
              variant="outline"
              onClick={handlePrint}
              disabled={pending || printing}
            >
              <Printer aria-hidden="true" />
              {printing ? "Enregistrement..." : "Imprimer / PDF"}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Enregistrement..." : "Enregistrer le rapport"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}


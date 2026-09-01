"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { createReport } from "@/actions/reports";
import { OperationType } from "@/generated/prisma/enums";
import { operationTypeLabels } from "@/lib/report-labels";

export type ReportFormPatient = {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
};

type ReportFormProps = {
  patients: ReportFormPatient[];
  operatorName: string;
};

export function ReportForm({ patients, operatorName }: ReportFormProps) {
  const [state, formAction, pending] = useActionState(createReport, {
    error: undefined,
  });

  return (
    <Card>
      <form action={formAction} className="contents">
        <CardHeader>
          <CardTitle>Informations du rapport</CardTitle>
          <CardDescription>
            Les champs marqués d&apos;un astérisque (&nbsp;*&nbsp;) sont
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
            <p className="text-xs text-muted-foreground">
              Renseigné automatiquement avec votre nom.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Patient *</Label>
              <Select name="patientId" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Patients enregistrés</SelectLabel>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName} (
                        {patient.nationalId})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type d&apos;opération *</Label>
              <Select name="operationType" required>
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
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Date d&apos;accouchement</Label>
              <Input
                id="deliveryDate"
                name="deliveryDate"
                type="datetime-local"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anesthesiologistFullName">
                Anesthésiste *
              </Label>
              <Input
                id="anesthesiologistFullName"
                name="anesthesiologistFullName"
                placeholder="Nom de l'anesthésiste"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullDescription">
              Description complète de l&apos;intervention *
            </Label>
            <Textarea
              id="fullDescription"
              name="fullDescription"
              rows={8}
              required
              placeholder="Compte-rendu opératoire détaillé..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="complications">Complications</Label>
            <Input
              id="complications"
              name="complications"
              placeholder="Complications éventuelles"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postOpNotes">
              Notes post-opératoires
            </Label>
            <Textarea
              id="postOpNotes"
              name="postOpNotes"
              rows={3}
              placeholder="Suites opératoires, sortie..."
            />
          </div>

          {state.error ? (
            <p aria-live="polite" className="text-sm text-red-600">
              {state.error}
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
          <Button type="submit" disabled={pending}>
            {pending ? "Enregistrement..." : "Enregistrer le rapport"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
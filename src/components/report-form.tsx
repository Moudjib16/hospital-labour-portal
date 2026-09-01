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
import { createReport } from "@/actions/reports";
import { BloodType, OperationType } from "@/generated/prisma/enums";
import { operationTypeLabels } from "@/lib/report-labels";

const bloodTypeLabels: Record<BloodType, string> = {
  A_POS: "A+",
  A_NEG: "A-",
  B_POS: "B+",
  B_NEG: "B-",
  AB_POS: "AB+",
  AB_NEG: "AB-",
  O_POS: "O+",
  O_NEG: "O-",
};

type ReportFormProps = {
  operatorName: string;
};

export function ReportForm({ operatorName }: ReportFormProps) {
  const [state, formAction, pending] = useActionState(createReport, {
    error: undefined,
  });

  return (
    <Card>
      <form action={formAction} className="contents">
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
            <p className="text-xs text-muted-foreground">
              Renseigné automatiquement avec votre nom.
            </p>
          </div>

          <fieldset className="space-y-4">
            <legend className="text-sm font-medium text-muted-foreground">
              Informations du patient
            </legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nom *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Nom de famille"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Prénom *</Label>
                <Input
                  id="lastName"
                  name="lastName"
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
                  placeholder="Ex. 31"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationalité *</Label>
                <Input
                  id="nationality"
                  name="nationality"
                  placeholder="Ex. Algérienne"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Groupe sanguin *</Label>
                <Select name="bloodType" required>
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
                placeholder="Ex. Mila"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Antécédents médicaux</Label>
              <Textarea
                id="medicalHistory"
                name="medicalHistory"
                rows={2}
                placeholder="Antécédents éventuels"
              />
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-sm font-medium text-muted-foreground">
              Informations de l&apos;intervention
            </legend>
            <div className="grid gap-5 sm:grid-cols-2">
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
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Date d&apos;accouchement</Label>
                <Input
                  id="deliveryDate"
                  name="deliveryDate"
                  type="datetime-local"
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
          </fieldset>

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
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { BloodType, OperationType } from "@/generated/prisma/enums";

export type CreateReportState = {
  error?: string;
};

type SaveReportResult = { id: string } | { error: string };

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isOperationType(value: string): value is OperationType {
  return (Object.values(OperationType) as string[]).includes(value);
}

function isBloodType(value: string): value is BloodType {
  return (Object.values(BloodType) as string[]).includes(value);
}

function parsePositiveInt(value: string): number | null {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) {
    return null;
  }
  return n;
}

export async function createReport(
  _prevState: CreateReportState,
  formData: FormData
): Promise<CreateReportState> {
  const result = await saveReportFromForm(formData);
  if ("error" in result) {
    return { error: result.error };
  }

  revalidatePath("/rapports");
  redirect("/rapports");
}

export async function createAndPrintReport(
  formData: FormData
): Promise<SaveReportResult> {
  const result = await saveReportFromForm(formData);
  if ("error" in result) {
    return result;
  }

  revalidatePath("/rapports");
  return result;
}

async function saveReportFromForm(
  formData: FormData
): Promise<SaveReportResult> {
  const session = await auth();
  const doctorId = session?.user?.id;
  if (!doctorId) {
    return { error: "Votre session a expiré, veuillez vous reconnecter." };
  }

  const doctor = await db.user.findUnique({ where: { id: doctorId } });
  if (!doctor) {
    return { error: "Compte introuvable." };
  }

  const firstName = getString(formData, "firstName");
  const lastName = getString(formData, "lastName");
  const nationality = getString(formData, "nationality");
  const bloodType = getString(formData, "bloodType");
  const operationType = getString(formData, "operationType");
  const anesthesiologistFullName = getString(
    formData,
    "anesthesiologistFullName"
  );
  const fullDescription = getString(formData, "fullDescription");

  if (!firstName || !lastName) {
    return { error: "Veuillez renseigner le nom du patient." };
  }
  if (!nationality) {
    return { error: "Veuillez renseigner la nationalité." };
  }
  if (!isBloodType(bloodType)) {
    return { error: "Groupe sanguin invalide." };
  }
  if (!isOperationType(operationType)) {
    return { error: "Type d'opération invalide." };
  }
  if (!anesthesiologistFullName) {
    return { error: "Veuillez renseigner le nom de l'anesthésiste." };
  }
  if (!fullDescription) {
    return {
      error: "Veuillez renseigner la description complète de l'intervention.",
    };
  }

  const age = parsePositiveInt(getString(formData, "age"));
  if (age === null) {
    return { error: "L'âge doit être un nombre entier positif." };
  }

  const deliveryDateInput = getString(formData, "deliveryDate");
  const deliveryDate = deliveryDateInput
    ? new Date(deliveryDateInput)
    : undefined;
  if (deliveryDate && Number.isNaN(deliveryDate.getTime())) {
    return { error: "La date d'accouchement est invalide." };
  }

  const birthPlace = getString(formData, "birthPlace") || null;
  const medicalHistory = getString(formData, "medicalHistory") || null;

  const existing = await db.patient.findFirst({
    where: {
      firstName,
      lastName,
      age,
      nationality,
      bloodType,
    },
  });

  const patient = await db.patient.upsert({
    where: { id: existing?.id ?? "" },
    update: {},
    create: {
      firstName,
      lastName,
      age,
      nationality,
      bloodType,
      birthPlace,
      medicalHistory,
    },
  });

  const report = await db.labourReport.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      firstName,
      lastName,
      age,
      nationality,
      bloodType,
      operationType,
      deliveryDate,
      operatorFullName: doctor.name,
      anesthesiologistFullName,
      complications: getString(formData, "complications") || null,
      fullDescription,
      postOpNotes: getString(formData, "postOpNotes") || null,
    },
  });

  return { id: report.id };
}
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { parseDateOnly } from "@/lib/date-utils";
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

const EARLIEST_BIRTH_DATE = new Date("1900-01-01T00:00:00.000Z");

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

  const dateOfBirthInput = getString(formData, "dateOfBirth");
  if (!dateOfBirthInput) {
    return { error: "Veuillez renseigner la date de naissance." };
  }
  const dateOfBirth = parseDateOnly(dateOfBirthInput);
  if (Number.isNaN(dateOfBirth.getTime())) {
    return { error: "La date de naissance est invalide." };
  }
  if (dateOfBirth < EARLIEST_BIRTH_DATE || dateOfBirth > new Date()) {
    return { error: "La date de naissance est invalide." };
  }

  const deliveryDateInput = getString(formData, "deliveryDate");
  const deliveryDate = deliveryDateInput
    ? new Date(deliveryDateInput)
    : undefined;
  if (deliveryDate && Number.isNaN(deliveryDate.getTime())) {
    return { error: "La date d'accouchement est invalide." };
  }
  if (deliveryDate && deliveryDate < dateOfBirth) {
    return { error: "La date d'accouchement est antérieure à la date de naissance." };
  }

  const assistantFullName = getString(formData, "assistantFullName") || null;
  const birthPlace = getString(formData, "birthPlace") || null;
  const medicalHistory = getString(formData, "medicalHistory") || null;

  const report = await db.$transaction(async (tx) => {
    const existing = await tx.patient.findFirst({
      where: {
        firstName,
        lastName,
        dateOfBirth,
        nationality,
        bloodType,
      },
      select: { id: true },
    });

    let patientId: string;
    if (existing) {
      // Reuse the matching patient and refresh it with any new contact
      // details entered on the form (never wipe data with empty strings).
      if (birthPlace || medicalHistory) {
        await tx.patient.update({
          where: { id: existing.id },
          data: {
            ...(birthPlace ? { birthPlace } : {}),
            ...(medicalHistory ? { medicalHistory } : {}),
          },
        });
      }
      patientId = existing.id;
    } else {
      const created = await tx.patient.create({
        data: {
          firstName,
          lastName,
          dateOfBirth,
          nationality,
          bloodType,
          birthPlace,
          medicalHistory,
        },
        select: { id: true },
      });
      patientId = created.id;
    }

    return tx.labourReport.create({
      data: {
        patientId,
        doctorId: doctor.id,
        firstName,
        lastName,
        dateOfBirth,
        nationality,
        bloodType,
        operationType,
        deliveryDate,
        operatorFullName: doctor.name,
        anesthesiologistFullName,
        assistantFullName,
        complications: getString(formData, "complications") || null,
        fullDescription,
        postOpNotes: getString(formData, "postOpNotes") || null,
      },
    });
  });

  return { id: report.id };
}
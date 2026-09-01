"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { OperationType } from "@/generated/prisma/enums";

export type CreateReportState = {
  error?: string;
};

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isOperationType(value: string): value is OperationType {
  return (Object.values(OperationType) as string[]).includes(value);
}

export async function createReport(
  _prevState: CreateReportState,
  formData: FormData
): Promise<CreateReportState> {
  const session = await auth();
  const doctorId = session?.user?.id;
  if (!doctorId) {
    return { error: "Votre session a expiré, veuillez vous reconnecter." };
  }

  const patientId = getString(formData, "patientId");
  const operationType = getString(formData, "operationType");
  const anesthesiologistFullName = getString(
    formData,
    "anesthesiologistFullName"
  );
  const fullDescription = getString(formData, "fullDescription");

  if (!patientId) {
    return { error: "Veuillez sélectionner un patient." };
  }
  if (!isOperationType(operationType)) {
    return { error: "Type d'opération invalide." };
  }
  if (!anesthesiologistFullName) {
    return { error: "Veuillez renseigner le nom de l'anesthésiste." };
  }
  if (!fullDescription) {
    return {
      error:
        "Veuillez renseigner la description complète de l'intervention.",
    };
  }

  const [doctor, patient] = await Promise.all([
    db.user.findUnique({ where: { id: doctorId } }),
    db.patient.findUnique({ where: { id: patientId } }),
  ]);

  if (!doctor) {
    return { error: "Compte introuvable." };
  }
  if (!patient) {
    return { error: "Le patient sélectionné est introuvable." };
  }

  const deliveryDateInput = getString(formData, "deliveryDate");
  const deliveryDate = deliveryDateInput ? new Date(deliveryDateInput) : undefined;
  if (deliveryDate && Number.isNaN(deliveryDate.getTime())) {
    return { error: "La date d'accouchement est invalide." };
  }

  await db.labourReport.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      age: patient.age,
      nationality: patient.nationality,
      operationType,
      deliveryDate,
      operatorFullName: doctor.name,
      anesthesiologistFullName,
      complications: getString(formData, "complications") || null,
      fullDescription,
      postOpNotes: getString(formData, "postOpNotes") || null,
    },
  });

  revalidatePath("/rapports");
  redirect("/rapports");
}
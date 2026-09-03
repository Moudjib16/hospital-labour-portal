import { BloodType, OperationType, Role } from "@/generated/prisma/enums";

export const roleLabels: Record<Role, string> = {
  ADMIN: "Administrateur",
  DOCTOR: "Médecin",
};

export const operationTypeLabels: Record<OperationType, string> = {
  CESARIAN: "Césarienne",
  OPERATION_PROGRAMME: "Opération programmée",
};

export const bloodTypeLabels: Record<BloodType, string> = {
  A_POS: "A+",
  A_NEG: "A-",
  B_POS: "B+",
  B_NEG: "B-",
  AB_POS: "AB+",
  AB_NEG: "AB-",
  O_POS: "O+",
  O_NEG: "O-",
};
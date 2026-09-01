import { BloodType, OperationType } from "@/generated/prisma/enums";

export const operationTypeLabels: Record<OperationType, string> = {
  NATURAL_DELIVERY: "Accouchement naturel",
  EMERGENCY_C_SECTION: "Césarienne en urgence",
  SCHEDULED_C_SECTION: "Césarienne programmée",
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
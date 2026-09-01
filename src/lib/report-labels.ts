import { OperationType } from "@/generated/prisma/enums";

export const operationTypeLabels: Record<OperationType, string> = {
  NATURAL_DELIVERY: "Accouchement naturel",
  EMERGENCY_C_SECTION: "Césarienne en urgence",
  SCHEDULED_C_SECTION: "Césarienne programmée",
};
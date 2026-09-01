/*
  Warnings:

  - You are about to drop the column `deliveryType` on the `LabourReport` table. All the data in the column will be lost.
  - Added the required column `age` to the `LabourReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anesthesiologistFullName` to the `LabourReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `LabourReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullDescription` to the `LabourReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `LabourReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationality` to the `LabourReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operationType` to the `LabourReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operatorFullName` to the `LabourReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `age` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationality` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('NATURAL_DELIVERY', 'EMERGENCY_C_SECTION', 'SCHEDULED_C_SECTION');

-- AlterTable
ALTER TABLE "LabourReport" DROP COLUMN "deliveryType",
ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "anesthesiologistFullName" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "fullDescription" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "nationality" TEXT NOT NULL,
ADD COLUMN     "operationType" "OperationType" NOT NULL,
ADD COLUMN     "operatorFullName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "nationality" TEXT NOT NULL;

-- DropEnum
DROP TYPE "DeliveryType";

-- DropIndex
DROP INDEX "Patient_nationalId_key";

-- AlterTable
ALTER TABLE "LabourReport" ADD COLUMN     "bloodType" "BloodType" NOT NULL;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "dateOfBirth",
DROP COLUMN "nationalId";

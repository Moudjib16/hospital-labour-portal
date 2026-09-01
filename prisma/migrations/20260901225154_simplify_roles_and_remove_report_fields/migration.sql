-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'DOCTOR');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'DOCTOR';
COMMIT;

-- AlterTable
ALTER TABLE "LabourReport" DROP COLUMN "babyGender",
DROP COLUMN "babyWeightGrams",
DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "address";

-- DropEnum
DROP TYPE "ReportStatus";
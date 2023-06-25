-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'TENANT');

-- AlterTable
ALTER TABLE "UserAccount" ADD COLUMN     "externalId" STRING;
ALTER TABLE "UserAccount" ADD COLUMN     "externalProvider" STRING;
ALTER TABLE "UserAccount" ADD COLUMN     "userType" "UserType" NOT NULL DEFAULT 'TENANT';

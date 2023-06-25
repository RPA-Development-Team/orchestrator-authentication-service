-- AlterTable
ALTER TABLE "UserAccount" ADD COLUMN     "adminID" INT4;

-- AddForeignKey
ALTER TABLE "UserAccount" ADD CONSTRAINT "UserAccount_adminID_fkey" FOREIGN KEY ("adminID") REFERENCES "UserAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

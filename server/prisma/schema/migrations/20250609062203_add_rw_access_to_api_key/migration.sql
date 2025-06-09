-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN     "readAccess" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "writeAccess" BOOLEAN NOT NULL DEFAULT true;

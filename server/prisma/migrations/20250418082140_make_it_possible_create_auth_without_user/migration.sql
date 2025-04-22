-- AlterTable
ALTER TABLE "EmailAuth" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PasskeyAuth" ALTER COLUMN "userId" DROP NOT NULL;

/*
  Warnings:

  - A unique constraint covering the columns `[enText]` on the table `Translation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[koText]` on the table `Translation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[jaText]` on the table `Translation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[zhText]` on the table `Translation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uzText]` on the table `Translation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[viText]` on the table `Translation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ruText]` on the table `Translation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kkText]` on the table `Translation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mnText]` on the table `Translation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[thText]` on the table `Translation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idText]` on the table `Translation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Translation" DROP CONSTRAINT "Translation_userId_fkey";

-- DropIndex
DROP INDEX "Translation_enText_idx";

-- DropIndex
DROP INDEX "Translation_idText_idx";

-- DropIndex
DROP INDEX "Translation_jaText_idx";

-- DropIndex
DROP INDEX "Translation_kkText_idx";

-- DropIndex
DROP INDEX "Translation_koText_idx";

-- DropIndex
DROP INDEX "Translation_mnText_idx";

-- DropIndex
DROP INDEX "Translation_ruText_idx";

-- DropIndex
DROP INDEX "Translation_thText_idx";

-- DropIndex
DROP INDEX "Translation_uzText_idx";

-- DropIndex
DROP INDEX "Translation_viText_idx";

-- DropIndex
DROP INDEX "Translation_zhText_idx";

-- CreateTable
CREATE TABLE "TranslationLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sourceLanguage" TEXT NOT NULL,
    "targetLanguage" TEXT NOT NULL,
    "sourceText" TEXT NOT NULL,
    "targetText" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "TranslationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Translation_enText_key" ON "Translation"("enText");

-- CreateIndex
CREATE UNIQUE INDEX "Translation_koText_key" ON "Translation"("koText");

-- CreateIndex
CREATE UNIQUE INDEX "Translation_jaText_key" ON "Translation"("jaText");

-- CreateIndex
CREATE UNIQUE INDEX "Translation_zhText_key" ON "Translation"("zhText");

-- CreateIndex
CREATE UNIQUE INDEX "Translation_uzText_key" ON "Translation"("uzText");

-- CreateIndex
CREATE UNIQUE INDEX "Translation_viText_key" ON "Translation"("viText");

-- CreateIndex
CREATE UNIQUE INDEX "Translation_ruText_key" ON "Translation"("ruText");

-- CreateIndex
CREATE UNIQUE INDEX "Translation_kkText_key" ON "Translation"("kkText");

-- CreateIndex
CREATE UNIQUE INDEX "Translation_mnText_key" ON "Translation"("mnText");

-- CreateIndex
CREATE UNIQUE INDEX "Translation_thText_key" ON "Translation"("thText");

-- CreateIndex
CREATE UNIQUE INDEX "Translation_idText_key" ON "Translation"("idText");

-- CreateIndex
CREATE INDEX "Translation_userId_idx" ON "Translation"("userId");

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationLog" ADD CONSTRAINT "TranslationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

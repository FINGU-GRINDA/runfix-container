/*
  Warnings:

  - A unique constraint covering the columns `[publicKey]` on the table `PasskeyAuth` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PasskeyAuth_publicKey_key" ON "PasskeyAuth"("publicKey");

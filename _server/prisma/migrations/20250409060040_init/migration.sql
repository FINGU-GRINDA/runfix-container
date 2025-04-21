-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "key" TEXT NOT NULL,
    "usageCount" BIGINT NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailAuth" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "EmailAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasskeyAuth" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publicKey" BYTEA NOT NULL,
    "webAuthnUserId" TEXT NOT NULL,
    "counter" BIGINT NOT NULL,
    "deviceType" VARCHAR(32) NOT NULL,
    "backedUpAt" TIMESTAMP(3),
    "isBackupEligible" BOOLEAN,
    "transports" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PasskeyAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "profilePicture" TEXT,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userAgent" TEXT,
    "headers" JSONB NOT NULL,
    "ipAddress" TEXT,
    "accessToken" TEXT NOT NULL,
    "invalidatedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Translation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enText" TEXT,
    "koText" TEXT,
    "jaText" TEXT,
    "zhText" TEXT,
    "uzText" TEXT,
    "viText" TEXT,
    "ruText" TEXT,
    "kkText" TEXT,
    "mnText" TEXT,
    "thText" TEXT,
    "idText" TEXT,
    "userId" TEXT,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");

-- CreateIndex
CREATE UNIQUE INDEX "EmailAuth_emailAddress_key" ON "EmailAuth"("emailAddress");

-- CreateIndex
CREATE INDEX "Translation_enText_idx" ON "Translation"("enText");

-- CreateIndex
CREATE INDEX "Translation_koText_idx" ON "Translation"("koText");

-- CreateIndex
CREATE INDEX "Translation_jaText_idx" ON "Translation"("jaText");

-- CreateIndex
CREATE INDEX "Translation_zhText_idx" ON "Translation"("zhText");

-- CreateIndex
CREATE INDEX "Translation_uzText_idx" ON "Translation"("uzText");

-- CreateIndex
CREATE INDEX "Translation_viText_idx" ON "Translation"("viText");

-- CreateIndex
CREATE INDEX "Translation_ruText_idx" ON "Translation"("ruText");

-- CreateIndex
CREATE INDEX "Translation_kkText_idx" ON "Translation"("kkText");

-- CreateIndex
CREATE INDEX "Translation_mnText_idx" ON "Translation"("mnText");

-- CreateIndex
CREATE INDEX "Translation_thText_idx" ON "Translation"("thText");

-- CreateIndex
CREATE INDEX "Translation_idText_idx" ON "Translation"("idText");

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailAuth" ADD CONSTRAINT "EmailAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasskeyAuth" ADD CONSTRAINT "PasskeyAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

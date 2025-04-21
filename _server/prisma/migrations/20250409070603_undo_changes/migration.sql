-- DropIndex
DROP INDEX "Translation_enText_key";

-- DropIndex
DROP INDEX "Translation_idText_key";

-- DropIndex
DROP INDEX "Translation_jaText_key";

-- DropIndex
DROP INDEX "Translation_kkText_key";

-- DropIndex
DROP INDEX "Translation_koText_key";

-- DropIndex
DROP INDEX "Translation_mnText_key";

-- DropIndex
DROP INDEX "Translation_ruText_key";

-- DropIndex
DROP INDEX "Translation_thText_key";

-- DropIndex
DROP INDEX "Translation_userId_idx";

-- DropIndex
DROP INDEX "Translation_uzText_key";

-- DropIndex
DROP INDEX "Translation_viText_key";

-- DropIndex
DROP INDEX "Translation_zhText_key";

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

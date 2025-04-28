-- AlterTable
ALTER TABLE "Translation" ADD COLUMN     "path" TEXT;

-- CreateIndex
CREATE INDEX "Translation_context_idx" ON "Translation"("context");

-- CreateIndex
CREATE INDEX "Translation_path_idx" ON "Translation"("path");

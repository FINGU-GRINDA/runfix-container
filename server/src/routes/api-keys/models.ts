import { Static, t } from "elysia";

export const apiKeySchema = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  key: t.String(),
  usageCount: t.Number(),
  userId: t.String(),
});

export type ApiKey = Static<typeof apiKeySchema>;

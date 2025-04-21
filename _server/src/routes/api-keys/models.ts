import { Static, t } from "elysia";
import { ApiKey, ApiKeyPlain } from "../../../prisma/prismabox/ApiKey";

export const BaseApiKeySchema = ApiKeyPlain;
export type BaseApiKey = Static<typeof BaseApiKeySchema>;

import Elysia, { type Static, t } from "elysia";
import { HttpError } from "elysia-http-error";
import { ApiKey } from "../../../prisma/schema/prismabox/ApiKey";
import { jwtPlugin } from "../stateless/jwt-plugin";
import { parseValuePlugin } from "../stateless/parse-value-plugin";
import { databasePlugin } from "./database-plugin";

export const SessionApiKeySchema = ApiKey;

export type SessionApiKey = Static<typeof SessionApiKeySchema>;

export const apiKeyHeadersPlugin = new Elysia({
  name: "api-key-headers-plugin",
  detail: {
    description: "API key headers plugin",
    summary: "API key headers plugin",
  },
})
  .guard({
    headers: t.Object({
      "api-key": t.String(),
    }),
  })
  .as("plugin");

export const authenticateApiKeyProjectPlugin = new Elysia({
  name: "authenticate-api-key-plugin",
  detail: {
    description: "Authenticate API key plugin",
    summary: "Authenticate API key plugin",
  },
})
  .use(apiKeyHeadersPlugin)
  .use(databasePlugin)
  .use(jwtPlugin)
  .use(parseValuePlugin)
  .resolve(async (ctx) => {
    const token = ctx.headers["api-key"];

    if (!token) {
      throw HttpError.Unauthorized("Missing API key");
    }

    const decodedToken = await ctx.jwt.decode({ token: token });

    // if (!decodedToken) {
    // 	throw HttpError.BadRequest("Malformed API key");
    // }

    // const verifiedToken = await ctx.jwt.verify({ token: token });

    // if (!verifiedToken) {
    // 	throw HttpError.Unauthorized("Invalid API key");
    // }

    const apiKey = ctx.parseValue(
      SessionApiKeySchema,
      decodedToken.apiKey
    ) as unknown as SessionApiKey;

    // check if api key is invalid in db
    const dbApiKey = await ctx.db.apiKey.findUnique({
      where: {
        id: apiKey.id,
      },
    });

    if (!dbApiKey) {
      throw HttpError.Unauthorized("Invalid API key");
    }

    return {
      apiKey: apiKey,
    };
  })
  .onAfterResponse(async (ctx) => {
    try {
      // increment api key usage
      await ctx.db.apiKey.update({
        where: {
          id: ctx.apiKey.id,
        },
        data: {
          usageCount: {
            increment: 1,
          },
        },
      });
    } catch (error) {
      console.error("Failed to update API key usage count:", error);
    }
  })
  .as("plugin");

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../deps/prisma";
import { passkey } from "better-auth/plugins/passkey";
import { config } from "../../config";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [config.CLIENT_BASE_URL],
  plugins: [passkey()],
});

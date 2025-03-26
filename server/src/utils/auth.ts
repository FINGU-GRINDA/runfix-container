import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../deps/prisma";
import { passkey } from "better-auth/plugins/passkey";
import { apiKey, organization, anonymous } from "better-auth/plugins";
import { config } from "../../config";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: false,
  },
  trustedOrigins: [config.CLIENT_BASE_URL],
  plugins: [passkey(), apiKey(), organization(), anonymous()],
});

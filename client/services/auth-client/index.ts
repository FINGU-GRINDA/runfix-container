import { createAuthClient } from "better-auth/react";
import { passkeyClient } from "better-auth/client/plugins";
import { clientConfig } from "@/clientConfig";

export const authClient = createAuthClient({
  baseURL: clientConfig.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [passkeyClient()],
});

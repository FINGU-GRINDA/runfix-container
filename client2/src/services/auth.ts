import { decryptToken } from "@/lib/jwt";

export const isAuthenticated = (params: { token: string }) => {
  try {
    const decodedToken = decryptToken({ token: params.token });
    return decodedToken;
  } catch (error) {
    console.error("Failed to decrypt token", error);
    return false;
  }
};

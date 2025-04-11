import * as jose from "jose";

export const decryptToken = (params: { token: string }) => {
  const decodedToken = jose.decodeJwt(params.token);
  return decodedToken;
};

import Elysia from "elysia";
import * as jose from "jose";
import { env } from "../../config";
import { getExpTimestampPlugin } from "./get-exp-timestamp-plugin";

const secret = new TextEncoder().encode(env.JWT_SECRET);

const alg = "HS256";

const issuer = env.ISSUER;

export const jwtPlugin = new Elysia({
	name: "jwt-plugin",
	detail: {
		description: "JWT plugin",
		summary: "JWT plugin",
	},
})
	.use(getExpTimestampPlugin)
	.resolve(async (ctx) => {
		return {
			jwt: {
				sign: async (params: { payload: jose.JWTPayload }): Promise<string> => {
					const jwt = new jose.SignJWT(params.payload);

					jwt.setProtectedHeader({ alg: alg });

					if (!params.payload.iss) {
						jwt.setIssuer(issuer);
					}

					if (!params.payload.iat) {
						jwt.setIssuedAt(ctx.getExpTimestamp({ seconds: 0 }));
					}

					if (!params.payload.exp) {
						jwt.setExpirationTime(
							ctx.getExpTimestamp({
								seconds: env.AUTH_TOKEN_EXPIRY_DURATION_MINUTES * 60 * 1000,
							}),
						);
					}

					const signedJwt = await jwt.sign(secret);

					return signedJwt;
				},
				decode: async (params: { token: string }) => {
					const claims = jose.decodeJwt(params.token);
					return claims;
				},
				verify: async (params: { token: string }) => {
					const output = await jose.jwtVerify(params.token, secret, {
						issuer: issuer,
					});

					return output.payload;
				},
			},
		};
	})
	.as("plugin");

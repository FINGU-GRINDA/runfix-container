import Elysia from "elysia";
import { deletePasskeyAuthRouter } from "./delete-passkey-auth";
import { addPasskeySigninOptionsRouter } from "./passkeys-add-signin-options";
import { addPasskeySigninVerificationRouter } from "./passkeys-add-signin-verification";
import { readAllPasskeyAuthRouter } from "./read-all-passkey-auth";
import { signinWithPasskeyRouter } from "./signin-with-passkey";

export const passkeyAuthRouter = new Elysia({
	prefix: "/passkey-auth",
	tags: ["Passkey Auth"],
	name: "passkey-auth-router",
	detail: {
		description: "Authentication",
		summary: "Authentication",
	},
})
	.use(readAllPasskeyAuthRouter)
	.use(deletePasskeyAuthRouter)
	.use(addPasskeySigninOptionsRouter)
	.use(addPasskeySigninVerificationRouter)
	.use(signinWithPasskeyRouter);

import Elysia from "elysia";
import { Resend } from "resend";
import { env } from "../../../config";
import { MagicLinkEmail } from "./templates/magic-link-email";

export const emailPlugin = new Elysia({
	name: "email-plugin",
	detail: {
		description: "Email plugin",
		summary: "Email plugin",
	},
})
	.resolve(async (_ctx) => {
		const resend = new Resend(env.RESEND_API_KEY);
		return {
			email: resend.emails,
			broadcast: resend.broadcasts,
			contacts: resend.contacts,
		};
	})
	.as("plugin");

export const sendMagicLinkEmailPlugin = new Elysia({
	name: "send-magic-link-email-plugin",
	detail: {
		description: "Send magic link email plugin",
		summary: "Send magic link email plugin",
	},
})
	.use(emailPlugin)
	.resolve(async (ctx) => {
		return {
			sendMagicLinkEmail: async (props: {
				verificationUrl: string;
				to: string;
			}) => {
				await ctx.email.send({
					from: `Sign in to ${env.SERVER_DOMAIN} <mail@${env.SERVER_DOMAIN}>`,
					to: props.to,
					subject: `Sign in to ${env.SERVER_DOMAIN}`,
					react: MagicLinkEmail({ verificationUrl: props.verificationUrl }),
				});
			},
		};
	})
	.as("plugin");

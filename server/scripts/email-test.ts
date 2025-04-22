import { Resend } from "resend";
import { env } from "../src/config";
import { MagicLinkEmail } from "../src/procedures/stateful/email-plugin/templates/magic-link-email";

const resend = new Resend(env.RESEND_API_KEY);

(async () => {
	const { data, error } = await resend.emails.send({
		to: ["vikyw89@gmail.com"],
		from: "Hana Translate <test@hanalangconnect.site>",
		subject: "Log in to Hana Translate",
		react: MagicLinkEmail({ verificationUrl: "https://hanalangconnect.site" }),
	});

	if (error) {
		return console.error({ error });
	}

	console.log({ data });
})();

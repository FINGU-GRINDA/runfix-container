import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import { env } from "../../../../config";

interface MagicLinkEmailProps {
	verificationUrl: string;
}

const previewText = `Sign in to ${env.ISSUER}`;

export const MagicLinkEmail = (props: MagicLinkEmailProps) => {
	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind
				config={{
					theme: {
						extend: {
							fontFamily: {
								sans: [
									"-apple-system",
									"BlinkMacSystemFont",
									'"Segoe UI"',
									"Roboto",
									'"Helvetica Neue"',
									"Arial",
									"sans-serif",
								],
							},
							colors: {
								brand: "#007AFF", // Apple blue
								text: {
									DEFAULT: "#1d1d1f", // Apple dark gray
									light: "#86868b", // Apple light gray
								},
								border: "#d1d1d6", // Apple border gray
								background: "#f5f5f7", // Apple background gray
							},
							borderRadius: {
								DEFAULT: "8px", // Standard border radius
							},
						},
					},
				}}
			>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-border p-[20px]">
						{/* --- Logo Section --- */}
						<Section className="mt-[32px] text-center">
							{/* Placeholder for Logo - Replace with your SVG or Img */}
							<Text className="text-2xl font-semibold text-text">
								{env.ISSUER}
							</Text>
						</Section>

						{/* --- Main Content Section --- */}
						<Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-text">
							Log in to <strong>{env.ISSUER}</strong>
						</Heading>

						<Text className="text-[14px] leading-[24px] text-text">Hello,</Text>

						<Text className="text-[14px] leading-[24px] text-text">
							Click the button below to securely log in to your {env.ISSUER}{" "}
							account. This link will expire shortly for your security.
						</Text>

						{/* --- Login Button --- */}
						<Section className="mb-[32px] mt-[32px] text-center">
							<Button
								className="rounded bg-brand px-5 py-3 text-center text-[14px] font-semibold text-white no-underline"
								href={props.verificationUrl}
							>
								Log In Securely
							</Button>
						</Section>

						<Text className="text-[14px] leading-[24px] text-text">
							Or copy and paste this URL into your browser:
							<br />
							<Link href={props.verificationUrl} className="text-brand">
								{props.verificationUrl}
							</Link>
						</Text>

						<Text className="mt-[32px] text-[14px] leading-[24px] text-text">
							If you didn't request this email, you can safely ignore it.
						</Text>

						{/* --- Footer Section --- */}
						<Section className="mt-[32px] text-center">
							<Text className="text-[12px] text-text-light">
								{new Date().getFullYear()} {env.ISSUER}. All rights reserved.
							</Text>
							{/* Optional: Add address or other contact info here */}
							{/* <Text className="text-[12px] text-text-light">Your Company Address</Text> */}
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

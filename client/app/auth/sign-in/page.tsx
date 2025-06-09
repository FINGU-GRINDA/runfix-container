"use client";

import { Icons } from "@/components/icons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { envClient } from "@/env-client";
import { ellysiaClient } from "@/services/ellysia";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// Types for form state and validation
interface FormState {
	email: string;
}

interface FormErrors {
	email?: string;
	general?: string;
}

export default function SignInPage() {
	const router = useRouter();
	const emailSignIn = ellysiaClient.useMutation(
		"post",
		"/api/email-auth/signin-with-magic-link",
		{
			onSuccess: () => {
				toast.success("Check your email for a sign-in link.");
			},
			onError: (error: Error) => {
				toast.error(error.message || "Failed to send sign-in link");
			},
		},
	);

	const [formState, setFormState] = useState<FormState>({ email: "" });
	const [formErrors, setFormErrors] = useState<FormErrors>({});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormState((prev) => ({ ...prev, [name]: value }));
		if (formErrors[name as keyof FormErrors]) {
			setFormErrors((prev) => ({ ...prev, [name]: undefined }));
		}
	};

	const validateForm = (): FormErrors => {
		const errors: FormErrors = {};

		if (!formState.email) {
			errors.email = "Email is required";
		} else if (!/^\S+@\S+\.\S+$/.test(formState.email)) {
			errors.email = "Please enter a valid email address";
		}

		return errors;
	};

	const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();

		setFormErrors({});
		const errors = validateForm();
		if (Object.keys(errors).length > 0) {
			setFormErrors(errors);
			return;
		}

		await emailSignIn.mutateAsync({
			body: {
				email: formState.email,
				redirectUrl: `${envClient.NEXT_PUBLIC_APP_URL}/organizations`,
			},
		});

		router.push("/auth/check-email");
	};

	return (
		<div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
			<div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
				<div className="absolute inset-0 bg-zinc-900" />
				<div className="relative z-20 flex items-center text-lg font-medium">
					<Icons.gitHub className="mr-2 h-6 w-6" />
					Hanalang Connect
				</div>
				<div className="relative z-20 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-lg">
							&ldquo;This library has saved me countless hours of work and
							helped me deliver accurate internationalizations to my clients
							faster than ever before.&rdquo;
						</p>
						<footer className="text-sm">Sofia Davis</footer>
					</blockquote>
				</div>
			</div>

			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<Card>
						<CardHeader className="space-y-1">
							<CardTitle className="text-2xl">
								Sign in to your account
							</CardTitle>
							<CardDescription>
								Enter your email to receive a magic link
							</CardDescription>
						</CardHeader>
						<form onSubmit={handleSignIn}>
							<CardContent className="grid gap-4">
								{formErrors.general && (
									<Alert variant="destructive">
										<AlertDescription>{formErrors.general}</AlertDescription>
									</Alert>
								)}

								<div className="grid gap-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										name="email"
										type="email"
										placeholder="name@example.com"
										value={formState.email}
										onChange={handleInputChange}
										className={formErrors.email ? "border-destructive" : ""}
										autoComplete="email"
										autoFocus
										required
									/>
									{formErrors.email && (
										<p className="text-xs text-destructive">
											{formErrors.email}
										</p>
									)}
								</div>

								<Button
									type="submit"
									className="w-full"
									disabled={emailSignIn.isPending}
								>
									{emailSignIn.isPending && (
										<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
									)}
									Sign in with Email
								</Button>
							</CardContent>
						</form>
					</Card>

					<p className="px-8 text-center text-sm text-muted-foreground">
						By clicking continue, you agree to our{" "}
						<Link
							href="/terms"
							className="underline underline-offset-4 hover:text-primary"
						>
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link
							href="/privacy"
							className="underline underline-offset-4 hover:text-primary"
						>
							Privacy Policy
						</Link>
						.
					</p>
				</div>
			</div>
		</div>
	);
}

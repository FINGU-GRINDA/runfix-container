"use client";
import { Icons } from "@/components/icons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ellysiaClient } from "@/services/ellysia";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

// Types for form state and validation
interface FormState {
	email: string;
	password: string;
	passwordConfirmation: string;
}

interface FormErrors {
	email?: string;
	password?: string;
	passwordConfirmation?: string;
	general?: string;
}

export default function Page() {
	const emailSignup = ellysiaClient.useMutation(
		"post",
		"/api/auth-accounts/create-with-email",
		{
			onSuccess: () => {
				toast.success(
					"Success! Please check your email to verify your account.",
				);
			},
			onError: () => {
				toast.error("Failed to sign up");
			},
		},
	);

	const [formState, setFormState] = useState<FormState>({
		email: "",
		password: "",
		passwordConfirmation: "",
	});
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

		if (!formState.password) {
			errors.password = "Password is required";
		} else if (formState.password.length < 8) {
			errors.password = "Password must be at least 8 characters";
		}

		if (!formState.passwordConfirmation) {
			errors.passwordConfirmation = "Please confirm your password";
		} else if (formState.password !== formState.passwordConfirmation) {
			errors.passwordConfirmation = "Passwords do not match";
		}

		return errors;
	};

	const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();

		setFormErrors({});
		const errors = validateForm();
		if (Object.keys(errors).length > 0) {
			setFormErrors(errors);
			return;
		}

		try {
			await emailSignup.mutateAsync({
				body: {
					firstName: formState.email.split("@")[0],
					lastName: formState.email.split("@")[0],
					emailAddress: formState.email,
					password: formState.password,
					confirmPassword: formState.password,
				},
			});
		} catch (error) {
			setFormErrors({
				general:
					error instanceof Error
						? error.message
						: "An unexpected error occurred",
			});
		}
	};

	return (
		<div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
			<div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
				<div className="absolute inset-0 bg-zinc-900" />
				<div className="relative z-20 flex items-center text-lg font-medium">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="mr-2 h-6 w-6"
						aria-hidden="true"
						role="img"
					>
						<title>Hanalang Connect Logo</title>
						<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
					</svg>
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
							<CardTitle className="text-2xl">Create an account</CardTitle>
							<CardDescription>
								Enter your email below to create your account
							</CardDescription>
						</CardHeader>
						<form onSubmit={handleSignup}>
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
									/>
									{formErrors.email && (
										<p className="text-xs text-destructive">
											{formErrors.email}
										</p>
									)}
								</div>

								<div className="grid gap-2">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										name="password"
										type="password"
										placeholder="••••••••"
										value={formState.password}
										onChange={handleInputChange}
										className={formErrors.password ? "border-destructive" : ""}
									/>
									{formErrors.password && (
										<p className="text-xs text-destructive">
											{formErrors.password}
										</p>
									)}
								</div>

								<div className="grid gap-2">
									<Label htmlFor="passwordConfirmation">Confirm Password</Label>
									<Input
										id="passwordConfirmation"
										name="passwordConfirmation"
										type="password"
										placeholder="••••••••"
										value={formState.passwordConfirmation}
										onChange={handleInputChange}
										className={
											formErrors.passwordConfirmation
												? "border-destructive"
												: ""
										}
									/>
									{formErrors.passwordConfirmation && (
										<p className="text-xs text-destructive">
											{formErrors.passwordConfirmation}
										</p>
									)}
								</div>

								<Button
									type="submit"
									className="w-full"
									disabled={emailSignup.isLoading}
								>
									{emailSignup.isLoading && (
										<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
									)}
									Create account
								</Button>
							</CardContent>
						</form>
						<CardFooter className="flex flex-col gap-4">
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground">
										Or continue with
									</span>
								</div>
							</div>
							<Button
								variant="outline"
								type="button"
								className="w-full"
								disabled
							>
								<Icons.gitHub className="mr-2 h-4 w-4" />
								GitHub
							</Button>
							<p className="text-center text-sm text-muted-foreground">
								Already have an account?{" "}
								<Link
									href="/auth/sign-in"
									className="underline underline-offset-4 hover:text-primary"
								>
									Sign in
								</Link>
							</p>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
}

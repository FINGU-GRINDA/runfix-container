import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function CheckEmailPage() {
	return (
		<div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
			{/* Left side with image/pattern - matching sign-up page */}
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

			{/* Right side with form */}
			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<Card>
						<CardHeader className="space-y-1">
							<CardTitle className="text-2xl">Check your email</CardTitle>
							<CardDescription>
								We&apos;ve sent a verification link to your email address.
								Please check your inbox and click the link to continue.
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4">
							<div className="flex justify-center py-8">
								<Icons.gitHub className="h-16 w-16 text-muted-foreground" />
							</div>
							<p className="text-center text-sm text-muted-foreground">
								Didn&apos;t receive an email?{" "}
								<Button variant="link" className="h-auto p-0" asChild>
									<Link href="/auth/sign-up">Resend verification email</Link>
								</Button>
							</p>
						</CardContent>
						<CardFooter className="flex flex-col space-y-4">
							<Button variant="outline" className="w-full" asChild>
								<Link href="/">Back to home</Link>
							</Button>
						</CardFooter>
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

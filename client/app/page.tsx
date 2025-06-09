"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	BarChartIcon,
	LightningBoltIcon,
	MagicWandIcon,
	PersonIcon,
	TableIcon,
	UpdateIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

export default function Page() {
	return (
		<div className="min-h-screen bg-background">
			{/* Navigation */}
			<nav className="container flex h-16 items-center justify-between px-4 md:px-6 z-10">
				<Link href="/" className="flex items-center space-x-2">
					<span className="text-xl font-bold">HanaLangConnect</span>
				</Link>
				<div className="flex items-center space-x-4">
					<Button variant="ghost" asChild>
						<Link href="/auth/sign-in">Sign In</Link>
					</Button>
					<Button asChild>
						<Link href="/auth/sign-up">Get Started</Link>
					</Button>
				</div>
			</nav>

			{/* Hero Section */}
			<header className="relative overflow-hidden z-10">
				<div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
					<div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 blur-[100px]" />
				</div>

				<div className="container flex min-h-[80vh] flex-col items-center justify-center px-4 pt-16 text-center sm:px-6 lg:px-8">
					<div className="mb-8 inline-flex items-center rounded-full border px-4 py-1 text-sm font-medium text-muted-foreground">
						<span className="relative flex h-2 w-2 mr-2">
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/75 opacity-75" />
							<span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
						</span>
						Now in public beta
					</div>

					<h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
						Connect Your App <span className="text-primary">to the World</span>
					</h1>

					<p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
						The complete i18n solution for modern web applications. Localize
						your app with powerful translation management and AI-assisted
						workflows.
					</p>

					<div className="mt-10 flex flex-col sm:flex-row gap-4">
						<Button size="lg" asChild>
							<Link href="/auth/sign-up">Get Started Free</Link>
						</Button>
						<Button variant="outline" size="lg" asChild>
							<Link href="#features">Learn more</Link>
						</Button>
					</div>
				</div>
			</header>
			{/* <GlobeWrapper /> */}

			{/* Features Section */}
			<section id="features" className="py-16 sm:py-24 bg-muted/20 z-20">
				<div className="container px-4 md:px-6">
					<div className="mx-auto max-w-3xl text-center">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl z-10">
							Powerful Features for Seamless Localization
						</h2>
						<p className="mt-4 text-lg text-muted-foreground z-20">
							Everything you need to manage translations and localize your
							application with ease.
						</p>
					</div>

					<div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0">
						{[
							{
								title: "AI-Powered Translations",
								description:
									"Get high-quality translations with our AI-powered engine that learns your terminology.",
								icon: <MagicWandIcon className="w-6 h-6" />,
								color: "text-purple-500",
							},
							{
								title: "Collaboration Tools",
								description:
									"Work with your team in real-time on translation projects with built-in review workflows.",
								icon: <PersonIcon className="w-6 h-6" />,
								color: "text-blue-500",
							},
							{
								title: "Version History",
								description:
									"Track changes and roll back to previous versions of your translations with ease.",
								icon: <UpdateIcon className="w-6 h-6" />,
								color: "text-green-500",
							},
							{
								title: "Efficient Workflow",
								description:
									"Manage all your translations in one place with our intuitive dashboard and API.",
								icon: <LightningBoltIcon className="w-6 h-6" />,
								color: "text-yellow-500",
							},
							{
								title: "Bulk Operations",
								description:
									"Import/export translations and make batch updates to save time on large projects.",
								icon: <TableIcon className="w-6 h-6" />,
								color: "text-pink-500",
							},
							{
								title: "Analytics Dashboard",
								description:
									"Gain insights into your translation process with detailed analytics and reports.",
								icon: <BarChartIcon className="w-6 h-6" />,
								color: "text-indigo-500",
							},
						].map((feature, index) => (
							<Card
								key={index.toString()}
								className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 bg-card/50 backdrop-blur-sm relative overflow-hidden"
							>
								<div
									className={`absolute -right-10 -top-10 h-40 w-40 rounded-full ${feature.color.replace("text-", "bg-")} opacity-10`}
								/>
								<CardHeader>
									<div
										className={`flex items-center justify-center h-12 w-12 rounded-full mb-4 ${feature.color} bg-opacity-10`}
									>
										{feature.icon}
									</div>
									<CardTitle className="text-left">{feature.title}</CardTitle>
								</CardHeader>
								<CardContent className="text-left text-muted-foreground">
									{feature.description}
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="relative py-24 sm:py-32 overflow-hidden">
				<div className="absolute inset-0 -z-10">
					<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
					<div className="absolute inset-0 bg-grid-slate-100/20 [mask-image:linear-gradient(0deg,transparent,white)] dark:bg-grid-slate-700/20 dark:[mask-image:linear-gradient(0deg,transparent,black)]" />
				</div>

				<div className="container px-4 md:px-6 text-center relative z-10">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
						Ready to Localize Your Application?
					</h2>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10">
						Join thousands of developers who trust HanaLangConnect for their
						i18n needs. Get started for free today.
					</p>
					<div className="flex flex-col sm:flex-row justify-center gap-4">
						<Button
							size="lg"
							asChild
							className="px-8 py-6 text-lg bg-primary hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl hover:shadow-primary/20"
						>
							<Link href="/auth/sign-up">Get Started Free</Link>
						</Button>
						<Button
							variant="outline"
							size="lg"
							asChild
							className="px-8 py-6 text-lg border-2 hover:bg-accent/50 hover:border-primary/50 transition-colors"
						>
							<Link href="#features">Learn More</Link>
						</Button>
					</div>
					<p className="mt-6 text-sm text-muted-foreground">
						No credit card required. 14-day free trial.
					</p>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t bg-background/80 backdrop-blur-sm pt-16 pb-8 relative overflow-hidden">
				{/* Background elements */}
				<div className="absolute inset-0 bg-gradient-to-b from-background/95 to-background/80 -z-10" />
				<div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] -z-20 opacity-10" />

				<div className="container px-4 md:px-6">
					<div className="grid grid-cols-1 md:grid-cols-12 gap-12">
						{/* Brand column */}
						<div className="md:col-span-4">
							<div className="flex items-center space-x-2 mb-4">
								<span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
									HanaLangConnect
								</span>
							</div>
							<p className="text-muted-foreground mb-6 max-w-sm">
								The complete i18n solution for modern web applications. Localize
								with confidence.
							</p>
							<div className="flex space-x-4">
								{["github", "twitter", "linkedin"].map((social) => (
									<a
										key={social}
										href={`https://github.com/${social}`}
										className="text-muted-foreground hover:text-foreground transition-colors"
										aria-label={`${social} link`}
									>
										<span className="sr-only">{social}</span>
										<div className="h-5 w-5">
											{social === "github"
												? "🐙"
												: social === "twitter"
													? "🐦"
													: "🔗"}
										</div>
									</a>
								))}
							</div>
						</div>

						{/* Links columns */}
						<div className="md:col-span-2">
							<h4 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">
								Product
							</h4>
							<ul className="space-y-3">
								{[
									{ name: "Features", href: "#features" },
									{ name: "Pricing", href: "#" },
									{ name: "Documentation", href: "#" },
									{ name: "Changelog", href: "#" },
								].map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											className="text-muted-foreground hover:text-foreground transition-colors text-sm hover:underline underline-offset-4"
										>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</div>

						<div className="md:col-span-2">
							<h4 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">
								Company
							</h4>
							<ul className="space-y-3">
								{[
									{ name: "About", href: "#" },
									{ name: "Blog", href: "#" },
									{ name: "Careers", href: "#" },
									{ name: "Contact", href: "#" },
								].map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											className="text-muted-foreground hover:text-foreground transition-colors text-sm hover:underline underline-offset-4"
										>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</div>

						<div className="md:col-span-2">
							<h4 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">
								Legal
							</h4>
							<ul className="space-y-3">
								{[
									{ name: "Privacy", href: "#" },
									{ name: "Terms", href: "#" },
									{ name: "Security", href: "#" },
								].map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											className="text-muted-foreground hover:text-foreground transition-colors text-sm hover:underline underline-offset-4"
										>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</div>

						<div className="md:col-span-2">
							<h4 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">
								Resources
							</h4>
							<ul className="space-y-3">
								{[
									{ name: "Help Center", href: "#" },
									{ name: "API Status", href: "#" },
									{ name: "Guides", href: "#" },
									{ name: "Community", href: "#" },
								].map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											className="text-muted-foreground hover:text-foreground transition-colors text-sm hover:underline underline-offset-4"
										>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>

					<div className="mt-16 pt-8 border-t border-border/50">
						<div className="flex flex-col md:flex-row justify-between items-center">
							<p className="text-sm text-muted-foreground text-center md:text-left">
								&copy; {new Date().getFullYear()} HanaLangConnect. All rights
								reserved.
							</p>
							<div className="mt-4 md:mt-0 flex space-x-6">
								<Link
									href="#"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Privacy Policy
								</Link>
								<Link
									href="#"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Terms of Service
								</Link>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}

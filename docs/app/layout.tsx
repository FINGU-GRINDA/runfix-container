import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import * as React from "react";
import Translator from "../components/translator-layout";
import { CookiesProvider } from "next-client-cookies/server";

export const metadata = {
	// Define your metadata here
	// For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
};

const banner = (
	<Banner storageKey="some-key">Hana Translate is released 🎉</Banner>
);
const navbar = (
	<Navbar
		logo={<b>Hana Translate</b>}
		// ... Your additional navbar options
	/>
);
const footer = (
	<Footer>MIT {new Date().getFullYear()} © Hana Translate.</Footer>
);

export default async function RootLayout({ children }) {
	return (
		<html
			// Not required, but good for SEO
			lang="en"
			// Required to be set
			dir="ltr"
			// Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
			suppressHydrationWarning
		>
			<Head
			// ... Your additional head options
			>
				{/* Your additional tags should be passed as `children` of `<Head>` element */}
			</Head>
			<body>
				<CookiesProvider>
					{/* <Translator> */}
						<Layout
							banner={banner}
							navbar={navbar}
							pageMap={await getPageMap()}
							docsRepositoryBase="https://github.com/FINGU-GRINDA/runfix-container/tree/main/docs"
							feedback={{
								content:
									"https://github.com/FINGU-GRINDA/runfix-container/issues",
								labels: "bug",
							}}
							footer={footer}
							// ... Your additional layout options
						>
							{children}
						</Layout>
					{/* </Translator> */}
				</CookiesProvider>
			</body>
		</html>
	);
}

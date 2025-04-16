import { Html, Head, Main, NextScript } from "next/document";
import { WebVitals } from "@/lib/axiom/client";
import { ThemeProvider } from "@/components/theme-provider";
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <WebVitals />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </ThemeProvider>
    </Html>
  );
}

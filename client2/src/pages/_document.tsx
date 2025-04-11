import { Html, Head, Main, NextScript } from "next/document";
import { WebVitals } from "@/lib/axiom/client";
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <WebVitals />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

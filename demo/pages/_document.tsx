import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko" translate="no">
      <Head></Head>
      {/* for vanilla html / js */}
      {/* <script async type="module" src="./runfix.js" /> */}
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

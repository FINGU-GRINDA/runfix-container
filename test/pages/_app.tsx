import type { AppProps } from "next/app";
import { trpc } from "../utils/trpc";
import { Layout } from "../components/layout";
import { NuqsAdapter } from "nuqs/adapters/next/pages";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NuqsAdapter>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </NuqsAdapter>
  );
}

export default trpc.withTRPC(MyApp);

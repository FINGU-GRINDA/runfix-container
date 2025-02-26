import type { AppProps } from "next/app";
import { trpc } from "../utils/trpc";
import { Layout } from "../components/layout";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default trpc.withTRPC(MyApp);

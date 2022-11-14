import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { AuthenticationProvider } from "../providers/AuthenticationProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthenticationProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthenticationProvider>
  );
}

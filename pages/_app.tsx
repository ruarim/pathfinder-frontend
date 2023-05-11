import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { AuthenticationProvider } from "../providers/AuthenticationProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  //prevent mobile browser zooming on inputs
  useEffect(() => {
    document.addEventListener(
      "touchstart",
      (e: TouchEvent) => {
        const target = e.target as Element;
        if (target?.nodeName === "INPUT") {
          e.preventDefault();
        }
      },
      false
    );
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthenticationProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthenticationProvider>
    </QueryClientProvider>
  );
}

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { CivicAuthProvider } from "@civic/auth/react";

import { getConfig } from "./config";

type Props = {
    children: ReactNode;
    initialState: State | undefined;
};

export function Providers({ children, initialState }: Props) {
    const [config] = useState(() => getConfig());
    const [queryClient] = useState(() => new QueryClient());

    return (
        <CivicAuthProvider
            clientId={process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID!}
            onSignIn={(error?: Error) => {
                if (error) {
                    console.log(error);
                }
                else {
                    window.location.href = '/starting';
                }
            }}
            onSignOut={() => window.location.replace('/')}
        >
            <WagmiProvider config={config} initialState={initialState}>
                <QueryClientProvider client={queryClient}>
                    <RainbowKitProvider
                        modalSize="compact"
                        theme={darkTheme({
                            accentColor: "#50C878",
                            accentColorForeground: "white",
                            borderRadius: "small",
                            fontStack: "system",
                            overlayBlur: "small",
                        })}
                        initialChain={11155111}
                    >
                        {children}
                    </RainbowKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </CivicAuthProvider>
    );
}
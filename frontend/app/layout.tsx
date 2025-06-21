import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ppEditorialNewUltralightItalic, inter } from "./fonts"
import type React from "react"
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "./config";
import { Providers } from "./providers";
import Navbar from "@/components/NavBar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Supernote",
    description: "The ideating platform for the future",
    icons: {
        icon: '/favicon.ico', // or .png/.svg if you're using that
    },
};

export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const initialState = cookieToInitialState(getConfig(), (await headers()).get("cookie"));
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} ${ppEditorialNewUltralightItalic.variable} ${inter.variable} antialiased`}>
                <Providers initialState={initialState}>
                    <Navbar />
                    {children}
                </Providers>
            </body>
        </html>
    );
}

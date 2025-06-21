"use client"

import { HeroWithMockup } from "@/components/hero-with-mockup"
import { Features } from "@/components/features"
import { Brain, BrainCog } from "lucide-react";
import { SparklesText } from "@/components/ui/sparkles-text";
import { Pricing } from "@/components/pricing";
import { MarqueeAnimation } from "@/components/ui/marquee-effect";
import { BackgroundLines } from "@/components/ui/background-lines";

import React, { useState, useEffect, ChangeEvent } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';


const demoPlans = [
    {
        name: "STARTER",
        price: "0",
        yearlyPrice: "0",
        period: "",
        features: [
            "Limited nodes",
            "Basic analytics",
            "48-hour support response time",
            "50 monthly credits",
            "Limited API access",
            "Stealth pitch cap ",
        ],
        description: "Perfect for individuals and small projects",
        buttonText: "Start Free Trial",
        href: "/starting",
        isPopular: false,
    },
    {
        name: "PROFESSIONAL",
        price: "10",
        yearlyPrice: "89",
        period: "per month",
        features: [
            "Unlimited projects",
            "Advanced analytics",
            "Versioning + branching",
            "500 monthly credits",
            "Full API access",
            "Priority support",
            "Team collaboration",
        ],
        description: "Ideal for growing teams and businesses",
        buttonText: "Get Started",
        href: "/sign-up",
        isPopular: true,
    },
    {
        name: "ENTERPRISE",
        price: "20",
        yearlyPrice: "110",
        period: "per month",
        features: [
            "Everything in Professional",
            "Custom solutions",
            "Dedicated account manager",
            "1-hour support response time",
            "Pay as you go",
            "SSO Authentication",
            "Advanced security",
            "Custom contracts",
            "SLA agreement",
        ],
        description: "For large organizations with specific needs",
        buttonText: "Contact Sales",
        href: "/contact",
        isPopular: false,
    },
];

const features = [
    {
        id: 1,
        icon: BrainCog,
        title: "Before you build it, make sure it is worth building.",
        description:
            "A visual, feedback-first ideation tool that saves you from launching bad ideas in public.",
        image: "/hero.jpg",
    },
    {
        id: 2,
        icon: BrainCog,
        title: "Test your idea without giving away your secret sauce",
        description:
            "Stealth pitch parts of your idea, get smart feedback, and grow it without getting cloned.",
        image: "/hero.jpg",
    },
    {
        id: 3,
        icon: Brain,
        title: "Where ideas grow up — and get backed",
        description:
            "Visual ideation, flaw-finding AI, stealth pitching, and community funding. All in one space",
        image: "/hero.jpg",
    },
];

interface User {
    name?: string;
    walletAddress?: string;
}

interface ApiResponse {
    isLoggedIn: boolean;
    user?: User;
    message?: string;
    [key: string]: any;
}

const API_BASE_URL = 'http://localhost:5000';

// Create an Axios instance. `withCredentials: true` is ESSENTIAL for session cookies.
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export default function Home() {
    // const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const checkLoggedin = async () => {
        // setIsLoading(true);
        try {
            const response = await apiClient.get<ApiResponse>('/auth/status');
            if (response?.data?.isLoggedIn) {
                router.push('starting');
            }
            // setIsLoading(false);
            console.log(response);
        }
        catch (error: any) {
            const errorData = error.response ? error.response.data : { message: error.message };
            console.log(JSON.stringify(errorData, null, 2));
            // setIsLoading(false);
        }
    }

    useEffect(() => {
        checkLoggedin();
    }, []);
    return (
        <div>
            <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
                <HeroWithMockup
                    title="From Shower Thought to Funded Project."
                    description="Map your thoughts, stress-test them with AI, and pitch safely — all before writing a single line of code."
                    primaryCta={{
                        text: "Start Ideating",
                        href: `${API_BASE_URL}/auth/login`,
                    }}
                    secondaryCta={{
                        text: "View us on GitHub",
                        href: "https://github.com/arkoroy05/supernote",
                    }}
                    mockupImage={{
                        alt: "AI Platform Dashboard",
                        width: 1248,
                        height: 765,
                        src: "/hero.jpg"
                    }}
                />
            </BackgroundLines>
            <div className="flex flex-col gap-4">
                <MarqueeAnimation
                    direction="left"
                    baseVelocity={-1}
                    className="bg-green-500 text-white py-2"
                >
                    TEAM SUPERNOTE
                </MarqueeAnimation>
                <MarqueeAnimation
                    direction="right"
                    baseVelocity={-1}
                    className="bg-purple-500 text-white py-2"
                >
                    TEAM SUPERNOTE
                </MarqueeAnimation>
            </div>
            <Features
                progressGradientLight="bg-gradient-to-r from-sky-400 to-sky-500"
                progressGradientDark="bg-gradient-to-r from-sky-300 to-sky-400"
                features={features} />
            <div className="flex justify-center items-center min-h-[50vh]">
                <SparklesText text="Supernote" className="md:text-9xl text-5xl" />
            </div>
            <div className="flex justify-center items-center min-h-[50vh]">
                <Pricing plans={demoPlans}
                    title="Simple, Transparent Pricing"
                    description="Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support." />
            </div>
        </div>
    )
}



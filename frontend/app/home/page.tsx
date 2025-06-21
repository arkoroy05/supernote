"use client"

import { HeroWithMockup } from "@/components/hero-with-mockup"
import { Features } from "@/components/features"
import { Brain, BrainCog } from "lucide-react";
import { SparklesText } from "@/components/ui/sparkles-text";
import { Pricing } from "@/components/pricing";

const demoPlans = [
    {
      name: "STARTER",
      price: "50",
      yearlyPrice: "40",
      period: "per month",
      features: [
        "Up to 10 projects",
        "Basic analytics",
        "48-hour support response time",
        "Limited API access",
        "Community support",
      ],
      description: "Perfect for individuals and small projects",
      buttonText: "Start Free Trial",
      href: "/sign-up",
      isPopular: false,
    },
    {
      name: "PROFESSIONAL",
      price: "99",
      yearlyPrice: "79",
      period: "per month",
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "24-hour support response time",
        "Full API access",
        "Priority support",
        "Team collaboration",
        "Custom integrations",
      ],
      description: "Ideal for growing teams and businesses",
      buttonText: "Get Started",
      href: "/sign-up",
      isPopular: true,
    },
    {
      name: "ENTERPRISE",
      price: "299",
      yearlyPrice: "239",
      period: "per month",
      features: [
        "Everything in Professional",
        "Custom solutions",
        "Dedicated account manager",
        "1-hour support response time",
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

const features= [
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

export default function Home() {
  return (
    <div>
    <HeroWithMockup
    title="Notion lets you write. We help you not mess up."
    description="Map your thoughts, stress-test them with AI, and pitch safely — all before writing a single line of code."
    primaryCta={{
      text: "Start Ideating",
      href: "/",
    }}
    secondaryCta={{
      text: "View us on GitHub",
      href: "https://github.com/your-ai-platform",
    }}
    mockupImage={{
      alt: "AI Platform Dashboard",
      width: 1248,
      height: 765,
      src: "/hero.jpg"
    }}
  />
  <Features 
  primaryColor="sky-500"
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



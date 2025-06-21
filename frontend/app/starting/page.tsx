"use client"

import React, { useState } from 'react';
import { Paperclip, Send, LogOut, User, LoaderCircle } from 'lucide-react';
import { Typewriter } from '@/components/ui/typewriter';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

// Aurora Background Component
const AuroraBackground = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={`relative min-h-screen overflow-hidden ${className}`}>
            {/* Aurora Effect */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Main Aurora Layer */}
                <div
                    className="absolute -inset-[10px] opacity-60 blur-[1px] animate-pulse"
                    style={{
                        background: 'repeating-linear-gradient(100deg, #3b82f6 0%, #1d4ed8 10%, #2563eb 20%, #60a5fa 30%, #1e40af 40%, #3b82f6 50%)',
                        backgroundSize: '300% 300%',
                        animation: 'aurora 8s ease-in-out infinite',
                    }}
                />
                {/* Secondary Aurora Layer */}
                <div
                    className="absolute -inset-[5px] opacity-40 blur-[2px]"
                    style={{
                        background: 'repeating-linear-gradient(80deg, #60a5fa 0%, #3b82f6 15%, #1d4ed8 30%, #2563eb 45%, #60a5fa 60%)',
                        backgroundSize: '200% 200%',
                        animation: 'aurora-reverse 12s ease-in-out infinite',
                    }}
                />
                {/* Overlay gradient to blend */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/40 to-white/60" />
            </div>

            {/* CSS Animation */}
            <style jsx>{`
        @keyframes aurora {
          0%, 100% {
            background-position: 0% 50%;
            transform: rotate(0deg);
          }
          25% {
            background-position: 100% 0%;
            transform: rotate(1deg);
          }
          50% {
            background-position: 100% 100%;
            transform: rotate(0deg);
          }
          75% {
            background-position: 0% 100%;
            transform: rotate(-1deg);
          }
        }
        
        @keyframes aurora-reverse {
          0%, 100% {
            background-position: 100% 0%;
            transform: rotate(0deg) scale(1.1);
          }
          50% {
            background-position: 0% 100%;
            transform: rotate(2deg) scale(1.05);
          }
        }
      `}</style>

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default function Starting() {
    const [ideaText, setIdeaText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    // Mock user name - in a real app, this would come from authentication
    const userName = "User"; 
    // Mock user avatar - in a real app, this would come from user profile
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const handleLogout = () => {
        // Handle logout logic here
        console.log("Logging out...");
        // Redirect to login page or home
        router.push('/');
    };

    const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Create a URL for the uploaded image
            const imageUrl = URL.createObjectURL(file);
            setAvatarUrl(imageUrl);
            
            // In a real application, you would upload this to your server
            console.log("Avatar uploaded:", file.name);
            // Example upload logic:
            // const formData = new FormData();
            // formData.append('avatar', file);
            // axios.post('/api/user/avatar', formData);
        }
    };

    const handleSubmit = async () => {
        if (!ideaText.trim()) return;

        setIsLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/idea/analyze`, { idea: ideaText }, { withCredentials: true });
            if (response?.data) {
                localStorage.setItem('ideaAnalysisData', JSON.stringify(response.data));
            }
            setIsLoading(false);

            router.push('/variations');
        }
        catch (error: unknown) {
            const errorData = error instanceof Error 
                ? { message: error.message }
                : axios.isAxiosError(error) && error.response 
                    ? error.response.data 
                    : { message: 'An unknown error occurred' };
            console.log(JSON.stringify(errorData, null, 2));
            setIsLoading(false);
        }
    };

    return (
        <AuroraBackground className="bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
            {/* Header */}
            <header className="flex justify-between items-center px-6 py-6 backdrop-blur-sm bg-transparent">
                <div
                    onClick={() => window.location.href = '/'}
                    className="flex items-center text-2xl font-bold text-gray-900 cursor-pointer select-none"
                >
                    <img src="/favicon.ico" alt="Logo" className="w-8 h-8 mr-2 mt-1" />
                    Supernote
                </div>

                <nav className="flex items-center space-x-4">
                    <Button 
                        variant="ghost" 
                        className="font-medium"
                        onClick={() => router.push('/projects')}
                    >
                        Projects
                    </Button>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="font-medium flex items-center gap-2 pl-3 pr-4 bg-transparent border-transparent">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={avatarUrl || ""} alt={userName} />
                                    <AvatarFallback className="bg-blue-400 text-blue-800">
                                        {userName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span>{userName}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                                <label className="cursor-pointer flex items-center w-full">
                                    <User className="h-4 w-4 mr-2" />
                                    <span>Change Avatar</span>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={handleAvatarUpload}
                                    />
                                </label>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                className="cursor-pointer flex items-center text-red-600"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex flex-col items-center justify-center px-6 py-20">
                <div className="max-w-4xl text-center">
                    <h1 className="text-6xl md:text-6xl font-bold mb-8 leading-tight text-gray-900">
                        <span>{"What do you want to "}</span>

                        <div className="inline-block min-h-[1.5em] min-w-[6ch]">
                            <Typewriter
                                text={[
                                    "ideate?",
                                    "build?",
                                    "create?",
                                    "learn?",
                                ]}
                                speed={70}
                                className="text-blue-500"
                                waitTime={1500}
                                deleteSpeed={40}
                                cursorChar={"_"}
                            />
                        </div>
                    </h1>
                    <p className="text-2xl text-gray-700 mb-16 font-light leading-relaxed">
                        Turn ideas into real startups — one smart node at a time.
                    </p>

                    {/* Input Section */}
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative group">
                            <textarea
                                placeholder="How can Supernote help you today?"
                                className="w-full bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl px-6 py-6 pr-16 text-gray-900 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xl shadow-gray-100/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-gray-200/50"
                                rows={4}
                                value={ideaText}
                                onChange={(e) => setIdeaText(e.target.value)}
                            />
                            <div className="absolute bottom-6 right-6 flex items-center space-x-3">
                                <button className="text-gray-600 hover:text-gray-800 transition-colors p-1 hover:bg-gray-100 rounded-lg">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading || !ideaText.trim()}
                                    className={`bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg ${isLoading || !ideaText.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading ? (
                                        <LoaderCircle className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </AuroraBackground>
    );
}
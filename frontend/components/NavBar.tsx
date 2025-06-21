"use client";

import React from 'react';
import { LogOut } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@civic/auth/react';
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

interface NavbarProps {
    className?: string;
}

export default function Navbar({ className = "" }: NavbarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, signOut } = useUser();

    // Define routes that should not show navbar
    const hideNavbarRoutes = ['/', '/variations'];
    
    // If current route should not show navbar, return null
    if (hideNavbarRoutes.includes(pathname)) {
        return null;
    }
    
    // Determine first button destination based on current route
    const getFirstButtonDestination = () => {
        switch (pathname) {
            case '/projects':
                return '/starting';
            case '/graph':
                return '/projects';
            case '/synthesize':
                return '/graph';
            case '/feed2':
                return '/projects';
            default:
                return '/projects';
        }
    };
    
    // Get the first button label text based on destination
    const getFirstButtonLabel = () => {
        const destination = getFirstButtonDestination();
        return destination.charAt(1).toUpperCase() + destination.slice(2);
    };
    
    const firstButtonDestination = getFirstButtonDestination();
    const firstButtonLabel = getFirstButtonLabel();

    return (
        <header className={`flex justify-between items-center px-6 py-3 backdrop-blur-sm bg-transparent ${className}`}>
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
                    onClick={() => router.push(firstButtonDestination)}
                >
                    {firstButtonLabel}
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="font-medium flex items-center gap-2 pl-3 pr-4 bg-transparent border-transparent">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.picture || ""} alt={user?.name} />
                                <AvatarFallback className="bg-blue-400 text-blue-800">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span>{user?.name}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer flex items-center text-red-600"
                            onClick={signOut}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>
        </header>
    );
}
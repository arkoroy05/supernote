'use client';

import { CivicAuthProvider, UserButton } from "@civic/auth/react";
import { useState } from "react";

// // This is a mock fetch function. In a real application, you would
// // replace this with an actual API call to your backend.
// const mockApi = {
//     fetchAuthenticatedData: (token: any) => new Promise((resolve, reject) => {
//         setTimeout(() => {
//             // We'll simulate a token check.
//             if (token) {
//                 resolve(`Authenticated data fetched at ${new Date().toLocaleTimeString()}`);
//             } else {
//                 reject('Authentication token not found.');
//             }
//         }, 1000);
//     }),
//     fetchUnauthenticatedData: () => new Promise((resolve) => {
//         setTimeout(() => {
//             resolve(`Public data fetched at ${new Date().toLocaleTimeString()}`);
//         }, 1000);
//     }),
// };


export default function App() {
    const [authenticatedData, setAuthenticatedData] = useState('Click the button to fetch authenticated data');
    const [unauthenticatedData, setUnauthenticatedData] = useState('Click the button to fetch public data');
    const [isAuthLoading, setIsAuthLoading] = useState(false);
    const [isPublicLoading, setIsPublicLoading] = useState(false);

    // Note: In a real app, the Civic token would be retrieved from the auth context.
    // This is a placeholder for the logic.
    const handleFetchAuthenticated = async () => {
        setIsAuthLoading(true);
        try {
            // In a real app, you would get the token from the Civic context after login.
            // For this mock, we'll pretend a token exists.
            // const token = 'mock-civic-auth-token';
            const response = await fetch('http://localhost:5000/api/auth/securedata', { credentials: 'include' });
            console.log(response);
            if (!response.ok) {
                // If status is 401, it means the user is not logged in on the backend
                if (response.status === 401) {
                    throw new Error('Unauthorized: Please log in to fetch this data.');
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setAuthenticatedData(JSON.stringify(result, null, 2));
        } catch (error) {
            setAuthenticatedData(JSON.stringify(error, null, 2));
        } finally {
            setIsAuthLoading(false);
        }
    };

    const handleFetchUnauthenticated = async () => {
        setIsPublicLoading(true);
        const response = await fetch('http://localhost:5000/api/auth/freedata');
        if (!response.ok) {
            // If status is 401, it means the user is not logged in on the backend
            if (response.status === 401) {
                throw new Error('Unauthorized: Please log in to fetch this data.');
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setUnauthenticatedData(JSON.stringify(result, null, 2));
        setIsPublicLoading(false);
    };

    return (
        <CivicAuthProvider clientId="52640e02-971d-40ca-a6fc-96db759116a8">
            {/* We are injecting a style tag here to define the custom animations for the background */}
            <style>
                {`
          @keyframes float1 {
            0% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-50px) translateX(30px); }
            100% { transform: translateY(0px) translateX(0px); }
          }
          @keyframes float2 {
            0% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(60px) translateX(-40px); }
            100% { transform: translateY(0px) translateX(0px); }
          }
          @keyframes float3 {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            50% { transform: translate(-30%, -70%) rotate(30deg); }
            100% { transform: translate(-50%, -50%) rotate(0deg); }
          }

          .animate-float1 { animation: float1 4s ease-in-out infinite; }
          .animate-float2 { animation: float2 6s ease-in-out infinite; }
          .animate-float3 { animation: float3 8s ease-in-out infinite; }
        `}
            </style>
            <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
                {/* Blurred Mesh Gradients with moving animations */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500 rounded-full blur-3xl opacity-20 animate-float1"></div>
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500 rounded-full blur-2xl opacity-20 animate-float2"></div>
                <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-pink-500 rounded-full blur-[150px] opacity-10 animate-float3"></div>

                <div className="relative flex flex-col items-center justify-center min-h-screen px-4 z-10 py-10">
                    {/* Auth UI Card */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl text-center space-y-6">
                        <div className="flex justify-center pb-10">
                            <UserButton />
                        </div>

                        {/* Authenticated Data Section */}
                        <div className="space-y-3">
                            <div className="bg-black/20 p-4 rounded-lg text-white text-sm font-mono h-16 flex items-center justify-center break-all">
                                {isAuthLoading ? 'Fetching...' : authenticatedData}
                            </div>
                            <button
                                onClick={handleFetchAuthenticated}
                                disabled={isAuthLoading}
                                className="bg-white/10 border border-white/20 hover:bg-white/20 transition-colors rounded-full px-5 py-2 text-sm font-medium text-white backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed w-full"
                            >
                                Fetch Authenticated Data
                            </button>
                        </div>

                        {/* Separator */}
                        <div className="border-t border-white/20"></div>

                        {/* Unauthenticated Data Section */}
                        <div className="space-y-3">
                            <div className="bg-black/20 p-4 rounded-lg text-white text-sm font-mono h-16 flex items-center justify-center break-all">
                                {isPublicLoading ? 'Fetching...' : unauthenticatedData}
                            </div>
                            <button
                                onClick={handleFetchUnauthenticated}
                                disabled={isPublicLoading}
                                className="bg-white/10 border border-white/20 hover:bg-white/20 transition-colors rounded-full px-5 py-2 text-sm font-medium text-white backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed w-full"
                            >
                                Fetch Unauthenticated Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </CivicAuthProvider>
    );
}
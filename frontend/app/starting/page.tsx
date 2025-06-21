"use client"

import React from 'react';
import { Paperclip, Send } from 'lucide-react';

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

        <nav className="flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
            Community
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
            Pricing
            </a>
        </nav>
        </header>

        {/* Main Content */}
        <main className="flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-4xl text-center">
            <h1 className="text-6xl md:text-6xl font-bold mb-8 leading-tight text-gray-900">
            What do you want to build?
            </h1>
            <p className="text-2xl text-gray-700 mb-16 font-light leading-relaxed">
            Turn raw ideas into real startups — one smart node at a time.
            </p>

            {/* Input Section */}
            <div className="max-w-2xl mx-auto mb-8">
            <div className="relative group">
                <textarea
                placeholder="How can Supernote help you today?"
                className="w-full bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl px-6 py-6 pr-16 text-gray-900 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xl shadow-gray-100/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-gray-200/50"
                rows={4}
                />
                <div className="absolute bottom-6 right-6 flex items-center space-x-3">
                <button className="text-gray-600 hover:text-gray-800 transition-colors p-1 hover:bg-gray-100 rounded-lg">
                    <Paperclip className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => window.location.href = '/graph'} 
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                >
                    <Send className="w-5 h-5" />
                </button>
                </div>
            </div>
            </div>
        </div>
        </main>
    </AuroraBackground>
    );
}
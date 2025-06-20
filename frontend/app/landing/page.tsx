import React from 'react';
import { ChevronRight, Paperclip, Plus, Github } from 'lucide-react';

export default function BoltLandingPage() {
    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4">
        <div className="text-2xl font-bold">
            App.
        </div>
        <nav className="flex items-center space-x-8">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
            Community
            </a>
            <div className="relative">
            <button className="text-gray-300 hover:text-white transition-colors flex items-center">
                Resources
                <ChevronRight className="ml-1 w-4 h-4 rotate-90" />
            </button>
            </div>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
            Pricing
            </a>
        </nav>
        </header>

        {/* Main Content */}
        <main className="flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-4xl text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            What do you want to build?
            </h1>
            <p className="text-xl text-gray-300 mb-12">
            Create stunning apps & websites by chatting with AI.
            </p>

            {/* Input Section */}
            <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
                <textarea
                placeholder="How can Bolt help you today?"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-4 pr-12 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                />
                <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                <button className="text-gray-400 hover:text-white transition-colors">
                    <Paperclip className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                    <Plus className="w-5 h-5" />
                </button>
                </div>
            </div>
            </div>

            {/* Import Section */}
            <div className="mb-8">
            <p className="text-gray-400 mb-4">or import from</p>
            <div className="flex justify-center space-x-4">
                <button className="flex items-center space-x-2 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 hover:bg-slate-700/50 transition-colors">
                <div className="w-5 h-5 bg-purple-500 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-white">F</span>
                </div>
                <span>Figma</span>
                </button>
                <button className="flex items-center space-x-2 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 hover:bg-slate-700/50 transition-colors">
                <Github className="w-5 h-5" />
                <span>GitHub</span>
                </button>
            </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-3">
            <button className="bg-slate-800/50 border border-slate-700 rounded-full px-4 py-2 hover:bg-slate-700/50 transition-colors text-sm">
                Build a mobile app
            </button>
            <button className="bg-slate-800/50 border border-slate-700 rounded-full px-4 py-2 hover:bg-slate-700/50 transition-colors text-sm">
                Start a blog
            </button>
            <button className="bg-slate-800/50 border border-slate-700 rounded-full px-4 py-2 hover:bg-slate-700/50 transition-colors text-sm">
                Create a docs site
            </button>
            <button className="bg-slate-800/50 border border-slate-700 rounded-full px-4 py-2 hover:bg-slate-700/50 transition-colors text-sm">
                Make a dashboard with charts
            </button>
            </div>
        </div>
        </main>
    </div>
    );
}
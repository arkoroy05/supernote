"use client"

import React, { useState, useEffect } from 'react';
import { ArrowRight, Lightbulb, Target, TrendingUp } from 'lucide-react'
import axios from 'axios';

interface AnalysisData {
    analysis: string;
    variations: string[];
}

// Simple markdown to HTML converter for basic formatting
const markdownToHtml = (markdown: string): string => {
    return markdown
        // Headers
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-black mt-6 mb-3">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-black mt-8 mb-4">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-black mt-8 mb-4">$1</h1>')
        // Bold text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-black">$1</strong>')
        // Italic text
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        // Line breaks
        .replace(/\n\n/g, '</p><p class="text-black leading-relaxed mb-4 text-lg">')
        // Bullet points
        .replace(/^- (.*$)/gim, '<li class="ml-4 mb-2">$1</li>')
        // Wrap consecutive list items in ul tags
        .replace(/(<li.*<\/li>\s*)+/g, '<ul class="list-disc list-inside mb-4 text-black">$&</ul>');
};

const IdeaAnalysisPage: React.FC = () => {
    const [data, setData] = useState<AnalysisData | null>(null);
    const [, setLoading] = useState<boolean>(false);

    useEffect(() => {
        // Get data from localStorage when component mounts
        const storedData = localStorage.getItem('ideaAnalysisData');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                console.log(parsedData);
                setData(parsedData);
            } catch (error) {
                console.error("Error parsing data from localStorage:", error);
            }
        }
    }, []);

    const handleVariationClick = async (index: number) => {
        const variation = data?.variations?.[index];

        if (!variation) return;

        console.log('Selected variation:', variation);

        const colonIndex = variation.indexOf(':');
        const title = colonIndex !== -1 ? variation.substring(0, colonIndex).trim() : `Variation ${index + 1}`;
        const description = colonIndex !== -1 ? variation.substring(colonIndex + 1).trim() : variation;

        const project = {
            name: title,
            nodes: [{
                id: 'node_1',
                title: 'Strategic Analysis',
                data: { label: data.analysis, prompt: 'analysis' },
                position: { x: 0, y: 0 },
            }, {
                id: 'node_2',
                title: title,
                data: { label: description, prompt: `variation ${index + 1}` },
                position: { x: 100, y: 100 },
            },],
            edges: [{
                id: 'edge_1_2',
                source: 'node_1',
                target: 'node_2',
            }],
            // categorization: {
            //     type: '',
            //     market: '',
            //     target: '',
            //     main_competitors: '',
            //     trendAnalysis: '',
            // },
            // projectRating: {
            //     opportunity: 0,
            //     problem: 0,
            //     feasibility: 0,
            //     why_now: 0,
            //     feedback: '',
            // },
        };

        console.log('Project:', project);
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/project`, project, { withCredentials: true });
            if (response?.data) {
                window.location.href = `/graph/${response.data._id}`;
                console.log('Response:', response.data);
            }
            setLoading(false);
        }
        catch (error: unknown) {
            const errorData = error instanceof Error
                ? { message: error.message }
                : axios.isAxiosError(error) && error.response
                    ? error.response.data
                    : { message: 'An unknown error occurred' };
            console.log(JSON.stringify(errorData, null, 2));
            setLoading(false);
        }
        console.log('end');

    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
                        <Target className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-black mb-4">Idea Analysis</h1>
                    <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
                </div>

                {/* Analysis Section */}
                <div className="mb-16">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-black">Strategic Analysis</h2>
                        </div>
                        <div className="prose prose-lg max-w-none">
                            {data?.analysis ? (
                                <div
                                    className="text-black leading-relaxed text-lg"
                                    dangerouslySetInnerHTML={{
                                        __html: `<p class="text-black leading-relaxed mb-4 text-lg">${markdownToHtml(data.analysis)}</p>`
                                    }}
                                />
                            ) : (
                                <p className="text-black text-lg">No analysis available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Variations Section */}
                <div>
                    <div className="flex items-center justify-center mb-8">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                            <Lightbulb className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-black">Idea Variations</h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {data?.variations && data.variations.length > 0 ? (
                            data.variations.map((variation: string, index: number) => {
                                const colonIndex = variation.indexOf(':');
                                const title = colonIndex !== -1 ? variation.substring(0, colonIndex).trim() : `Variation ${index + 1}`;
                                const description = colonIndex !== -1 ? variation.substring(colonIndex + 1).trim() : variation;

                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleVariationClick(index)}
                                        className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-blue-300 group"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                                                    <span className="text-white font-bold text-sm">{index + 1}</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-black">
                                                    {title}
                                                </h3>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-blue-500 transform transition-transform group-hover:translate-x-1" />
                                        </div>

                                        <p className="text-gray-700 text-sm">{description}</p>

                                        <div className="mt-4 pt-4 border-t border-blue-100">
                                            <span className="text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
                                                Explore this variation →
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-black text-center col-span-full">No variations available</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 text-center">
                    <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default IdeaAnalysisPage;
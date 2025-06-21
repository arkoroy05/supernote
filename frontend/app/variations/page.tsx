"use client"

import React, { useState, useEffect } from 'react';
import { ArrowRight, Lightbulb, Target, TrendingUp } from 'lucide-react';

interface AnalysisData {
  analysis: string;
  variations: string[];
}

const IdeaAnalysisPage: React.FC = () => {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Retrieve the analysis data from localStorage
    const storedData = localStorage.getItem('ideaAnalysisData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log("Retrieved data:", parsedData); // Debug log
        setData(parsedData);
      } catch (error) {
        console.error('Error parsing analysis data:', error);
      }
    }
    setLoading(false);
  }, []);

  const handleVariationClick = (): void => {
    window.location.href = '/graph';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-blue-800">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-3xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Analysis Data Found</h2>
          <p className="text-gray-600 mb-6">Please return to the home page and submit an idea for analysis.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

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
              {data.analysis?.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index} className="text-black leading-relaxed mb-4 text-lg">
                  {paragraph}
                </p>
              )) || <p className="text-black text-lg">No analysis available</p>}
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
            {data.variations && data.variations.length > 0 ? (
              data.variations.map((variation: string, index: number) => (
                <div
                  key={index}
                  onClick={handleVariationClick}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-blue-300 group flex flex-col min-h-[200px]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <h3 className="text-lg font-bold text-black">
                        Variation {index + 1}
                      </h3>
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-500 transform transition-transform group-hover:translate-x-1" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-gray-700 mt-2 break-words whitespace-normal">{variation}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-100">
                    <span className="text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
                      Explore this variation →
                    </span>
                  </div>
                </div>
              ))
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
"use client";

import React, { useState, useRef } from 'react';
import { Download, Eye, Edit3, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Mock markdown content
const initialMarkdown = `# Idea Summary

## Problem Statement
The current market lacks efficient tools for entrepreneurs to systematically validate and develop their startup ideas from conception to funding-ready proposals.

## Solution Overview
Supernote is a graph-based ideation platform that transforms raw startup ideas into fully validated business concepts through AI-guided analysis and community-driven funding mechanisms.

### Key Features
- **Graph-based visualization** of idea development process
- **AI-powered guidance** through validation steps
- **Community staking and voting** system for funding
- **Scalability analysis** and monetization strategies
- **Differentiation framework** for competitive positioning

## Market Analysis
The global startup ecosystem continues to grow, with over 305 million startups launched annually. However, 90% fail due to poor validation and planning.

### Target Market
- Aspiring entrepreneurs
- Early-stage founders
- Innovation teams in corporations
- Startup accelerators and incubators

## Business Model
- **Freemium subscription** for platform access
- **Transaction fees** on funded grants (2-5%)
- **Premium AI analysis** features
- **Corporate licensing** for enterprise teams

## Technical Architecture
Built on modern web technologies with blockchain integration for transparent funding mechanisms.

### Technology Stack
- Frontend: Next.js, TypeScript, React
- Backend: Node.js, GraphQL
- Database: PostgreSQL with graph extensions
- Blockchain: Ethereum for staking and voting
- AI: OpenAI GPT-4 for idea analysis

## Funding Requirements
Seeking $500K seed funding to build MVP and acquire first 1000 users.

### Use of Funds
- **40%** Product development
- **30%** Team expansion
- **20%** Marketing and user acquisition
- **10%** Legal and compliance

## Next Steps
1. Complete technical MVP
2. Launch beta with 100 selected users
3. Implement community funding features
4. Scale to 10K active users
5. Series A fundraising

---

*This document represents a comprehensive analysis of the Supernote startup concept, generated through our AI-powered ideation platform.*`;

export default function SynthesizePage() {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const markdownRef = useRef<HTMLDivElement>(null);

  // Simple markdown to HTML converter for PDF only
  const markdownToHtmlForPdf = (text: string) => {
    const lines = text.split('\n');
    const processedLines = [];
    let inList = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line === '') {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        processedLines.push('<br>');
        continue;
      }
      
      // Headers
      if (line.startsWith('### ')) {
        if (inList) { processedLines.push('</ul>'); inList = false; }
        processedLines.push(`<h3>${line.substring(4)}</h3>`);
      } else if (line.startsWith('## ')) {
        if (inList) { processedLines.push('</ul>'); inList = false; }
        processedLines.push(`<h2>${line.substring(3)}</h2>`);
      } else if (line.startsWith('# ')) {
        if (inList) { processedLines.push('</ul>'); inList = false; }
        processedLines.push(`<h1>${line.substring(2)}</h1>`);
      }
      // Lists
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        if (!inList) {
          processedLines.push('<ul>');
          inList = true;
        }
        const content = line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        processedLines.push(`<li>${content}</li>`);
      }
      // Numbered lists
      else if (/^\d+\.\s/.test(line)) {
        if (inList && processedLines[processedLines.length - 1] === '</ul>') {
          processedLines.pop();
          processedLines.push('<ol>');
        } else if (!inList) {
          processedLines.push('<ol>');
          inList = true;
        }
        const content = line.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        processedLines.push(`<li>${content}</li>`);
      }
      // Horizontal rule
      else if (line === '---') {
        if (inList) { processedLines.push(inList ? '</ul>' : '</ol>'); inList = false; }
        processedLines.push('<hr>');
      }
      // Regular text
      else {
        if (inList) { processedLines.push('</ul>'); inList = false; }
        const content = line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>');
        processedLines.push(`<p>${content}</p>`);
      }
    }
    
    if (inList) {
      processedLines.push('</ul>');
    }
    
    return processedLines.join('');
  };

  const downloadAsPDF = async () => {
    setIsLoading(true);
    try {
      // Create a new window for PDF generation
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to download PDF');
        return;
      }

      const htmlContent = markdownToHtmlForPdf(markdown);
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Supernote - Synthesized Document</title>
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              line-height: 1.4; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 40px 20px;
              color: #000;
              font-size: 12px;
            }
            
            h1 { 
              font-size: 18px; 
              font-weight: bold; 
              margin: 1.5em 0 0.5em 0;
              color: #000;
            }
            
            h2 { 
              font-size: 16px; 
              font-weight: bold; 
              margin: 1.2em 0 0.4em 0;
              color: #000;
            }
            
            h3 { 
              font-size: 14px; 
              font-weight: bold; 
              margin: 1em 0 0.3em 0;
              color: #000;
            }
            
            p { 
              margin: 0.5em 0;
              text-align: justify;
            }
            
            ul, ol { 
              margin: 0.5em 0;
              padding-left: 1.5em;
            }
            
            li { 
              margin: 0.2em 0;
            }
            
            strong { 
              font-weight: bold;
            }
            
            em {
              font-style: italic;
            }
            
            hr { 
              margin: 1.5em 0; 
              border: none;
              border-top: 1px solid #ccc;
            }
            
            br {
              line-height: 0.8em;
            }
            
            @media print {
              body { 
                margin: 0; 
                padding: 20px;
                font-size: 11px;
              }
              
              h1 { font-size: 16px; }
              h2 { font-size: 14px; }
              h3 { font-size: 12px; }
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Wait for content to load, then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Synthesize</h1>
                <p className="text-sm text-gray-500">Edit and refine your startup analysis</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium transition-colors ${
                  isPreview 
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-300' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {isPreview ? <Edit3 className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {isPreview ? 'Edit' : 'Preview'}
              </button>
              
              <button
                onClick={downloadAsPDF}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 mr-2" />
                {isLoading ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {isPreview ? (
            // Preview Mode with ReactMarkdown
            <div className="p-8">
              <div className="mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-indigo-600 rounded"></div>
                  <h1 className="text-2xl font-bold text-indigo-600">Supernote</h1>
                </div>
                <p className="text-center text-gray-600 text-sm">Synthesized Startup Analysis</p>
              </div>
              
              <div ref={markdownRef} className="prose prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({...props}) => <h1 className="text-2xl font-bold mt-8 mb-4 text-gray-900" {...props} />,
                    h2: ({...props}) => <h2 className="text-xl font-bold mt-6 mb-3 text-gray-900" {...props} />,
                    h3: ({...props}) => <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800" {...props} />,
                    p: ({...props}) => <p className="mb-3 text-gray-700 leading-relaxed" {...props} />,
                    ul: ({...props}) => <ul className="list-disc ml-6 mb-4 space-y-1" {...props} />,
                    ol: ({...props}) => <ol className="list-decimal ml-6 mb-4 space-y-1" {...props} />,
                    li: ({...props}) => <li className="text-gray-700" {...props} />,
                    strong: ({...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                    em: ({...props}) => <em className="italic text-gray-700" {...props} />,
                    blockquote: ({...props}) => <blockquote className="border-l-4 border-indigo-200 pl-4 italic text-gray-600 my-4" {...props} />,
                    code: ({...props}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800" {...props} />,
                    pre: ({...props}) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono mb-4" {...props} />,
                    hr: ({...props}) => <hr className="my-6 border-gray-300" {...props} />
                  }}
                >
                  {markdown}
                </ReactMarkdown>
              </div>
              
              <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                Generated by Supernote on {new Date().toLocaleDateString()}
              </div>
            </div>
          ) : (
            // Edit Mode
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Content
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Edit your markdown content below. Use standard markdown syntax for formatting.
                </p>
              </div>
              
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm resize-none"
                placeholder="Enter your markdown content here..."
                style={{ minHeight: '600px' }}
              />
              
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>Characters: {markdown.length}</span>
                  <span>Lines: {markdown.split('\n').length}</span>
                </div>
                <div className="text-xs">
                  Supports: **bold**, *italic*, # headers, - lists, --- dividers
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Markdown Tips</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p><code className="bg-blue-100 px-1 rounded"># Header 1</code> • <code className="bg-blue-100 px-1 rounded">## Header 2</code> • <code className="bg-blue-100 px-1 rounded">### Header 3</code></p>
            <p><code className="bg-blue-100 px-1 rounded">**bold text**</code> • <code className="bg-blue-100 px-1 rounded">*italic text*</code> • <code className="bg-blue-100 px-1 rounded">- list item</code></p>
            <p><code className="bg-blue-100 px-1 rounded">---</code> for horizontal divider</p>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client"

import { useState } from "react"
import DynamicFrameLayout from "@/components/DynamicFrameLayout"
import { ppEditorialNewUltralightItalic, inter} from "@/app/fonts"
import Link from "next/link"

export default function Home() {
  const [headerSize] = useState(1.2) // 120% is the default size
  const [textSize] = useState(0.8) // 80% is the default size

  return (
    <div
      className={`min-h-screen bg-[#141414] flex items-center justify-center p-8 ${ppEditorialNewUltralightItalic.variable} ${inter.variable}`}
    >
      <div className="w-full h-full flex flex-col md:flex-row items-start gap-8 md:gap-8">
        {/* Left Content */}
        <div className="w-full md:w-[260px] flex-shrink-0 flex flex-col justify-between h-full">
          <div className="flex flex-col gap-16">
            <h1
              className={`${ppEditorialNewUltralightItalic.className} text-4xl md:text-6xl font-light italic text-white/80 tracking-tighter leading-[130%]`}
              style={{ fontSize: `${4 * headerSize}rem` }}
            >
              Prompt
              <br />
              variations
            </h1>
            <div
              className={`${inter.className} flex flex-col gap-12 text-white/50 text-sm font-light max-w-[300px]`}
              style={{ fontSize: `${0.875 * textSize}rem` }}
            >
              <div className="space-y-6">
                <div className="h-px bg-white/10 w-full" />
                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white/80 rounded-lg transition-colors">
                  Proceed
                </button>
                <div className="h-px bg-white/10 w-full" />
              </div>
            </div>
            <Link
              href="https://lumalabs.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 relative opacity-80 hover:opacity-100 transition-opacity"
            >
            </Link>
          </div>
          <a
            href="https://lumalabs.ai/join?role=5d274587-f8fd-4f53-a5b6-8f85d586e1aa"
            className="inline-block px-6 py-3 text-white/70 border border-white/20 rounded-full font-medium hover:bg-white/5 transition-colors text-center w-full max-w-[260px] text-sm mt-16"
            target="_blank"
            rel="noopener noreferrer"
          >
            Apply
          </a>
        </div>

        {/* Right Content */}
        <div className="w-full md:flex-grow h-[60vh] md:h-[80vh]">
          <DynamicFrameLayout />
        </div>
      </div>
    </div>
  )
}

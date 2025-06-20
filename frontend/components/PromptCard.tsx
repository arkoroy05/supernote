"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface PromptCardProps {
  id: number
  title: string
  description: string
  detailedDescription: string
  variation: string
  className?: string
}

export function PromptCard({
  title,
  description,
  detailedDescription,
  variation,
  className = "",
}: PromptCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setModalPosition({
      x: rect.right + 10,
      y: rect.top,
    })
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <>
      <div
        className={`relative bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 cursor-pointer transition-all duration-300 ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="space-y-2">
          <h3 className="text-white/90 font-medium text-lg">{title}</h3>
          <p className="text-white/60 text-sm line-clamp-3">{description}</p>
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-6 max-w-md shadow-2xl"
            style={{
              left: modalPosition.x,
              top: modalPosition.y,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold text-xl mb-2">{title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{detailedDescription}</p>
              </div>
              <div className="border-t border-white/10 pt-4">
                <h4 className="text-white/90 font-medium mb-2">Variation:</h4>
                <p className="text-white/60 text-sm font-mono bg-white/5 p-3 rounded border">{variation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

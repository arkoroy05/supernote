"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PromptCard } from "@/components/PromptCard"

interface Prompt {
  id: number
  title: string
  description: string
  detailedDescription: string
  variation: string
  defaultPos: { x: number; y: number; w: number; h: number }
}

const initialPrompts: Prompt[] = [
  {
    id: 1,
    title: "Creative Portrait",
    description: "Generate artistic portrait variations with different styles and moods",
    detailedDescription:
      "This prompt creates stunning portrait variations by adjusting artistic styles, lighting conditions, and emotional expressions. Perfect for exploring different creative directions for character design.",
    variation:
      "Create a portrait of [subject] in [artistic style], with [lighting condition], expressing [emotion], rendered in [medium]",
    defaultPos: { x: 0, y: 0, w: 4, h: 4 },
  },
  {
    id: 2,
    title: "Landscape Scenes",
    description: "Transform landscapes with various weather conditions and times of day",
    detailedDescription:
      "Explore different atmospheric conditions and temporal settings for landscape imagery. This prompt helps create diverse environmental moods and settings.",
    variation:
      "A [landscape type] during [time of day] with [weather condition], shot in [camera style], with [color palette] tones",
    defaultPos: { x: 4, y: 0, w: 4, h: 4 },
  },
  {
    id: 3,
    title: "Product Showcase",
    description: "Display products in different contexts and presentation styles",
    detailedDescription:
      "Create compelling product presentations by varying backgrounds, lighting setups, and contextual environments. Ideal for marketing and e-commerce applications.",
    variation:
      "[Product] placed on [surface/background], lit with [lighting setup], in [environment context], photographed from [angle]",
    defaultPos: { x: 8, y: 0, w: 4, h: 4 },
  },
  {
    id: 4,
    title: "Abstract Art",
    description: "Generate abstract compositions with different color schemes and forms",
    detailedDescription:
      "Explore abstract artistic expressions through varied color palettes, geometric forms, and compositional structures. Perfect for creating unique artistic pieces.",
    variation:
      "Abstract [composition type] with [color scheme], featuring [geometric elements], in the style of [art movement]",
    defaultPos: { x: 0, y: 4, w: 4, h: 4 },
  },
  {
    id: 5,
    title: "Character Design",
    description: "Create character variations with different attributes and styles",
    detailedDescription:
      "Develop diverse character designs by modifying physical attributes, clothing styles, and personality traits. Useful for game design and storytelling.",
    variation:
      "A [character type] wearing [clothing style], with [physical attributes], in [pose/action], with [personality trait] expression",
    defaultPos: { x: 4, y: 4, w: 4, h: 4 },
  },
  {
    id: 6,
    title: "Architecture",
    description: "Explore architectural styles and building variations",
    detailedDescription:
      "Generate diverse architectural concepts by varying building styles, materials, and environmental contexts. Great for conceptual design and visualization.",
    variation:
      "A [building type] in [architectural style], made of [materials], set in [environment], during [time period]",
    defaultPos: { x: 8, y: 4, w: 4, h: 4 },
  },
  {
    id: 7,
    title: "Food Photography",
    description: "Style food presentations with different plating and contexts",
    detailedDescription:
      "Create appealing food imagery by varying plating styles, backgrounds, and presentation contexts. Perfect for culinary content and marketing.",
    variation:
      "[Food item] plated in [style], on [surface/plate], with [garnish/accompaniment], in [lighting condition]",
    defaultPos: { x: 0, y: 8, w: 4, h: 4 },
  },
  {
    id: 8,
    title: "Fashion Styles",
    description: "Generate fashion looks with different styles and contexts",
    detailedDescription:
      "Explore fashion variations by changing clothing styles, accessories, and contextual settings. Ideal for fashion design and styling inspiration.",
    variation:
      "[Clothing item] in [fashion style], with [accessories], worn in [context/setting], during [season/occasion]",
    defaultPos: { x: 4, y: 8, w: 4, h: 4 },
  },
  {
    id: 9,
    title: "Digital Art",
    description: "Create digital artwork with various techniques and themes",
    detailedDescription:
      "Generate diverse digital art pieces by combining different artistic techniques, themes, and visual effects. Perfect for digital artists and designers.",
    variation:
      "Digital art of [subject] using [technique], with [color palette], featuring [visual effects], in [artistic theme]",
    defaultPos: { x: 8, y: 8, w: 4, h: 4 },
  },
]

export default function PromptGrid() {
  const [prompts] = useState<Prompt[]>(initialPrompts)
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null)
  const [hoverSize] = useState(6)
  const [gapSize] = useState(4)

  const getRowSizes = () => {
    if (hovered === null) {
      return "1fr 1fr 1fr"
    }
    const { row } = hovered
    const nonHoveredSize = (12 - hoverSize) / 2
    return [0, 1, 2].map((r) => (r === row ? `${hoverSize}fr` : `${nonHoveredSize}fr`)).join(" ")
  }

  const getColSizes = () => {
    if (hovered === null) {
      return "1fr 1fr 1fr"
    }
    const { col } = hovered
    const nonHoveredSize = (12 - hoverSize) / 2
    return [0, 1, 2].map((c) => (c === col ? `${hoverSize}fr` : `${nonHoveredSize}fr`)).join(" ")
  }

  return (
    <div className="w-full h-full">
      <div
        className="relative w-full h-full"
        style={{
          display: "grid",
          gridTemplateRows: getRowSizes(),
          gridTemplateColumns: getColSizes(),
          gap: `${gapSize}px`,
          transition: "grid-template-rows 0.4s ease, grid-template-columns 0.4s ease",
        }}
      >
        {prompts.map((prompt) => {
          const row = Math.floor(prompt.defaultPos.y / 4)
          const col = Math.floor(prompt.defaultPos.x / 4)

          return (
            <motion.div
              key={prompt.id}
              className="relative"
              style={{
                transition: "transform 0.4s ease",
              }}
              onMouseEnter={() => setHovered({ row, col })}
              onMouseLeave={() => setHovered(null)}
            >
              <PromptCard
                id={prompt.id}
                title={prompt.title}
                description={prompt.description}
                detailedDescription={prompt.detailedDescription}
                variation={prompt.variation}
                className="w-full h-full"
              />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

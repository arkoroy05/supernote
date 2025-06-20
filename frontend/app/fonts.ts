import { Inter } from "next/font/google"
import type { NextFontWithVariable } from "next/dist/compiled/@next/font"
import type { NextFont } from "next/font"

const ppEditorialNewUltralightItalic: NextFontWithVariable & NextFont = {
  className: "font-pp-editorial",
  style: {
    fontFamily: "PPEditorialNew-UltralightItalic",
    fontWeight: "200",
    fontStyle: "italic",
  },
  variable: "--font-pp-editorial",
}

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export { ppEditorialNewUltralightItalic, inter }

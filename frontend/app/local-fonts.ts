import localFont from "next/font/local"

export const customFont = localFont({
  src: [
    {
      path: "../public/fonts/your-font-regular.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/your-font-italic.woff2",
      weight: "400",
      style: "italic",
    },
    // Add more variations as needed
  ],
  display: "swap",
})

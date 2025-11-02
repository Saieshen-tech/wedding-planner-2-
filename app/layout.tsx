import type React from "react"
import type { Metadata } from "next"

import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { CookieConsent } from "@/components/cookie-consent"
import { Toaster } from "@/components/ui/toaster"

import { Playfair_Display, Poppins, Libre_Baskerville as V0_Font_Libre_Baskerville, IBM_Plex_Mono as V0_Font_IBM_Plex_Mono, Lora as V0_Font_Lora } from 'next/font/google'

// Initialize fonts
const _libreBaskerville = V0_Font_Libre_Baskerville({ subsets: ['latin'], weight: ["400","700"] })
const _ibmPlexMono = V0_Font_IBM_Plex_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700"] })
const _lora = V0_Font_Lora({ subsets: ['latin'], weight: ["400","500","600","700"] })

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Forever Yours - Wedding Planner",
  description: "Plan your dream wedding with ease",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  )
}

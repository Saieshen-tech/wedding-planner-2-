"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Cookie } from "lucide-react"

const COOKIE_CONSENT_NAME = "cookieConsent"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = Cookies.get(COOKIE_CONSENT_NAME)
    if (!consent) {
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const acceptCookies = () => {
    Cookies.set(COOKIE_CONSENT_NAME, "true", { expires: 365, sameSite: "strict" })
    setShowBanner(false)
  }

  const declineCookies = () => {
    Cookies.set(COOKIE_CONSENT_NAME, "false", { expires: 30, sameSite: "strict" })
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5 duration-500">
      <div className="container mx-auto max-w-4xl">
        <Card className="border-primary/20 bg-gradient-to-br from-background/95 to-primary/5 backdrop-blur-xl shadow-2xl">
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="rounded-full bg-primary/10 p-3">
                  <Cookie className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif text-foreground">We Value Your Privacy</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We use cookies to enhance your wedding planning experience, remember your preferences, and keep you
                    signed in. By clicking "Accept", you consent to our use of cookies.
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={declineCookies}
                className="shrink-0 hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={acceptCookies} className="flex-1 shadow-lg">
                Accept Cookies
              </Button>
              <Button onClick={declineCookies} variant="outline" className="flex-1 bg-transparent">
                Decline
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "./auth-provider"
import { Button } from "./ui/button"
import { Heart, LayoutDashboard, Users, ListChecks, DollarSign, MapPin, Sparkles } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { ThemeToggle } from "./theme-toggle"
import { Avatar, AvatarFallback } from "./ui/avatar"

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/guests", label: "Guests", icon: Users },
  { href: "/checklist", label: "Checklist", icon: ListChecks },
  { href: "/budget", label: "Budget", icon: DollarSign },
  { href: "/vendors", label: "Vendors", icon: MapPin },
  { href: "/moodboard", label: "Inspiration", icon: Sparkles },
]

export function NavHeader() {
  const pathname = usePathname()
  const { user, signout } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-serif text-primary">
            <Heart className="h-6 w-6 fill-primary" />
            <span className="hidden sm:inline">Forever Yours</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2 transition-all hover:scale-105"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile">
                <DropdownMenuItem>
                  <MapPin className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signout} className="text-destructive">
                <Heart className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <nav className="border-t border-border/50 lg:hidden">
        <div className="container mx-auto flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className="flex-col gap-1 h-auto py-2 px-3"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}

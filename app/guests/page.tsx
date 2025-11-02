"use client"

import { AuthGuard } from "@/components/auth-guard"
import { NavHeader } from "@/components/nav-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, UserPlus, Mail, Phone, CheckCircle2, XCircle, Clock, Trash2, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { SparkleAnimation } from "@/components/sparkle-animation"

interface Guest {
  id: string
  name: string
  email: string
  phone: string
  rsvp: "pending" | "confirmed" | "declined"
  plusOne: boolean
  dietaryRestrictions?: string
}

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRsvp, setFilterRsvp] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()
  const [showSparkle, setShowSparkle] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    plusOne: false,
    dietaryRestrictions: "",
  })

  useEffect(() => {
    const savedGuests = localStorage.getItem("wedding_guests")
    if (savedGuests) {
      setGuests(JSON.parse(savedGuests))
    }
  }, [])

  const saveGuests = (updatedGuests: Guest[]) => {
    localStorage.setItem("wedding_guests", JSON.stringify(updatedGuests))
    setGuests(updatedGuests)
  }

  const handleAddGuest = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      })
      return
    }

    const newGuest: Guest = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      rsvp: "pending",
      plusOne: formData.plusOne,
      dietaryRestrictions: formData.dietaryRestrictions,
    }

    saveGuests([...guests, newGuest])
    setFormData({ name: "", email: "", phone: "", plusOne: false, dietaryRestrictions: "" })
    setIsAddDialogOpen(false)

    setShowSparkle(true)

    toast({
      title: "Guest added",
      description: `${newGuest.name} has been added to your guest list`,
    })
  }

  const handleUpdateRsvp = (guestId: string, rsvp: Guest["rsvp"]) => {
    const updatedGuests = guests.map((g) => (g.id === guestId ? { ...g, rsvp } : g))
    saveGuests(updatedGuests)

    toast({
      title: "RSVP updated",
      description: "Guest RSVP status has been updated",
    })
  }

  const handleDeleteGuest = (guestId: string) => {
    const updatedGuests = guests.filter((g) => g.id !== guestId)
    saveGuests(updatedGuests)

    toast({
      title: "Guest removed",
      description: "Guest has been removed from your list",
    })
  }

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterRsvp === "all" || guest.rsvp === filterRsvp
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: guests.length,
    confirmed: guests.filter((g) => g.rsvp === "confirmed").length,
    pending: guests.filter((g) => g.rsvp === "pending").length,
    declined: guests.filter((g) => g.rsvp === "declined").length,
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
        <NavHeader />

        <SparkleAnimation trigger={showSparkle} onComplete={() => setShowSparkle(false)} />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0">
              <img
                src="/elegant-wedding-guests.jpg"
                alt="Wedding guests"
                className="h-full w-full object-cover opacity-15"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/20" />
            </div>
            <div className="relative p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="mb-2 text-4xl font-serif text-foreground">Guest List</h1>
                  <p className="text-muted-foreground">Manage your wedding guests and track RSVPs</p>
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 shadow-lg">
                      <Plus className="h-4 w-4" />
                      Add Guest
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Guest</DialogTitle>
                      <DialogDescription>Add a guest to your wedding list</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+27 12 345 6789"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dietary">Dietary Restrictions</Label>
                        <Input
                          id="dietary"
                          value={formData.dietaryRestrictions}
                          onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                          placeholder="Vegetarian, allergies, etc."
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="plusOne"
                          checked={formData.plusOne}
                          onChange={(e) => setFormData({ ...formData, plusOne: e.target.checked })}
                          className="h-4 w-4 rounded border-input"
                        />
                        <Label htmlFor="plusOne" className="cursor-pointer">
                          Allow plus one
                        </Label>
                      </div>
                      <Button onClick={handleAddGuest} className="w-full">
                        Add Guest
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-background to-secondary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm font-medium text-muted-foreground">Total Guests</p>
                    <p className="text-3xl font-serif">{stats.total}</p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-background to-green-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm font-medium text-muted-foreground">Confirmed</p>
                    <p className="text-3xl font-serif text-green-600">{stats.confirmed}</p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10">
                    <CheckCircle2 className="h-7 w-7 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-background to-amber-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-3xl font-serif text-amber-600">{stats.pending}</p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
                    <Clock className="h-7 w-7 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-background to-red-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm font-medium text-muted-foreground">Declined</p>
                    <p className="text-3xl font-serif text-red-600">{stats.declined}</p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
                    <XCircle className="h-7 w-7 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6 border-border/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search guests by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={filterRsvp} onValueChange={setFilterRsvp}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by RSVP" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Guests</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Guest List */}
          {filteredGuests.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UserPlus className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-serif">No guests yet</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {searchQuery || filterRsvp !== "all"
                    ? "No guests match your filters"
                    : "Start by adding your first guest"}
                </p>
                {!searchQuery && filterRsvp === "all" && (
                  <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Your First Guest
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredGuests.map((guest) => (
                <Card key={guest.id} className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="text-lg font-serif">{guest.name}</h3>
                          {guest.plusOne && (
                            <Badge variant="secondary" className="text-xs">
                              +1
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          {guest.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {guest.email}
                            </div>
                          )}
                          {guest.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {guest.phone}
                            </div>
                          )}
                          {guest.dietaryRestrictions && <p className="text-xs">Dietary: {guest.dietaryRestrictions}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Select
                          value={guest.rsvp}
                          onValueChange={(value) => handleUpdateRsvp(guest.id, value as Guest["rsvp"])}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-amber-600" />
                                Pending
                              </div>
                            </SelectItem>
                            <SelectItem value="confirmed">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                Confirmed
                              </div>
                            </SelectItem>
                            <SelectItem value="declined">
                              <div className="flex items-center gap-2">
                                <XCircle className="h-4 w-4 text-red-600" />
                                Declined
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <Button variant="ghost" size="icon" onClick={() => handleDeleteGuest(guest.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}

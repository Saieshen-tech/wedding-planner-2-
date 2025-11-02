"use client"

import { AuthGuard } from "@/components/auth-guard"
import { NavHeader } from "@/components/nav-header"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Calendar, Heart, Mail, Save } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    weddingDate: "",
    partnerName: "",
    venue: "",
    theme: "",
    notes: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        weddingDate: user.weddingDate || "",
        partnerName: user.partnerName || "",
        venue: (user as any).venue || "",
        theme: (user as any).theme || "",
        notes: (user as any).notes || "",
      })
    }
  }, [user])

  const handleSave = () => {
    updateUser({
      name: formData.name,
      weddingDate: formData.weddingDate,
      partnerName: formData.partnerName,
      ...(formData.venue && { venue: formData.venue }),
      ...(formData.theme && { theme: formData.theme }),
      ...(formData.notes && { notes: formData.notes }),
    } as any)

    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your wedding details have been saved",
    })
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        weddingDate: user.weddingDate || "",
        partnerName: user.partnerName || "",
        venue: (user as any).venue || "",
        theme: (user as any).theme || "",
        notes: (user as any).notes || "",
      })
    }
    setIsEditing(false)
  }

  const daysUntilWedding = formData.weddingDate
    ? Math.ceil((new Date(formData.weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
        <NavHeader />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0">
              <img
                src="/romantic-couple-silhouette.jpg"
                alt="Wedding couple"
                className="h-full w-full object-cover opacity-15"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/20" />
            </div>
            <div className="relative p-6">
              <h1 className="mb-2 text-4xl font-serif text-foreground">Profile</h1>
              <p className="text-muted-foreground">Manage your wedding details and preferences</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Summary Card */}
            <Card className="border-border/50 lg:col-span-1">
              <CardContent className="p-6">
                <div className="mb-6 flex flex-col items-center text-center">
                  <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="mb-1 text-2xl font-serif">{user?.name}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>

                {formData.weddingDate && (
                  <div className="space-y-4 border-t border-border pt-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Wedding Date</p>
                        <p className="font-medium">
                          {new Date(formData.weddingDate).toLocaleDateString("en-ZA", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {daysUntilWedding !== null && daysUntilWedding > 0 && (
                      <div className="rounded-lg bg-primary/5 p-4 text-center">
                        <p className="text-3xl font-serif text-primary">{daysUntilWedding}</p>
                        <p className="text-sm text-muted-foreground">days until your wedding</p>
                      </div>
                    )}

                    {formData.partnerName && (
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Heart className="h-5 w-5 fill-primary text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Partner</p>
                          <p className="font-medium">{formData.partnerName}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profile Details Card */}
            <Card className="border-border/50 lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Wedding Details</CardTitle>
                    <CardDescription>Update your wedding information</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave} className="gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="email" value={formData.email} disabled className="pl-9" />
                    </div>
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="partnerName">Partner's Name</Label>
                    <Input
                      id="partnerName"
                      value={formData.partnerName}
                      onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Your partner's name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weddingDate">Wedding Date</Label>
                    <Input
                      id="weddingDate"
                      type="date"
                      value={formData.weddingDate}
                      onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                      id="venue"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Your wedding venue"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="theme">Wedding Theme</Label>
                    <Input
                      id="theme"
                      value={formData.theme}
                      onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                      disabled={!isEditing}
                      placeholder="e.g., Rustic Garden, Modern Elegance, Beach Romance"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Any additional notes or ideas for your wedding..."
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Planning Stats */}
          <Card className="mt-6 border-border/50">
            <CardHeader>
              <CardTitle>Planning Progress</CardTitle>
              <CardDescription>Your wedding planning journey at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border/50 p-4">
                  <p className="text-sm text-muted-foreground">Guests Added</p>
                  <p className="mt-1 text-2xl font-serif">
                    {JSON.parse(localStorage.getItem("wedding_guests") || "[]").length}
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 p-4">
                  <p className="text-sm text-muted-foreground">Tasks Completed</p>
                  <p className="mt-1 text-2xl font-serif">
                    {JSON.parse(localStorage.getItem("wedding_tasks") || "[]").filter((t: any) => t.completed).length}
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 p-4">
                  <p className="text-sm text-muted-foreground">Budget Items</p>
                  <p className="mt-1 text-2xl font-serif">
                    {JSON.parse(localStorage.getItem("wedding_budget") || '{"items":[]}').items.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  )
}

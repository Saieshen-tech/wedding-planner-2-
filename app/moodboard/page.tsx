"use client"

import type React from "react"

import { AuthGuard } from "@/components/auth-guard"
import { NavHeader } from "@/components/nav-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, Sparkles, ImageIcon } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useToast } from "@/hooks/use-toast"

interface MoodboardImage {
  id: string
  url: string
  name: string
}

export default function MoodboardPage() {
  const [images, setImages] = useState<MoodboardImage[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const savedImages = localStorage.getItem("wedding_moodboard")
    if (savedImages) {
      setImages(JSON.parse(savedImages))
    }
  }, [])

  const saveImages = (updatedImages: MoodboardImage[]) => {
    localStorage.setItem("wedding_moodboard", JSON.stringify(updatedImages))
    setImages(updatedImages)
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    const newImages: MoodboardImage[] = []
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newImage: MoodboardImage = {
            id: Math.random().toString(36).substr(2, 9),
            url: e.target?.result as string,
            name: file.name,
          }
          newImages.push(newImage)
          if (newImages.length === files.length) {
            saveImages([...images, ...newImages])
            toast({
              title: "Images added",
              description: `${newImages.length} image(s) added to your moodboard`,
            })
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleRemoveImage = (id: string) => {
    const updatedImages = images.filter((img) => img.id !== id)
    saveImages(updatedImages)
    toast({
      title: "Image removed",
      description: "Image has been removed from your moodboard",
    })
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
        <NavHeader />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-purple-500/10 to-primary/10 p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="mb-2 text-4xl font-serif text-foreground flex items-center gap-3">
                  <Sparkles className="h-8 w-8 text-purple-600" />
                  Wedding Inspiration Board
                </h1>
                <p className="text-muted-foreground">Create your dream wedding moodboard with inspiring photos</p>
              </div>

              <Button
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Upload className="h-4 w-4" />
                Upload Photos
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </div>
          </div>

          {/* Upload Area */}
          <Card
            className={`mb-8 border-2 border-dashed transition-all ${
              isDragging ? "border-primary bg-primary/5 scale-105" : "border-border/50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-purple-500/10 p-6">
                  <ImageIcon className="h-12 w-12 text-purple-600" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-serif">Drag & Drop Your Inspiration</h3>
                  <p className="text-muted-foreground">
                    Upload photos of dresses, venues, flowers, decor, and anything that inspires your dream wedding
                  </p>
                </div>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Choose Files
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Moodboard Grid */}
          {images.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="p-12 text-center">
                <Sparkles className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="mb-2 text-xl font-serif text-muted-foreground">Your moodboard is empty</h3>
                <p className="text-sm text-muted-foreground">
                  Start adding inspiration photos to visualize your dream wedding
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {images.map((image) => (
                <Card
                  key={image.id}
                  className="group relative overflow-hidden border-border/50 transition-all hover:shadow-xl"
                >
                  <div className="aspect-square">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => handleRemoveImage(image.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}

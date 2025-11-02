"use client"

import { AuthGuard } from "@/components/auth-guard"
import { NavHeader } from "@/components/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Phone, Mail, Globe, Star, Heart, TrendingUp, DollarSign } from "lucide-react"
import { useState } from "react"

interface Vendor {
  id: string
  name: string
  category: string
  location: string
  province: string
  description: string
  phone: string
  email: string
  website?: string
  rating: number
  priceRange: string
  image: string
}

const categories = [
  "All Categories",
  "Venues",
  "Catering",
  "Photography",
  "Videography",
  "Flowers",
  "Decor",
  "Entertainment",
  "Beauty & Hair",
  "Wedding Planners",
  "Cake & Desserts",
  "Transportation",
]

const provinces = [
  "All Provinces",
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
]

// Sample South African vendors
const sampleVendors: Vendor[] = [
  {
    id: "1",
    name: "Shepstone Gardens",
    category: "Venues",
    location: "Johannesburg",
    province: "Gauteng",
    description: "Elegant garden venue perfect for romantic outdoor weddings with stunning natural beauty.",
    phone: "+27 11 234 5678",
    email: "info@shepstonegardens.co.za",
    website: "www.shepstonegardens.co.za",
    rating: 4.8,
    priceRange: "R50,000 - R100,000",
    image: "/elegant-garden-wedding-venue.jpg",
  },
  {
    id: "2",
    name: "Molenvliet Wine Estate",
    category: "Venues",
    location: "Stellenbosch",
    province: "Western Cape",
    description: "Historic wine estate offering breathtaking vineyard views and world-class facilities.",
    phone: "+27 21 876 5432",
    email: "weddings@molenvliet.co.za",
    website: "www.molenvliet.co.za",
    rating: 4.9,
    priceRange: "R80,000 - R150,000",
    image: "/wine-estate-wedding-venue.jpg",
  },
  {
    id: "3",
    name: "The Oyster Box",
    category: "Venues",
    location: "Umhlanga",
    province: "KwaZulu-Natal",
    description: "Luxury beachfront hotel with stunning ocean views and impeccable service.",
    phone: "+27 31 514 5000",
    email: "events@oysterbox.co.za",
    website: "www.oysterbox.co.za",
    rating: 5.0,
    priceRange: "R100,000 - R200,000",
    image: "/luxury-beach-hotel-wedding.jpg",
  },
  {
    id: "11",
    name: "Askari Game Lodge",
    category: "Venues",
    location: "Magaliesburg",
    province: "Gauteng",
    description:
      "Exclusive bush wedding venue offering an authentic African safari experience with luxury accommodations.",
    phone: "+27 14 577 1234",
    email: "weddings@askari.co.za",
    website: "www.askarilodge.co.za",
    rating: 4.9,
    priceRange: "R90,000 - R180,000",
    image: "/luxury-safari-wedding-venue.jpg",
  },
  {
    id: "12",
    name: "Cavalli Estate",
    category: "Venues",
    location: "Stellenbosch",
    province: "Western Cape",
    description: "Spectacular wine estate with majestic mountain backdrop and world-renowned equestrian facilities.",
    phone: "+27 21 855 3218",
    email: "events@cavalli.co.za",
    website: "www.cavalliestate.co.za",
    rating: 5.0,
    priceRange: "R120,000 - R250,000",
    image: "/luxury-wine-estate-wedding-mountains.jpg",
  },
  {
    id: "13",
    name: "Rosemary Hill",
    category: "Venues",
    location: "Pretoria",
    province: "Gauteng",
    description: "Enchanting garden venue with Victorian charm, perfect for intimate and romantic celebrations.",
    phone: "+27 12 809 0909",
    email: "info@rosemaryhill.co.za",
    website: "www.rosemaryhill.co.za",
    rating: 4.8,
    priceRange: "R45,000 - R85,000",
    image: "/romantic-garden-wedding-venue-victorian.jpg",
  },
  {
    id: "14",
    name: "Summerplace",
    category: "Venues",
    location: "Johannesburg",
    province: "Gauteng",
    description: "Elegant estate with beautiful gardens and sophisticated indoor spaces for year-round weddings.",
    phone: "+27 11 234 8765",
    email: "bookings@summerplace.co.za",
    website: "www.summerplace.co.za",
    rating: 4.7,
    priceRange: "R60,000 - R120,000",
    image: "/elegant-estate-wedding-venue-gardens.jpg",
  },
  {
    id: "15",
    name: "Nooitgedacht Estate",
    category: "Venues",
    location: "Muldersdrift",
    province: "Gauteng",
    description: "Picturesque country estate with rolling lawns and mountain views, ideal for outdoor ceremonies.",
    phone: "+27 11 957 0116",
    email: "weddings@nooitgedacht.co.za",
    website: "www.nooitgedacht.co.za",
    rating: 4.8,
    priceRange: "R55,000 - R110,000",
    image: "/country-estate-wedding-venue-mountains.jpg",
  },
  {
    id: "16",
    name: "Kleinevalleij",
    category: "Venues",
    location: "Wellington",
    province: "Western Cape",
    description: "Award-winning boutique venue nestled in the winelands with breathtaking mountain scenery.",
    phone: "+27 21 873 7016",
    email: "info@kleinevalleij.co.za",
    website: "www.kleinevalleij.co.za",
    rating: 5.0,
    priceRange: "R85,000 - R160,000",
    image: "/boutique-winelands-wedding-venue.jpg",
  },
  {
    id: "17",
    name: "Oakfield Farm",
    category: "Venues",
    location: "Muldersdrift",
    province: "Gauteng",
    description: "Rustic-chic farm venue with beautiful chapel and reception areas surrounded by nature.",
    phone: "+27 11 957 2504",
    email: "events@oakfieldfarm.co.za",
    website: "www.oakfieldfarm.co.za",
    rating: 4.7,
    priceRange: "R50,000 - R95,000",
    image: "/rustic-farm-wedding-venue-chapel.jpg",
  },
  {
    id: "18",
    name: "Hawksmoor House",
    category: "Venues",
    location: "Stellenbosch",
    province: "Western Cape",
    description: "Historic Cape Dutch manor house on a working wine farm with stunning vineyard views.",
    phone: "+27 21 881 3899",
    email: "weddings@hawksmoor.co.za",
    website: "www.hawksmoor.co.za",
    rating: 4.9,
    priceRange: "R75,000 - R140,000",
    image: "/cape-dutch-manor-wedding-vineyard.jpg",
  },
  {
    id: "4",
    name: "Darren Bester Photography",
    category: "Photography",
    location: "Cape Town",
    province: "Western Cape",
    description: "Award-winning wedding photographer capturing authentic moments with artistic flair.",
    phone: "+27 82 345 6789",
    email: "darren@besterphotography.co.za",
    website: "www.darrenbester.co.za",
    rating: 4.9,
    priceRange: "R25,000 - R45,000",
    image: "/wedding-photography-portfolio.jpg",
  },
  {
    id: "5",
    name: "The Pretty Flower",
    category: "Flowers",
    location: "Pretoria",
    province: "Gauteng",
    description: "Bespoke floral designs creating stunning arrangements for your special day.",
    phone: "+27 12 345 6789",
    email: "info@theprettyflower.co.za",
    website: "www.theprettyflower.co.za",
    rating: 4.7,
    priceRange: "R15,000 - R35,000",
    image: "/wedding-floral-arrangements.jpg",
  },
  {
    id: "6",
    name: "Aleit Weddings",
    category: "Wedding Planners",
    location: "Cape Town",
    province: "Western Cape",
    description: "Full-service wedding planning creating unforgettable celebrations with attention to detail.",
    phone: "+27 21 555 1234",
    email: "info@aleitweddings.co.za",
    website: "www.aleitweddings.co.za",
    rating: 5.0,
    priceRange: "R40,000 - R80,000",
    image: "/luxury-wedding-planning.jpg",
  },
  {
    id: "7",
    name: "Chefs Table Catering",
    category: "Catering",
    location: "Johannesburg",
    province: "Gauteng",
    description: "Gourmet catering services offering exquisite menus tailored to your taste.",
    phone: "+27 11 789 4561",
    email: "events@chefstable.co.za",
    website: "www.chefstable.co.za",
    rating: 4.8,
    priceRange: "R350 - R650 per person",
    image: "/gourmet-wedding-catering.jpg",
  },
  {
    id: "8",
    name: "Makeup by Miché",
    category: "Beauty & Hair",
    location: "Durban",
    province: "KwaZulu-Natal",
    description: "Professional bridal makeup and hair styling for your perfect wedding day look.",
    phone: "+27 83 456 7890",
    email: "miche@makeupbymiche.co.za",
    website: "www.makeupbymiche.co.za",
    rating: 4.9,
    priceRange: "R3,500 - R8,000",
    image: "/bridal-makeup-hair.jpg",
  },
  {
    id: "9",
    name: "Sweet Celebrations",
    category: "Cake & Desserts",
    location: "Cape Town",
    province: "Western Cape",
    description: "Custom wedding cakes and dessert tables that taste as good as they look.",
    phone: "+27 21 432 1098",
    email: "orders@sweetcelebrations.co.za",
    website: "www.sweetcelebrations.co.za",
    rating: 4.8,
    priceRange: "R2,500 - R12,000",
    image: "/elegant-wedding-cake.png",
  },
  {
    id: "10",
    name: "DJ Sbu Entertainment",
    category: "Entertainment",
    location: "Johannesburg",
    province: "Gauteng",
    description: "Professional DJ services keeping your guests dancing all night long.",
    phone: "+27 82 123 4567",
    email: "bookings@djsbu.co.za",
    website: "www.djsbu.co.za",
    rating: 4.7,
    priceRange: "R8,000 - R15,000",
    image: "/wedding-dj-entertainment.jpg",
  },
]

type PriceTier = "all" | "budget" | "mid-range" | "luxury"

type SortOption = "rating" | "price-low" | "price-high" | "popular"

export default function VendorsPage() {
  const [vendors] = useState<Vendor[]>(sampleVendors)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("All Categories")
  const [filterProvince, setFilterProvince] = useState("All Provinces")
  const [savedVendors, setSavedVendors] = useState<string[]>([])
  const [priceTier, setPriceTier] = useState<PriceTier>("all")
  const [sortBy, setSortBy] = useState<SortOption>("popular")

  const handleToggleSave = (vendorId: string) => {
    setSavedVendors((prev) => (prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : [...prev, vendorId]))
  }

  const getAveragePrice = (priceRange: string): number => {
    const numbers = priceRange.match(/\d+/g)
    if (!numbers) return 0
    const prices = numbers.map(Number)
    return prices.reduce((a, b) => a + b, 0) / prices.length
  }

  const getPriceTier = (priceRange: string): PriceTier => {
    const avgPrice = getAveragePrice(priceRange)
    if (avgPrice < 50000) return "budget"
    if (avgPrice < 100000) return "mid-range"
    return "luxury"
  }

  const filteredVendors = vendors
    .filter((vendor) => {
      const matchesSearch =
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = filterCategory === "All Categories" || vendor.category === filterCategory
      const matchesProvince = filterProvince === "All Provinces" || vendor.province === filterProvince
      const matchesPriceTier = priceTier === "all" || getPriceTier(vendor.priceRange) === priceTier

      return matchesSearch && matchesCategory && matchesProvince && matchesPriceTier
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "price-low":
          return getAveragePrice(a.priceRange) - getAveragePrice(b.priceRange)
        case "price-high":
          return getAveragePrice(b.priceRange) - getAveragePrice(a.priceRange)
        case "popular":
        default:
          return b.rating - a.rating
      }
    })

  const vendorsByProvince = vendors.reduce(
    (acc, vendor) => {
      if (!acc[vendor.province]) {
        acc[vendor.province] = []
      }
      acc[vendor.province].push(vendor)
      return acc
    },
    {} as Record<string, Vendor[]>,
  )

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
        <NavHeader />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-purple-500/10 to-primary/10 p-6">
            <h1 className="mb-2 text-4xl font-serif text-foreground">Vendor Directory</h1>
            <p className="text-muted-foreground">Discover trusted South African wedding vendors for your special day</p>
          </div>

          <Tabs defaultValue="list" className="mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              <Card className="border-border/50 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search vendors by name, location, or service..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={filterProvince} onValueChange={setFilterProvince}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Province" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((prov) => (
                            <SelectItem key={prov} value={prov}>
                              {prov}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={priceTier} onValueChange={(value) => setPriceTier(value as PriceTier)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Price Range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Prices</SelectItem>
                          <SelectItem value="budget">Budget Friendly</SelectItem>
                          <SelectItem value="mid-range">Mid-Range</SelectItem>
                          <SelectItem value="luxury">Luxury</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="popular">Most Popular</SelectItem>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredVendors.length} {filteredVendors.length === 1 ? "vendor" : "vendors"}
                </p>
                <div className="flex gap-2">
                  {priceTier !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      <DollarSign className="h-3 w-3" />
                      {priceTier === "budget" ? "Budget" : priceTier === "mid-range" ? "Mid-Range" : "Luxury"}
                    </Badge>
                  )}
                  {sortBy !== "popular" && (
                    <Badge variant="secondary" className="gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {sortBy === "rating" ? "Top Rated" : sortBy === "price-low" ? "Cheapest" : "Most Expensive"}
                    </Badge>
                  )}
                </div>
              </div>

              {filteredVendors.length === 0 ? (
                <Card className="border-border/50">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <MapPin className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-serif">No vendors found</h3>
                    <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredVendors.map((vendor) => (
                    <Card
                      key={vendor.id}
                      className="group overflow-hidden border-border/50 transition-all hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={vendor.image || "/placeholder.svg"}
                          alt={vendor.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 bg-background/90 backdrop-blur-sm hover:bg-background"
                          onClick={() => handleToggleSave(vendor.id)}
                        >
                          <Heart
                            className={`h-5 w-5 transition-all ${
                              savedVendors.includes(vendor.id)
                                ? "fill-primary text-primary scale-110"
                                : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                      </div>

                      <CardHeader>
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl">{vendor.name}</CardTitle>
                            <div className="mt-1 flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {vendor.category}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                <span className="text-xs font-medium">{vendor.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="line-clamp-2">{vendor.description}</CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span>
                            {vendor.location}, {vendor.province}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <a href={`tel:${vendor.phone}`} className="hover:text-primary">
                            {vendor.phone}
                          </a>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4 flex-shrink-0" />
                          <a href={`mailto:${vendor.email}`} className="hover:text-primary">
                            {vendor.email}
                          </a>
                        </div>

                        {vendor.website && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Globe className="h-4 w-4 flex-shrink-0" />
                            <a
                              href={`https://${vendor.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary"
                            >
                              {vendor.website}
                            </a>
                          </div>
                        )}

                        <div className="pt-2">
                          <p className="text-sm font-medium text-foreground">{vendor.priceRange}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="map" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Vendors by Province
                  </CardTitle>
                  <CardDescription>Explore wedding vendors across South Africa</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(vendorsByProvince)
                      .sort(([, a], [, b]) => b.length - a.length)
                      .map(([province, provinceVendors]) => (
                        <Card
                          key={province}
                          className="cursor-pointer border-border/50 transition-all hover:shadow-lg hover:border-primary/50"
                          onClick={() => setFilterProvince(province)}
                        >
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between text-lg">
                              <span>{province}</span>
                              <Badge variant="secondary">{provinceVendors.length}</Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Avg Rating:</span>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                  <span className="font-medium">
                                    {(
                                      provinceVendors.reduce((sum, v) => sum + v.rating, 0) / provinceVendors.length
                                    ).toFixed(1)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {Array.from(new Set(provinceVendors.map((v) => v.category)))
                                  .slice(0, 3)
                                  .map((cat) => (
                                    <Badge key={cat} variant="outline" className="text-xs">
                                      {cat}
                                    </Badge>
                                  ))}
                                {Array.from(new Set(provinceVendors.map((v) => v.category))).length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{Array.from(new Set(provinceVendors.map((v) => v.category))).length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Top Rated Vendors by Category</CardTitle>
                  <CardDescription>Highest rated vendors in each category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from(new Set(vendors.map((v) => v.category)))
                      .filter((cat) => cat !== "All Categories")
                      .map((category) => {
                        const topVendor = vendors
                          .filter((v) => v.category === category)
                          .sort((a, b) => b.rating - a.rating)[0]
                        if (!topVendor) return null
                        return (
                          <div
                            key={category}
                            className="flex items-center justify-between rounded-lg border border-border/50 p-4 transition-all hover:bg-secondary/50"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{category}</Badge>
                                <h4 className="font-medium">{topVendor.name}</h4>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {topVendor.location}, {topVendor.province}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span className="font-medium">{topVendor.rating}</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setFilterCategory(category)
                                  document.querySelector('[value="list"]')?.dispatchEvent(new Event("click"))
                                }}
                              >
                                View
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {savedVendors.length > 0 && (
            <Card className="mt-8 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 fill-primary text-primary" />
                  Saved Vendors ({savedVendors.length})
                </CardTitle>
                <CardDescription>Vendors you've marked as favorites</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {savedVendors.map((vendorId) => {
                    const vendor = vendors.find((v) => v.id === vendorId)
                    if (!vendor) return null
                    return (
                      <Badge key={vendorId} variant="secondary" className="gap-1">
                        {vendor.name}
                        <button onClick={() => handleToggleSave(vendorId)} className="ml-1 hover:text-destructive">
                          ×
                        </button>
                      </Badge>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}

"use client"

import { AuthGuard } from "@/components/auth-guard"
import { NavHeader } from "@/components/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, DollarSign, TrendingUp, AlertCircle, Edit, Wallet } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { SparkleAnimation } from "@/components/sparkle-animation"

interface BudgetItem {
  id: string
  category: string
  name: string
  estimated: number
  spent: number
  paid: boolean
}

interface Budget {
  total: number
  items: BudgetItem[]
}

const categories = [
  "Venue",
  "Catering",
  "Photography",
  "Videography",
  "Flowers",
  "Decor",
  "Attire",
  "Beauty",
  "Entertainment",
  "Invitations",
  "Transportation",
  "Accommodation",
  "Other",
]

const categoryColors: Record<string, string> = {
  Venue: "#e8b4b8",
  Catering: "#d4af7a",
  Photography: "#9db89d",
  Videography: "#b8a8d4",
  Flowers: "#f5c6d6",
  Decor: "#d4c4af",
  Attire: "#c4d4e8",
  Beauty: "#e8c4d4",
  Entertainment: "#afd4c4",
  Invitations: "#d4b8a8",
  Transportation: "#b8d4c4",
  Accommodation: "#c4b8d4",
  Other: "#d4d4c4",
}

export default function BudgetPage() {
  const [budget, setBudget] = useState<Budget>({ total: 0, items: [] })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isTotalDialogOpen, setIsTotalDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null)
  const { toast } = useToast()
  const [showSparkle, setShowSparkle] = useState(false)
  const [totalBudget, setTotalBudget] = useState("")
  const [formData, setFormData] = useState({ category: "Other", name: "", estimated: "", spent: "" })

  useEffect(() => {
    const savedBudget = localStorage.getItem("wedding_budget")
    if (savedBudget) {
      setBudget(JSON.parse(savedBudget))
    }
  }, [])

  const saveBudget = (updatedBudget: Budget) => {
    localStorage.setItem("wedding_budget", JSON.stringify(updatedBudget))
    setBudget(updatedBudget)
  }

  const handleSetTotalBudget = () => {
    const amount = Number.parseFloat(totalBudget)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid budget amount",
        variant: "destructive",
      })
      return
    }

    saveBudget({ ...budget, total: amount })
    setTotalBudget("")
    setIsTotalDialogOpen(false)

    setShowSparkle(true)

    toast({
      title: "Budget updated",
      description: `Total budget set to R${amount.toLocaleString()}`,
    })
  }

  const handleAddItem = () => {
    if (!formData.name || !formData.estimated) {
      toast({
        title: "Error",
        description: "Name and estimated cost are required",
        variant: "destructive",
      })
      return
    }

    const estimated = Number.parseFloat(formData.estimated)
    const spent = formData.spent ? Number.parseFloat(formData.spent) : 0

    if (isNaN(estimated) || estimated < 0) {
      toast({
        title: "Error",
        description: "Please enter valid amounts",
        variant: "destructive",
      })
      return
    }

    if (editingItem) {
      const updatedItems = budget.items.map((item) =>
        item.id === editingItem.id
          ? { ...item, category: formData.category, name: formData.name, estimated, spent }
          : item,
      )
      saveBudget({ ...budget, items: updatedItems })
      setEditingItem(null)
      toast({
        title: "Item updated",
        description: "Budget item has been updated",
      })
    } else {
      const newItem: BudgetItem = {
        id: Math.random().toString(36).substr(2, 9),
        category: formData.category,
        name: formData.name,
        estimated,
        spent,
        paid: false,
      }

      saveBudget({ ...budget, items: [...budget.items, newItem] })
      setShowSparkle(true)
      toast({
        title: "Item added",
        description: "New budget item has been added",
      })
    }

    setFormData({ category: "Other", name: "", estimated: "", spent: "" })
    setIsAddDialogOpen(false)
  }

  const handleEditItem = (item: BudgetItem) => {
    setEditingItem(item)
    setFormData({
      category: item.category,
      name: item.name,
      estimated: item.estimated.toString(),
      spent: item.spent.toString(),
    })
    setIsAddDialogOpen(true)
  }

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = budget.items.filter((item) => item.id !== itemId)
    saveBudget({ ...budget, items: updatedItems })

    toast({
      title: "Item removed",
      description: "Budget item has been removed",
    })
  }

  const handleTogglePaid = (itemId: string) => {
    const updatedItems = budget.items.map((item) => (item.id === itemId ? { ...item, paid: !item.paid } : item))
    saveBudget({ ...budget, items: updatedItems })
  }

  const totalEstimated = budget.items.reduce((sum, item) => sum + item.estimated, 0)
  const totalSpent = budget.items.reduce((sum, item) => sum + item.spent, 0)
  const remaining = budget.total - totalSpent
  const budgetProgress = budget.total > 0 ? (totalSpent / budget.total) * 100 : 0

  const chartData = categories
    .map((category) => {
      const categoryItems = budget.items.filter((item) => item.category === category)
      const spent = categoryItems.reduce((sum, item) => sum + item.spent, 0)
      return { category, spent, fill: categoryColors[category] }
    })
    .filter((item) => item.spent > 0)

  const isOverBudget = budget.total > 0 && totalSpent > budget.total

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
        <NavHeader />

        <SparkleAnimation trigger={showSparkle} onComplete={() => setShowSparkle(false)} />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0">
              <img
                src="/wedding-budget-planning.jpg"
                alt="Budget planning"
                className="h-full w-full object-cover opacity-15"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-primary/10" />
            </div>
            <div className="relative p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="mb-2 text-4xl font-serif text-foreground">Budget Tracker</h1>
                  <p className="text-muted-foreground">Manage your wedding expenses</p>
                </div>

                <div className="flex gap-2">
                  <Dialog open={isTotalDialogOpen} onOpenChange={setIsTotalDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2 bg-background shadow-sm">
                        <Wallet className="h-4 w-4" />
                        Set Budget
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Set Total Budget</DialogTitle>
                        <DialogDescription>Enter your total wedding budget in ZAR</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="total">Total Budget (R)</Label>
                          <Input
                            id="total"
                            type="number"
                            value={totalBudget}
                            onChange={(e) => setTotalBudget(e.target.value)}
                            placeholder="e.g., 150000"
                          />
                        </div>
                        <Button onClick={handleSetTotalBudget} className="w-full">
                          Set Budget
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={(open) => {
                      setIsAddDialogOpen(open)
                      if (!open) {
                        setEditingItem(null)
                        setFormData({ category: "Other", name: "", estimated: "", spent: "" })
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button className="gap-2 shadow-lg">
                        <Plus className="h-4 w-4" />
                        Add Expense
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingItem ? "Edit Expense" : "Add New Expense"}</DialogTitle>
                        <DialogDescription>
                          {editingItem ? "Update expense details" : "Add an expense to your budget"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">Item Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Wedding venue deposit"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="estimated">Estimated Cost (R) *</Label>
                          <Input
                            id="estimated"
                            type="number"
                            value={formData.estimated}
                            onChange={(e) => setFormData({ ...formData, estimated: e.target.value })}
                            placeholder="e.g., 50000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="spent">Amount Spent (R)</Label>
                          <Input
                            id="spent"
                            type="number"
                            value={formData.spent}
                            onChange={(e) => setFormData({ ...formData, spent: e.target.value })}
                            placeholder="e.g., 25000"
                          />
                        </div>
                        <Button onClick={handleAddItem} className="w-full">
                          {editingItem ? "Update Expense" : "Add Expense"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-background to-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm font-medium text-muted-foreground">Total Budget</p>
                    <p className="text-3xl font-serif">R{budget.total.toLocaleString()}</p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Wallet className="h-7 w-7 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`overflow-hidden border-border/50 ${isOverBudget ? "bg-gradient-to-br from-background to-red-500/10" : "bg-gradient-to-br from-background to-amber-500/10"}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm font-medium text-muted-foreground">Total Spent</p>
                    <p className={`text-3xl font-serif ${isOverBudget ? "text-red-600" : ""}`}>
                      R{totalSpent.toLocaleString()}
                    </p>
                  </div>
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${isOverBudget ? "bg-red-500/10" : "bg-amber-500/10"}`}
                  >
                    <TrendingUp className={`h-7 w-7 ${isOverBudget ? "text-red-600" : "text-amber-600"}`} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`overflow-hidden border-border/50 ${remaining < 0 ? "bg-gradient-to-br from-background to-red-500/10" : "bg-gradient-to-br from-background to-green-500/10"}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm font-medium text-muted-foreground">Remaining</p>
                    <p className={`text-3xl font-serif ${remaining < 0 ? "text-red-600" : "text-green-600"}`}>
                      R{remaining.toLocaleString()}
                    </p>
                  </div>
                  {remaining < 0 && (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
                      <AlertCircle className="h-7 w-7 text-red-600" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Budget Progress */}
          {budget.total > 0 && (
            <Card className="mb-6 border-border/50">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-serif">Budget Progress</h3>
                    <p className="text-sm text-muted-foreground">{Math.round(budgetProgress)}% of budget used</p>
                  </div>
                  {isOverBudget && (
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Over Budget</span>
                    </div>
                  )}
                </div>
                <Progress
                  value={Math.min(budgetProgress, 100)}
                  className={`h-3 ${isOverBudget ? "[&>div]:bg-destructive" : ""}`}
                />
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Spending by Category Chart */}
            {chartData.length > 0 && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                  <CardDescription>Visual breakdown of your expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={categories.reduce(
                      (acc, cat) => ({
                        ...acc,
                        [cat]: { label: cat, color: categoryColors[cat] },
                      }),
                      {},
                    )}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="spent"
                          nameKey="category"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={(entry) => `${entry.category}: R${entry.spent.toLocaleString()}`}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}

            {/* Budget Items List */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Budget Items</CardTitle>
                <CardDescription>
                  {budget.items.length} {budget.items.length === 1 ? "item" : "items"} tracked
                </CardDescription>
              </CardHeader>
              <CardContent>
                {budget.items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <DollarSign className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">No expenses added yet</p>
                    <Button onClick={() => setIsAddDialogOpen(true)} variant="outline" size="sm">
                      Add Your First Expense
                    </Button>
                  </div>
                ) : (
                  <div className="max-h-[400px] space-y-3 overflow-y-auto">
                    {budget.items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg border border-border/50 p-4 transition-colors hover:bg-secondary/50"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{item.name}</h4>
                              <span
                                className="rounded-full px-2 py-0.5 text-xs"
                                style={{
                                  backgroundColor: `${categoryColors[item.category]}20`,
                                  color: categoryColors[item.category],
                                }}
                              >
                                {item.category}
                              </span>
                            </div>
                            <div className="mt-2 flex items-center gap-4 text-sm">
                              <span className="text-muted-foreground">
                                Estimated:{" "}
                                <span className="font-medium text-foreground">R{item.estimated.toLocaleString()}</span>
                              </span>
                              <span className="text-muted-foreground">
                                Spent:{" "}
                                <span
                                  className={`font-medium ${item.spent > item.estimated ? "text-destructive" : "text-foreground"}`}
                                >
                                  R{item.spent.toLocaleString()}
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditItem(item)}
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteItem(item.id)}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        <Progress
                          value={item.estimated > 0 ? Math.min((item.spent / item.estimated) * 100, 100) : 0}
                          className="h-1.5"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}

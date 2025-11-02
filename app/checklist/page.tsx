"use client"

import { AuthGuard } from "@/components/auth-guard"
import { NavHeader } from "@/components/nav-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Sparkles,
  UtensilsCrossed,
  Shirt,
  Camera,
  Flower2,
  Music,
  Mail,
  FileText,
  MoreHorizontal,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { SparkleAnimation } from "@/components/sparkle-animation"
import { ConfettiAnimation } from "@/components/confetti-animation"

interface Task {
  id: string
  title: string
  category: string
  dueDate?: string
  completed: boolean
  priority: "low" | "medium" | "high"
}

const categories = [
  "Venue & Catering",
  "Attire & Beauty",
  "Photography & Video",
  "Flowers & Decor",
  "Entertainment",
  "Invitations",
  "Legal & Admin",
  "Other",
]

const defaultTasks: Omit<Task, "id" | "completed">[] = [
  { title: "Set wedding date", category: "Legal & Admin", priority: "high" },
  { title: "Create guest list", category: "Invitations", priority: "high" },
  { title: "Set budget", category: "Legal & Admin", priority: "high" },
  { title: "Book venue", category: "Venue & Catering", priority: "high" },
  { title: "Hire photographer", category: "Photography & Video", priority: "high" },
  { title: "Choose wedding dress", category: "Attire & Beauty", priority: "medium" },
  { title: "Book caterer", category: "Venue & Catering", priority: "high" },
  { title: "Order invitations", category: "Invitations", priority: "medium" },
  { title: "Book florist", category: "Flowers & Decor", priority: "medium" },
  { title: "Hire DJ or band", category: "Entertainment", priority: "medium" },
  { title: "Book hair and makeup", category: "Attire & Beauty", priority: "medium" },
  { title: "Arrange transportation", category: "Other", priority: "low" },
  { title: "Plan honeymoon", category: "Other", priority: "low" },
]

const categoryIcons: Record<string, any> = {
  "Venue & Catering": UtensilsCrossed,
  "Attire & Beauty": Shirt,
  "Photography & Video": Camera,
  "Flowers & Decor": Flower2,
  Entertainment: Music,
  Invitations: Mail,
  "Legal & Admin": FileText,
  Other: MoreHorizontal,
}

const categoryColors: Record<string, string> = {
  "Venue & Catering": "text-amber-600",
  "Attire & Beauty": "text-pink-600",
  "Photography & Video": "text-purple-600",
  "Flowers & Decor": "text-green-600",
  Entertainment: "text-blue-600",
  Invitations: "text-rose-600",
  "Legal & Admin": "text-slate-600",
  Other: "text-gray-600",
}

export default function ChecklistPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()
  const [showSparkle, setShowSparkle] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showCompletionMessage, setShowCompletionMessage] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    category: "Other",
    dueDate: "",
    priority: "medium" as Task["priority"],
  })

  useEffect(() => {
    const savedTasks = localStorage.getItem("wedding_tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      const initialTasks = defaultTasks.map((task) => ({
        ...task,
        id: Math.random().toString(36).substr(2, 9),
        completed: false,
      }))
      setTasks(initialTasks)
      localStorage.setItem("wedding_tasks", JSON.stringify(initialTasks))
    }
  }, [])

  const saveTasks = (updatedTasks: Task[]) => {
    localStorage.setItem("wedding_tasks", JSON.stringify(updatedTasks))
    setTasks(updatedTasks)
  }

  const handleAddTask = () => {
    if (!formData.title) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      })
      return
    }

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      category: formData.category,
      dueDate: formData.dueDate || undefined,
      completed: false,
      priority: formData.priority,
    }

    saveTasks([...tasks, newTask])
    setFormData({ title: "", category: "Other", dueDate: "", priority: "medium" })
    setIsAddDialogOpen(false)

    setShowSparkle(true)

    toast({
      title: "Task added",
      description: "New task has been added to your checklist",
    })
  }

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    saveTasks(updatedTasks)

    const task = updatedTasks.find((t) => t.id === taskId)
    if (task?.completed) {
      setShowConfetti(true)
    }

    const allCompleted = updatedTasks.every((t) => t.completed) && updatedTasks.length > 0
    if (allCompleted) {
      setShowCompletionMessage(true)
      toast({
        title: "🌷 Congratulations!",
        description: "Your big day is ready to bloom!",
        duration: 5000,
      })
    }
  }

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((t) => t.id !== taskId)
    saveTasks(updatedTasks)

    toast({
      title: "Task removed",
      description: "Task has been removed from your checklist",
    })
  }

  const filteredTasks = filterCategory === "all" ? tasks : tasks.filter((t) => t.category === filterCategory)

  const completedCount = tasks.filter((t) => t.completed).length
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0

  const tasksByCategory = categories.map((category) => ({
    category,
    tasks: tasks.filter((t) => t.category === category),
    completed: tasks.filter((t) => t.category === category && t.completed).length,
  }))

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-amber-600"
      case "low":
        return "text-green-600"
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
        <NavHeader />

        <SparkleAnimation trigger={showSparkle} onComplete={() => setShowSparkle(false)} />
        <ConfettiAnimation trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

        <main className="container mx-auto px-4 py-8">
          {showCompletionMessage && (
            <Card className="mb-6 border-green-500/50 bg-gradient-to-r from-green-500/10 to-primary/10 animate-in slide-in-from-top card-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Sparkles className="h-8 w-8 text-amber-500 animate-pulse" />
                  <h3 className="text-2xl font-serif text-foreground">Your big day is ready to bloom!</h3>
                  <Sparkles className="h-8 w-8 text-amber-500 animate-pulse" />
                </div>
                <p className="text-muted-foreground">
                  All tasks completed! You're all set for your perfect wedding day.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="mb-8 relative overflow-hidden rounded-2xl card-shadow">
            <div className="absolute inset-0 pastel-filter">
              <img
                src="/wedding-planning-checklist.jpg"
                alt="Wedding planning"
                className="h-full w-full object-cover opacity-20"
              />
            </div>
            <div className="relative p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="mb-2 text-4xl font-serif text-foreground">Wedding Checklist</h1>
                  <p className="text-muted-foreground">Track your wedding planning tasks</p>
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 shadow-lg hover:shadow-xl transition-all">
                      <Plus className="h-4 w-4" />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Task</DialogTitle>
                      <DialogDescription>Add a task to your wedding checklist</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Task Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., Book wedding venue"
                        />
                      </div>
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
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(value) => setFormData({ ...formData, priority: value as Task["priority"] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date (Optional)</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleAddTask} className="w-full">
                        Add Task
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <Card className="mb-6 overflow-hidden border-border/50 bg-gradient-to-br from-card to-secondary/10 card-shadow">
            <CardContent className="p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="mb-1 text-2xl font-serif">Overall Progress</h3>
                  <p className="text-muted-foreground">
                    {completedCount} of {tasks.length} tasks completed
                  </p>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-green-500/10 px-6 py-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <span className="text-4xl font-serif text-green-600">{Math.round(progress)}%</span>
                </div>
              </div>
              <Progress value={progress} className="h-4" />
            </CardContent>
          </Card>

          <div className="mb-6">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full shadow-sm sm:w-[240px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filterCategory === "all" ? (
            <div className="space-y-6">
              {tasksByCategory.map(({ category, tasks: categoryTasks }) => {
                if (categoryTasks.length === 0) return null

                const CategoryIcon = categoryIcons[category]
                const iconColor = categoryColors[category]

                return (
                  <Card key={category} className="border-border/50 card-shadow-hover">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/50`}>
                            <CategoryIcon className={`h-5 w-5 ${iconColor}`} />
                          </div>
                          <h3 className="text-lg font-serif">{category}</h3>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {categoryTasks.filter((t) => t.completed).length}/{categoryTasks.length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {categoryTasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-start gap-3 rounded-lg border border-border/50 bg-card p-3 transition-all hover:bg-secondary/30 hover:shadow-sm"
                          >
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => handleToggleTask(task.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <p
                                className={`font-medium ${task.completed ? "text-muted-foreground line-through" : ""}`}
                              >
                                {task.title}
                              </p>
                              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                <span className={getPriorityColor(task.priority)}>
                                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} priority
                                </span>
                                {task.dueDate && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(task.dueDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTask(task.id)}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="border-border/50 card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/50`}>
                    {(() => {
                      const CategoryIcon = categoryIcons[filterCategory]
                      const iconColor = categoryColors[filterCategory]
                      return <CategoryIcon className={`h-5 w-5 ${iconColor}`} />
                    })()}
                  </div>
                  <h3 className="text-lg font-serif">{filterCategory}</h3>
                </div>
                {filteredTasks.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No tasks in this category</p>
                ) : (
                  <div className="space-y-3">
                    {filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 rounded-lg border border-border/50 bg-card p-3 transition-all hover:bg-secondary/30 hover:shadow-sm"
                      >
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => handleToggleTask(task.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className={`font-medium ${task.completed ? "text-muted-foreground line-through" : ""}`}>
                            {task.title}
                          </p>
                          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className={getPriorityColor(task.priority)}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} priority
                            </span>
                            {task.dueDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTask(task.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}

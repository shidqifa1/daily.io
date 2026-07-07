export type TaskStatus = "pending" | "completed" | "late"

export type Task = {
  id: string
  start: string
  end: string
  title: string
  note: string
  status: TaskStatus
  proofImage?: string
}

export const schedule: Task[] = [
  {
    id: "t1",
    start: "05:00",
    end: "06:00",
    title: "OSN Math Prep",
    note: "Olympiad geometry set — 12 problems from the drill book.",
    status: "completed",
    proofImage: "/proof-math.png",
  },
  {
    id: "t2",
    start: "06:15",
    end: "07:30",
    title: "Fixed-Gear Cycling",
    note: "20km loop through the city. Zone 2 endurance ride.",
    status: "completed",
    proofImage: "/proof-cycling.png",
  },
  {
    id: "t3",
    start: "08:00",
    end: "14:00",
    title: "School — 7th Grade",
    note: "Regular classes. Physics quiz 3rd period.",
    status: "late",
  },
  {
    id: "t4",
    start: "15:30",
    end: "17:00",
    title: "Kopsus Gula Aren Inventory",
    note: "Count jars, update stock sheet, prep tomorrow's orders.",
    status: "completed",
    proofImage: "/proof-inventory.png",
  },
  {
    id: "t5",
    start: "19:00",
    end: "20:30",
    title: "Deep Work — Coding",
    note: "Ship the new landing section and fix 2 open bugs.",
    status: "pending",
  },
  {
    id: "t6",
    start: "21:00",
    end: "21:30",
    title: "Reflection & Journal",
    note: "Log wins, note tomorrow's top 3 priorities.",
    status: "pending",
  },
]

// Weekly completion history (last 7 days) for the statistics view
export type DayStat = {
  day: string
  completed: number
  total: number
}

export const weeklyStats: DayStat[] = [
  { day: "Sen", completed: 5, total: 6 },
  { day: "Sel", completed: 6, total: 6 },
  { day: "Rab", completed: 4, total: 6 },
  { day: "Kam", completed: 6, total: 6 },
  { day: "Jum", completed: 3, total: 5 },
  { day: "Sab", completed: 5, total: 6 },
  { day: "Min", completed: 4, total: 6 },
]

// Breakdown of how the child spends focus per category this week
export type CategoryStat = {
  label: string
  hours: number
  tone: "cyan" | "green" | "amber"
}

export const categoryStats: CategoryStat[] = [
  { label: "Belajar & Olimpiade", hours: 14, tone: "cyan" },
  { label: "Olahraga", hours: 8, tone: "green" },
  { label: "Bisnis Gula Aren", hours: 6, tone: "amber" },
]

export const streakDays = 12

export const statusMeta: Record<
  TaskStatus,
  { label: string; dot: string; text: string; ring: string }
> = {
  completed: {
    label: "Selesai",
    dot: "bg-green",
    text: "text-green",
    ring: "ring-green/40",
  },
  pending: {
    label: "Belum",
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
    ring: "ring-border-strong",
  },
  late: {
    label: "Terlambat",
    dot: "bg-amber",
    text: "text-amber",
    ring: "ring-amber/50",
  },
}

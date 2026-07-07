"use client"

import { Flame, Target, Trophy, Zap } from "lucide-react"
import {
  weeklyStats,
  categoryStats,
  streakDays,
  type Task,
} from "@/lib/schedule"

export function ChildStats({ tasks }: { tasks: Task[] }) {
  const doneToday = tasks.filter((t) => t.status === "completed").length
  const total = tasks.length
  const todayRate = total > 0 ? Math.round((doneToday / total) * 100) : 0

  const weekCompleted = weeklyStats.reduce((s, d) => s + d.completed, 0)
  const weekTotal = weeklyStats.reduce((s, d) => s + d.total, 0)
  const weekRate = Math.round((weekCompleted / weekTotal) * 100)
  const bestDay = weeklyStats.reduce((best, d) =>
    d.completed / d.total > best.completed / best.total ? d : best,
  )
  const maxHours = Math.max(...categoryStats.map((c) => c.hours))
  const catTone: Record<string, string> = {
    cyan: "bg-cyan",
    green: "bg-green",
    amber: "bg-amber",
  }

  return (
    <div className="mt-4 flex-1 overflow-y-auto px-5 pb-28">
      {/* Hero streak */}
      <div className="glow-cyan relative overflow-hidden rounded-2xl border border-cyan/40 bg-cyan/10 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-xs text-cyan">STREAK AKTIF</p>
            <p className="mt-1 text-4xl font-bold leading-none">
              {streakDays}
              <span className="ml-1.5 text-lg font-bold text-muted-foreground">hari</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Konsisten tanpa putus. Jangan sampai bolong!
            </p>
          </div>
          <div className="flex size-14 items-center justify-center rounded-2xl border border-amber/40 bg-amber/15">
            <Flame className="size-7 text-amber" />
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        <MiniStat
          icon={<Zap className="size-4 text-cyan" />}
          value={`${todayRate}%`}
          label="Hari Ini"
        />
        <MiniStat
          icon={<Target className="size-4 text-green" />}
          value={`${weekRate}%`}
          label="Minggu Ini"
        />
        <MiniStat
          icon={<Trophy className="size-4 text-amber" />}
          value={bestDay.day}
          label="Hari Terbaik"
        />
      </div>

      {/* Weekly bar chart */}
      <div className="mt-3 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">Riwayat 7 Hari</h3>
          <span className="font-mono text-xs text-muted-foreground">
            {weekCompleted}/{weekTotal} tugas
          </span>
        </div>
        <div className="mt-4 flex items-end justify-between gap-2" style={{ height: 120 }}>
          {weeklyStats.map((d) => {
            const pct = (d.completed / d.total) * 100
            const full = d.completed === d.total
            return (
              <div key={d.day} className="flex h-full flex-1 flex-col items-center gap-2">
                <div className="relative w-full flex-1 overflow-hidden rounded-lg bg-elevated">
                  <div
                    className={`absolute bottom-0 left-0 w-full rounded-lg transition-all ${full ? "bg-green" : "bg-cyan"}`}
                    style={{ height: `${pct}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">{d.day}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="mt-3 rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-bold">Fokus per Kategori</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">Total jam minggu ini</p>
        <ul className="mt-4 flex flex-col gap-3.5">
          {categoryStats.map((c) => (
            <li key={c.label}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{c.label}</span>
                <span className="font-mono text-xs font-bold text-muted-foreground">
                  {c.hours}j
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-elevated">
                <div
                  className={`h-full rounded-full ${catTone[c.tone]}`}
                  style={{ width: `${(c.hours / maxHours) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Motivational note */}
      <div className="mt-3 rounded-2xl border border-green/40 bg-green/10 p-4">
        <p className="text-pretty text-sm leading-relaxed text-green">
          Keren! Penyelesaian tugasmu minggu ini {weekRate}%. Pertahankan streak {streakDays} hari
          dan targetkan hari sempurna berikutnya.
        </p>
      </div>
    </div>
  )
}

function MiniStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="flex size-8 items-center justify-center rounded-lg border border-border bg-elevated">
        {icon}
      </div>
      <p className="mt-2.5 text-lg font-bold leading-none">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{label}</p>
    </div>
  )
}

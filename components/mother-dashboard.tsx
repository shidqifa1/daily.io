"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Check,
  Clock,
  AlertTriangle,
  X,
  Maximize2,
  Radio,
  BarChart3,
  Flame,
  Target,
  Timer,
  TrendingUp,
  LogOut,
} from "lucide-react"
import {
  schedule,
  statusMeta,
  weeklyStats,
  categoryStats,
  streakDays,
  type Task,
} from "@/lib/schedule"

type Tab = "feed" | "stats"

export function MotherDashboard({ onLogout }: { onLogout: () => void }) {
  const [preview, setPreview] = useState<Task | null>(null)
  const [tab, setTab] = useState<Tab>("feed")

  const counts = {
    completed: schedule.filter((t) => t.status === "completed").length,
    pending: schedule.filter((t) => t.status === "pending").length,
    late: schedule.filter((t) => t.status === "late").length,
  }
  const total = schedule.length
  const progress = Math.round((counts.completed / total) * 100)

  return (
    <div className="relative flex min-h-dvh flex-col">
      {/* Header */}
      <header className="px-5 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xs text-muted-foreground">Monitoring · Senin, 7 Jul</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              Jadwal Shidqi
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1.5">
              <span className="size-2 rounded-full bg-cyan pulse-dot" />
              <span className="font-mono text-xs text-cyan">Real-time</span>
            </div>
            <button
              onClick={onLogout}
              aria-label="Log out"
              className="flex size-9 items-center justify-center rounded-full border border-border bg-elevated text-muted-foreground transition-colors active:scale-95 hover:text-foreground"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>

        {/* Daily summary sentence — friendlier, informative */}
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
          Hari ini Shidqi sudah menyelesaikan{" "}
          <span className="font-bold text-green">{counts.completed} dari {total} tugas</span>.
          {counts.late > 0 ? (
            <>
              {" "}
              Ada <span className="font-bold text-amber">{counts.late} tugas terlambat</span> yang perlu perhatian.
            </>
          ) : (
            " Semua berjalan sesuai rencana."
          )}
        </p>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-muted-foreground">Progress Harian</span>
            <span className="font-mono text-xs font-bold text-cyan">{progress}%</span>
          </div>
          <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full bg-cyan transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-5 pt-5">
        <div className="flex gap-2 rounded-2xl border border-border bg-elevated p-1">
          <TabButton
            active={tab === "feed"}
            onClick={() => setTab("feed")}
            icon={<Radio className="size-4" />}
            label="Live Feed"
          />
          <TabButton
            active={tab === "stats"}
            onClick={() => setTab("stats")}
            icon={<BarChart3 className="size-4" />}
            label="Statistik"
          />
        </div>
      </div>

      {tab === "feed" ? (
        <FeedView counts={counts} onPreview={setPreview} />
      ) : (
        <StatsView completedToday={counts.completed} total={total} progress={progress} />
      )}

      {/* Image expand modal */}
      {preview?.proofImage && (
        <div className="absolute inset-0 z-20 flex flex-col justify-center p-5">
          <button
            aria-label="Close preview"
            onClick={() => setPreview(null)}
            className="absolute inset-0 bg-background/85 backdrop-blur-sm"
          />
          <div className="relative overflow-hidden rounded-2xl border border-border-strong bg-elevated">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-mono text-xs text-green">PROOF OF WORK</p>
                <h3 className="font-bold">{preview.title}</h3>
              </div>
              <button
                onClick={() => setPreview(null)}
                aria-label="Close"
                className="rounded-lg border border-border p-1.5 text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <Image
              src={preview.proofImage || "/placeholder.svg"}
              alt={`Full proof of work for ${preview.title}`}
              width={800}
              height={600}
              className="max-h-[55vh] w-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
        active
          ? "bg-cyan text-cyan-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function FeedView({
  counts,
  onPreview,
}: {
  counts: { completed: number; pending: number; late: number }
  onPreview: (t: Task) => void
}) {
  return (
    <>
      {/* Analytics bento */}
      <div className="px-5 pt-4">
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="Selesai"
            value={counts.completed}
            icon={<Check className="size-4" />}
            tone="green"
          />
          <StatCard
            label="Belum"
            value={counts.pending}
            icon={<Clock className="size-4" />}
            tone="muted"
          />
          <StatCard
            label="Terlambat"
            value={counts.late}
            icon={<AlertTriangle className="size-4" />}
            tone="amber"
          />
        </div>
      </div>

      {/* Live feed */}
      <div className="mt-4 flex-1 overflow-y-auto px-5 pb-6">
        <div className="mb-3 flex items-center gap-2">
          <Radio className="size-4 text-cyan" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Live Feed
          </h2>
        </div>

        <ul className="flex flex-col gap-3">
          {schedule.map((task) => {
            const meta = statusMeta[task.status]
            return (
              <li
                key={task.id}
                className={`rounded-2xl border bg-card p-4 ring-1 ring-inset ${meta.ring} ${
                  task.status === "late" ? "flash-amber border-amber" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-mono text-xs text-muted-foreground">
                      {task.start} – {task.end}
                    </span>
                    <h3 className="mt-0.5 text-pretty font-bold leading-tight">
                      {task.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {task.note}
                    </p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border border-current/30 px-2.5 py-1 text-xs font-bold ${meta.text}`}
                  >
                    <span className={`size-1.5 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </span>
                </div>

                {task.status === "completed" && task.proofImage && (
                  <button
                    onClick={() => onPreview(task)}
                    className="group relative mt-3 block w-full overflow-hidden rounded-xl border border-green/40"
                  >
                    <Image
                      src={task.proofImage || "/placeholder.svg"}
                      alt={`Proof of work for ${task.title}`}
                      width={400}
                      height={200}
                      className="h-32 w-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-background/30 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1.5 text-xs font-bold text-foreground">
                        <Maximize2 className="size-3.5" /> Tap to expand
                      </span>
                    </span>
                    <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-green px-2 py-0.5 text-[10px] font-bold text-green-foreground">
                      <Check className="size-3" /> PROOF
                    </span>
                  </button>
                )}

                {task.status === "late" && (
                  <p className="mt-2 text-sm font-medium text-amber">
                    Deadline approaching — no proof submitted yet.
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

function StatsView({
  completedToday,
  total,
  progress,
}: {
  completedToday: number
  total: number
  progress: number
}) {
  const weekCompleted = weeklyStats.reduce((s, d) => s + d.completed, 0)
  const weekTotal = weeklyStats.reduce((s, d) => s + d.total, 0)
  const weekRate = Math.round((weekCompleted / weekTotal) * 100)
  const onTimeRate = 87
  const maxHours = Math.max(...categoryStats.map((c) => c.hours))
  const catTone: Record<string, string> = {
    cyan: "bg-cyan",
    green: "bg-green",
    amber: "bg-amber",
  }

  return (
    <div className="mt-4 flex-1 overflow-y-auto px-5 pb-6">
      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={<Flame className="size-4 text-amber" />}
          value={`${streakDays} hari`}
          label="Streak Aktif"
        />
        <MetricCard
          icon={<Target className="size-4 text-cyan" />}
          value={`${weekRate}%`}
          label="Penyelesaian Minggu Ini"
        />
        <MetricCard
          icon={<Timer className="size-4 text-green" />}
          value={`${onTimeRate}%`}
          label="Tepat Waktu"
        />
        <MetricCard
          icon={<TrendingUp className="size-4 text-cyan" />}
          value={`${completedToday}/${total}`}
          label="Tugas Hari Ini"
        />
      </div>

      {/* Weekly bar chart */}
      <div className="mt-4 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">Aktivitas 7 Hari Terakhir</h3>
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
      <div className="mt-4 rounded-2xl border border-border bg-card p-4">
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

      {/* Encouraging note */}
      <div className="mt-4 rounded-2xl border border-green/40 bg-green/10 p-4">
        <p className="text-pretty text-sm leading-relaxed text-green">
          Shidqi konsisten {streakDays} hari berturut-turut. Pertahankan ritme belajar dan
          olahraganya — performanya di atas rata-rata minggu lalu.
        </p>
      </div>
    </div>
  )
}

function MetricCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex size-9 items-center justify-center rounded-xl border border-border bg-elevated">
        {icon}
      </div>
      <p className="mt-3 text-xl font-bold leading-none">{value}</p>
      <p className="mt-1.5 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string
  value: number
  icon: React.ReactNode
  tone: "green" | "amber" | "muted"
}) {
  const tones = {
    green: "border-green/40 bg-green/10 text-green",
    amber: "border-amber/40 bg-amber/10 text-amber",
    muted: "border-border-strong bg-elevated text-muted-foreground",
  }
  return (
    <div className={`rounded-2xl border p-3 ${tones[tone]}`}>
      <div className="flex items-center justify-between">
        {icon}
        <span className="text-2xl font-bold leading-none text-foreground">
          {value}
        </span>
      </div>
      <p className="mt-2 text-xs font-bold uppercase tracking-wide">{label}</p>
    </div>
  )
}

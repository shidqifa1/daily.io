"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Sparkles,
  Camera,
  Check,
  Pencil,
  X,
  ChevronRight,
  Zap,
  AlertTriangle,
  LogOut,
  CalendarDays,
  BarChart3,
  Settings as SettingsIcon,
  Wand2,
} from "lucide-react"
import { schedule as initialSchedule, statusMeta, type Task } from "@/lib/schedule"
import { TimeChip } from "@/components/time-chip"
import { ChildStats } from "@/components/child-stats"
import { SettingsView } from "@/components/settings-view"

type GeneratedTask = { start: string; end: string; title: string; note: string }
type ChildTab = "timeline" | "stats" | "settings"

export function ChildDashboard({ onLogout }: { onLogout: () => void }) {
  const [tasks, setTasks] = useState<Task[]>(initialSchedule)
  const [tab, setTab] = useState<ChildTab>("timeline")
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Task | null>(null)
  // Draft schedule awaiting user review — does NOT overwrite until accepted.
  const [draft, setDraft] = useState<Task[] | null>(null)

  async function handleGenerate(prompt: string) {
    setGenerating(true)
    setGenError(null)
    try {
      const res = await fetch("/api/generate-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Gagal membuat jadwal.")

      const generated: Task[] = (data.tasks as GeneratedTask[]).map((t, i) => ({
        id: `gen-${Date.now()}-${i}`,
        start: t.start,
        end: t.end,
        title: t.title,
        note: t.note,
        status: "pending",
      }))

      if (generated.length === 0) throw new Error("AI tidak menghasilkan jadwal.")

      // Stage as draft for review instead of applying immediately.
      setDraft(generated)
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Terjadi kesalahan.")
    } finally {
      setGenerating(false)
    }
  }

  function acceptDraft() {
    if (draft) setTasks(draft)
    setDraft(null)
  }

  function submitProof(id: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: "completed", proofImage: "/proof-math.png" }
          : t,
      ),
    )
  }

  function saveEdit(updated: Task) {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    setEditing(null)
  }

  return (
    <div className="relative flex min-h-dvh flex-col">
      {/* Header */}
      <header className="px-5 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xs text-muted-foreground">Monday · Jul 7</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Hey, Shidqi</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-cyan/40 bg-cyan/10">
              <Zap className="size-5 text-cyan" />
            </div>
            <button
              onClick={onLogout}
              aria-label="Log out"
              className="flex size-11 items-center justify-center rounded-2xl border border-border bg-elevated text-muted-foreground transition-colors active:scale-95 hover:text-foreground"
            >
              <LogOut className="size-5" />
            </button>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border-strong bg-elevated px-3 py-1.5">
          <span className="size-2 rounded-full bg-green pulse-dot" />
          <span className="font-mono text-xs text-muted-foreground">
            7th Grade Student · Entrepreneur
          </span>
        </div>
      </header>

      {/* Tab content */}
      {tab === "timeline" && (
        <TimelineView
          tasks={tasks}
          generating={generating}
          genError={genError}
          onGenerate={handleGenerate}
          onEdit={setEditing}
          onSubmitProof={submitProof}
        />
      )}
      {tab === "stats" && <ChildStats tasks={tasks} />}
      {tab === "settings" && <SettingsView />}

      {/* Bottom navigation */}
      <BottomNav tab={tab} setTab={setTab} />

      {/* AI review overlay */}
      {draft && (
        <ReviewSheet
          draft={draft}
          onAccept={acceptDraft}
          onDiscard={() => setDraft(null)}
        />
      )}

      {/* Edit bottom sheet */}
      {editing && (
        <EditSheet task={editing} onClose={() => setEditing(null)} onSave={saveEdit} />
      )}
    </div>
  )
}

function TimelineView({
  tasks,
  generating,
  genError,
  onGenerate,
  onEdit,
  onSubmitProof,
}: {
  tasks: Task[]
  generating: boolean
  genError: string | null
  onGenerate: (prompt: string) => void
  onEdit: (t: Task) => void
  onSubmitProof: (id: string) => void
}) {
  return (
    <div className="flex-1 overflow-y-auto px-5 pb-28 pt-5">
      <AiPlanner generating={generating} error={genError} onGenerate={onGenerate} />

      <div className="mb-3 mt-6 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Today&apos;s Timeline
        </h2>
        <span className="font-mono text-xs text-cyan">{tasks.length} blocks</span>
      </div>

      <ul className="flex flex-col gap-3">
        {tasks.map((task) => {
          const meta = statusMeta[task.status]
          return (
            <li
              key={task.id}
              className={`rounded-2xl border bg-card p-3.5 ring-1 ring-inset ${meta.ring} ${
                task.status === "late" ? "flash-amber border-amber" : "border-border"
              }`}
            >
              <div className="flex gap-3.5">
                <TimeChip start={task.start} end={task.end} accent={task.status === "pending"} />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-pretty font-bold leading-tight">{task.title}</h3>
                    <button
                      onClick={() => onEdit(task)}
                      aria-label={`Edit ${task.title}`}
                      className="shrink-0 rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {task.note}
                  </p>

                  <div className="mt-3">
                    {task.status === "completed" ? (
                      <div className="flex items-center gap-2.5 rounded-xl border border-green/40 bg-green/10 p-2">
                        {task.proofImage && (
                          <Image
                            src={task.proofImage || "/placeholder.svg"}
                            alt={`Proof for ${task.title}`}
                            width={44}
                            height={44}
                            className="size-11 shrink-0 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex items-center gap-1.5 text-green">
                          <Check className="size-4" />
                          <span className="text-sm font-bold">Selesai</span>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => onSubmitProof(task.id)}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-transform active:scale-[0.98] ${
                          task.status === "late"
                            ? "border-amber bg-amber/15 text-amber"
                            : "border-cyan/50 bg-cyan/10 text-cyan"
                        }`}
                      >
                        <Camera className="size-4" />
                        Submit Proof of Work
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function AiPlanner({
  generating,
  error,
  onGenerate,
}: {
  generating: boolean
  error: string | null
  onGenerate: (prompt: string) => void
}) {
  const [text, setText] = useState("")

  const examples = [
    "Hari ini mau lebih banyak fokus latihan basket dan kurangi waktu sepedaan.",
    "Bangun jam 5, sekolah jam 8-2, ada ulangan fisika, sorenya stok ulang gula aren karena ada orderan besar, malamnya coding.",
  ]

  return (
    <section className="rounded-2xl border border-cyan/40 bg-cyan/5 p-4">
      <div className="flex items-center gap-2">
        <Wand2 className="size-5 text-cyan" />
        <h2 className="text-base font-bold">AI Planner</h2>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        Ceritakan rencana & kejadian tak terduga hari ini. Gemini menyusun draft jadwal
        untuk kamu tinjau dulu.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={generating}
        rows={4}
        placeholder="Contoh: Hari ini mau lebih banyak fokus latihan basket dan kurangi waktu sepedaan…"
        className="mt-3 w-full resize-none rounded-xl border border-border-strong bg-card px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-cyan disabled:opacity-60"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {examples.map((ex, i) => (
          <button
            key={i}
            type="button"
            disabled={generating}
            onClick={() => setText(ex)}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-cyan/50 hover:text-foreground disabled:opacity-60"
          >
            Contoh {i + 1}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber/40 bg-amber/10 px-3 py-2.5 text-sm text-amber">
          <AlertTriangle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={() => onGenerate(text)}
        disabled={generating || text.trim().length === 0}
        className={`glow-cyan relative mt-4 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-cyan px-5 py-3.5 font-bold text-cyan-foreground transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
          generating ? "opacity-90" : ""
        }`}
      >
        {generating && <span className="shimmer absolute inset-0" />}
        <Sparkles className={`size-5 ${generating ? "animate-spin" : ""}`} />
        <span className="text-[15px] tracking-tight">
          {generating ? "Menyusun draft…" : "Generate Jadwal"}
        </span>
      </button>
    </section>
  )
}

function ReviewSheet({
  draft,
  onAccept,
  onDiscard,
}: {
  draft: Task[]
  onAccept: () => void
  onDiscard: () => void
}) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end">
      <button
        aria-label="Tutup"
        onClick={onDiscard}
        className="absolute inset-0 bg-background/75 backdrop-blur-sm"
      />
      <div className="relative flex max-h-[88%] flex-col rounded-t-2xl border-t border-cyan/40 bg-elevated pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="px-5 pt-4">
          <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border-strong" />
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-cyan" />
            <h3 className="text-lg font-bold">Tinjau Draft Jadwal</h3>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            AI menyusun {draft.length} blok waktu. Jadwal lamamu belum berubah — terapkan
            atau buang draft ini.
          </p>
        </div>

        {/* Draft list */}
        <ul className="mt-4 flex-1 space-y-2.5 overflow-y-auto px-5">
          {draft.map((t, i) => (
            <li
              key={t.id}
              className="flex gap-3 rounded-xl border border-border bg-card p-3"
            >
              <div className="flex flex-col items-center">
                <span className="flex size-6 items-center justify-center rounded-full bg-cyan/15 font-mono text-[11px] font-bold text-cyan">
                  {i + 1}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan">
                    {t.start}–{t.end}
                  </span>
                </div>
                <h4 className="mt-0.5 text-pretty font-bold leading-tight">{t.title}</h4>
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {t.note}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="mt-4 flex gap-3 px-5">
          <button
            onClick={onDiscard}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border-strong bg-card px-4 py-3.5 font-bold text-muted-foreground transition-transform active:scale-[0.98] hover:text-foreground"
          >
            <X className="size-4" />
            Buang
          </button>
          <button
            onClick={onAccept}
            className="glow-cyan flex flex-[1.4] items-center justify-center gap-2 rounded-2xl bg-cyan px-4 py-3.5 font-bold text-cyan-foreground transition-transform active:scale-[0.98]"
          >
            <Check className="size-4" />
            Terapkan Jadwal
          </button>
        </div>
      </div>
    </div>
  )
}

function BottomNav({
  tab,
  setTab,
}: {
  tab: ChildTab
  setTab: (t: ChildTab) => void
}) {
  const items: { key: ChildTab; label: string; icon: React.ReactNode }[] = [
    { key: "timeline", label: "Timeline", icon: <CalendarDays className="size-5" /> },
    { key: "stats", label: "My Stats", icon: <BarChart3 className="size-5" /> },
    { key: "settings", label: "Settings", icon: <SettingsIcon className="size-5" /> },
  ]
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/90 px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {items.map((it) => {
          const active = tab === it.key
          return (
            <button
              key={it.key}
              onClick={() => setTab(it.key)}
              aria-current={active ? "page" : undefined}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 transition-colors ${
                active ? "text-cyan" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {it.icon}
              <span className="text-[11px] font-bold tracking-tight">{it.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function EditSheet({
  task,
  onClose,
  onSave,
}: {
  task: Task
  onClose: () => void
  onSave: (t: Task) => void
}) {
  const [draft, setDraft] = useState(task)

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end">
      <button
        aria-label="Close editor"
        onClick={onClose}
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
      />
      <div className="relative rounded-t-2xl border-t border-border-strong bg-elevated p-5 pb-7">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border-strong" />
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Quick Edit</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg border border-border p-1.5 text-muted-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <div>
            <label className="font-mono text-xs text-muted-foreground">TASK NAME</label>
            <input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-border-strong bg-card px-4 py-3 font-bold text-foreground outline-none focus:border-cyan"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="font-mono text-xs text-muted-foreground">START</label>
              <input
                value={draft.start}
                onChange={(e) => setDraft({ ...draft, start: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-border-strong bg-card px-4 py-3 font-mono font-bold text-foreground outline-none focus:border-cyan"
              />
            </div>
            <div className="flex-1">
              <label className="font-mono text-xs text-muted-foreground">END</label>
              <input
                value={draft.end}
                onChange={(e) => setDraft({ ...draft, end: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-border-strong bg-card px-4 py-3 font-mono font-bold text-foreground outline-none focus:border-cyan"
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => onSave(draft)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan px-5 py-3.5 font-bold text-cyan-foreground transition-transform active:scale-[0.98]"
        >
          Sync Changes
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

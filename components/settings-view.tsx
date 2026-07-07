"use client"

import { useState } from "react"
import {
  KeyRound,
  Eye,
  EyeOff,
  Flame,
  Bell,
  BellRing,
  Database,
  Check,
} from "lucide-react"

type NotifKey = "reminders" | "proofAlerts" | "weeklyReport"

const firebaseFields: { key: string; label: string; placeholder: string }[] = [
  { key: "apiKey", label: "API KEY", placeholder: "AIzaSy..." },
  { key: "authDomain", label: "AUTH DOMAIN", placeholder: "daily-io.firebaseapp.com" },
  { key: "projectId", label: "PROJECT ID", placeholder: "daily-io" },
  { key: "appId", label: "APP ID", placeholder: "1:1234567890:web:abc123" },
]

export function SettingsView() {
  const [geminiKey, setGeminiKey] = useState("")
  const [showGemini, setShowGemini] = useState(false)
  const [firebase, setFirebase] = useState<Record<string, string>>({})
  const [notifs, setNotifs] = useState<Record<NotifKey, boolean>>({
    reminders: true,
    proofAlerts: true,
    weeklyReport: false,
  })
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="mt-4 flex-1 overflow-y-auto px-5 pb-28">
      {/* Gemini API */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl border border-cyan/40 bg-cyan/10">
            <Flame className="size-4 text-cyan" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Gemini AI</h3>
            <p className="text-xs text-muted-foreground">Kunci untuk penyusun jadwal</p>
          </div>
        </div>

        <label className="mt-4 block font-mono text-xs text-muted-foreground">
          GEMINI API KEY
        </label>
        <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-border-strong bg-elevated px-3.5 py-3 transition-colors focus-within:border-cyan">
          <KeyRound className="size-4 shrink-0 text-muted-foreground" />
          <input
            type={showGemini ? "text" : "password"}
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            placeholder="••••••••••••••••"
            className="w-full bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
          />
          <button
            type="button"
            onClick={() => setShowGemini((s) => !s)}
            aria-label={showGemini ? "Sembunyikan API key" : "Tampilkan API key"}
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showGemini ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </section>

      {/* Firebase config */}
      <section className="mt-4 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl border border-amber/40 bg-amber/10">
            <Database className="size-4 text-amber" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Firebase</h3>
            <p className="text-xs text-muted-foreground">Konfigurasi sinkronisasi data</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {firebaseFields.map((f) => (
            <div key={f.key}>
              <label className="block font-mono text-xs text-muted-foreground">
                {f.label}
              </label>
              <input
                value={firebase[f.key] ?? ""}
                onChange={(e) =>
                  setFirebase((prev) => ({ ...prev, [f.key]: e.target.value }))
                }
                placeholder={f.placeholder}
                className="mt-1.5 w-full rounded-xl border border-border-strong bg-elevated px-3.5 py-2.5 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-cyan"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="mt-4 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl border border-green/40 bg-green/10">
            <Bell className="size-4 text-green" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Notifikasi</h3>
            <p className="text-xs text-muted-foreground">Atur pengingat & peringatan</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <ToggleRow
            label="Pengingat Jadwal"
            desc="Notifikasi sebelum tiap blok waktu dimulai"
            checked={notifs.reminders}
            onChange={() => setNotifs((n) => ({ ...n, reminders: !n.reminders }))}
          />
          <ToggleRow
            label="Peringatan Proof of Work"
            desc="Ingatkan bila belum submit bukti tugas"
            checked={notifs.proofAlerts}
            onChange={() => setNotifs((n) => ({ ...n, proofAlerts: !n.proofAlerts }))}
          />
          <ToggleRow
            label="Laporan Mingguan"
            desc="Ringkasan performa tiap akhir pekan"
            checked={notifs.weeklyReport}
            onChange={() => setNotifs((n) => ({ ...n, weeklyReport: !n.weeklyReport }))}
          />
        </div>
      </section>

      {/* Save */}
      <button
        onClick={handleSave}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan px-5 py-3.5 font-bold text-cyan-foreground transition-transform active:scale-[0.98]"
      >
        {saved ? (
          <>
            <Check className="size-4" />
            Tersimpan
          </>
        ) : (
          <>
            <BellRing className="size-4" />
            Simpan Pengaturan
          </>
        )}
      </button>
    </div>
  )
}

function ToggleRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string
  desc: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-3 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-bold">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors ${
          checked ? "border-cyan bg-cyan" : "border-border-strong bg-elevated"
        }`}
      >
        <span
          className={`absolute top-0.5 size-4 rounded-full transition-all ${
            checked
              ? "left-[calc(100%-1.25rem)] bg-cyan-foreground"
              : "left-0.5 bg-muted-foreground"
          }`}
        />
      </button>
    </div>
  )
}

"use client"

import { useState } from "react"
import { User, ShieldCheck, ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react"

export type Role = "child" | "mother"

export function LoginScreen({ onLogin }: { onLogin: (role: Role) => void }) {
  const [role, setRole] = useState<Role>("child")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    // Simulated auth latency for a native app feel.
    setTimeout(() => {
      onLogin(role)
    }, 550)
  }

  return (
    <div className="flex min-h-dvh flex-col justify-center px-6 py-10">
      {/* Brand */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-cyan/40 bg-cyan/10">
          <span className="text-2xl font-bold text-cyan">d</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">
          daily<span className="text-cyan">.io</span>
        </h1>
        <p className="mt-1.5 font-mono text-xs text-muted-foreground">
          AI Daily Tracker · Proof of Work
        </p>
      </div>

      {/* Login card */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-[1.75rem] border border-border bg-card p-5"
      >
        {/* Role selection segmented control */}
        <div>
          <label className="font-mono text-xs text-muted-foreground">MASUK SEBAGAI</label>
          <div className="mt-2 grid grid-cols-2 gap-2 rounded-2xl border border-border bg-elevated p-1.5">
            <RoleOption
              active={role === "child"}
              onClick={() => setRole("child")}
              icon={<User className="size-4" />}
              title="Anak"
              subtitle="Doer"
            />
            <RoleOption
              active={role === "mother"}
              onClick={() => setRole("mother")}
              icon={<ShieldCheck className="size-4" />}
              title="Ibu"
              subtitle="Monitor"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="font-mono text-xs text-muted-foreground">
            EMAIL
          </label>
          <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-border-strong bg-elevated px-3.5 py-3 transition-colors focus-within:border-cyan">
            <Mail className="size-4 shrink-0 text-muted-foreground" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kamu@daily.io"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="font-mono text-xs text-muted-foreground">
            PASSWORD
          </label>
          <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-border-strong bg-elevated px-3.5 py-3 transition-colors focus-within:border-cyan">
            <Lock className="size-4 shrink-0 text-muted-foreground" />
            <input
              id="password"
              type={showPass ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              aria-label={showPass ? "Sembunyikan password" : "Tampilkan password"}
              className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Sign in button */}
        <button
          type="submit"
          disabled={submitting}
          className="glow-cyan relative mt-1 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-cyan px-5 py-4 font-bold text-cyan-foreground transition-transform active:scale-[0.97] disabled:opacity-80"
        >
          {submitting && <span className="shimmer absolute inset-0" />}
          <span className="text-[15px] tracking-tight">
            {submitting ? "Masuk…" : "Sign In"}
          </span>
          {!submitting && <ArrowRight className="size-4" />}
        </button>
      </form>

      <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
        Belum punya akun?{" "}
        <span className="font-bold text-cyan">Hubungi keluargamu untuk undangan.</span>
      </p>
    </div>
  )
}

function RoleOption({
  active,
  onClick,
  icon,
  title,
  subtitle,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2.5 rounded-xl px-3 py-3 transition-all active:scale-[0.97] ${
        active
          ? "bg-cyan text-cyan-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <span
        className={`flex size-8 items-center justify-center rounded-lg ${
          active ? "bg-cyan-foreground/10" : "border border-border-strong bg-card"
        }`}
      >
        {icon}
      </span>
      <span className="text-left">
        <span className="block text-sm font-bold leading-none">{title}</span>
        <span
          className={`block text-[11px] leading-none ${
            active ? "text-cyan-foreground/70" : "text-muted-foreground"
          }`}
        >
          {subtitle}
        </span>
      </span>
    </button>
  )
}

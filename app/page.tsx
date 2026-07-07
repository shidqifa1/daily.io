"use client"

import { useState } from "react"
import { User, ShieldCheck } from "lucide-react"
import { ChildDashboard } from "@/components/child-dashboard"
import { MotherDashboard } from "@/components/mother-dashboard"

type Role = "child" | "mother"

export default function Page() {
  const [role, setRole] = useState<Role>("child")

  return (
    <main className="min-h-dvh bg-background px-4 py-8">
      <div className="mx-auto flex max-w-md flex-col items-center">
        {/* Brand */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            daily<span className="text-cyan">.io</span>
          </h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            AI Daily Tracker · Proof of Work
          </p>
        </div>

        {/* Role switcher */}
        <div className="mb-6 grid w-full grid-cols-2 gap-2 rounded-2xl border border-border bg-card p-1.5">
          <RoleButton
            active={role === "child"}
            onClick={() => setRole("child")}
            icon={<User className="size-4" />}
            label="Child · Doer"
          />
          <RoleButton
            active={role === "mother"}
            onClick={() => setRole("mother")}
            icon={<ShieldCheck className="size-4" />}
            label="Mother · Monitor"
          />
        </div>

        {/* Phone frame */}
        <div className="w-full rounded-[2.5rem] border-4 border-border-strong bg-background p-2 shadow-2xl">
          <div className="relative h-[720px] overflow-hidden rounded-[2rem] border border-border bg-background">
            {/* notch */}
            <div className="pointer-events-none absolute left-1/2 top-2 z-30 h-6 w-28 -translate-x-1/2 rounded-full bg-border-strong/60" />
            {role === "child" ? <ChildDashboard /> : <MotherDashboard />}
          </div>
        </div>
      </div>
    </main>
  )
}

function RoleButton({
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
      className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
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

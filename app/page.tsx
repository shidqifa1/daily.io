"use client"

import { useState } from "react"
import { ChildDashboard } from "@/components/child-dashboard"
import { MotherDashboard } from "@/components/mother-dashboard"
import { LoginScreen, type Role } from "@/components/login-screen"

export default function Page() {
  const [session, setSession] = useState<Role | null>(null)

  return (
    <main className="min-h-dvh bg-background">
      {session === null && <LoginScreen onLogin={(role) => setSession(role)} />}
      {session === "child" && <ChildDashboard onLogout={() => setSession(null)} />}
      {session === "mother" && <MotherDashboard onLogout={() => setSession(null)} />}
    </main>
  )
}

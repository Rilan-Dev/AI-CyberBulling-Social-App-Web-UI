"use client"

import { ProtectedRoute } from "@/components/protected-route"
import SettingsForm from "@/components/settings-form"

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsForm />
    </ProtectedRoute>
  )
}

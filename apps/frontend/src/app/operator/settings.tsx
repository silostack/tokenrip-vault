import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '@/components/operator/SettingsPage'

export const Route = createFileRoute('/operator/settings')({
  component: SettingsPage,
})

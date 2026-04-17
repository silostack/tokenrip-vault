import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '@/components/LoginPage'

export const Route = createFileRoute('/link')({
  head: () => ({
    meta: [
      { title: 'Link Agent — Tokenrip' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: LoginPage,
})

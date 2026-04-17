import { createFileRoute } from '@tanstack/react-router'
import { LinkPage } from '@/components/LinkPage'

export const Route = createFileRoute('/link')({
  head: () => ({
    meta: [
      { title: 'Link Agent — Tokenrip' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: LinkPage,
})

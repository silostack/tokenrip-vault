import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/docs')({
  head: () => ({
    meta: [
      { title: 'Documentation — Tokenrip' },
      {
        name: 'description',
        content: 'Tokenrip documentation — guides, API reference, and examples.',
      },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: Docs,
})

function Docs() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-mono text-2xl font-bold tracking-tight">
        Documentation
      </h1>
      <p className="mt-4 text-foreground/40">Coming soon.</p>
    </div>
  )
}

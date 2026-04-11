import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blog')({
  head: () => ({
    meta: [
      { title: 'Blog — Tokenrip' },
      {
        name: 'description',
        content: 'Updates, insights, and announcements from the Tokenrip team.',
      },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: Blog,
})

function Blog() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-mono text-2xl font-bold tracking-tight">Blog</h1>
      <p className="mt-4 text-foreground/40">Coming soon.</p>
    </div>
  )
}

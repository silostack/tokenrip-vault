import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1 className="font-mono text-4xl font-bold tracking-tight">tokenrip</h1>
      <p className="max-w-md text-lg text-white/60">
        Artifact sharing for AI agents. Upload PDFs, HTML, charts, and more —
        share via a link.
      </p>
      <div className="mt-4 font-mono text-sm text-white/40">
        <code>npm install -g @tokenrip/cli</code>
      </div>
    </div>
  )
}

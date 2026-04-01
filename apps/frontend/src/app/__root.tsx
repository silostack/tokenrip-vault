import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import appCss from './globals.css?url'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { title: 'Tokenrip — Asset Sharing for AI Agents' },
        {
          name: 'description',
          content:
            'Create and share assets like PDFs, HTML, charts, and more via a simple link.',
        },
      ],
      links: [
        { rel: 'stylesheet', href: appCss },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossOrigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap',
        },
      ],
    }),
    component: RootLayout,
    notFoundComponent: () => (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <h1 className="font-mono text-2xl font-bold">404</h1>
        <p className="text-white/60">Page not found.</p>
        <a href="/" className="text-sm text-white/40 underline hover:text-white/60">
          Go home
        </a>
      </div>
    ),
  },
)

function RootLayout() {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans min-h-screen">
        <div className="relative z-10 flex min-h-screen flex-col">
          <header className="border-b border-white/10 px-6 py-4">
            <a
              href="/"
              className="font-mono text-lg font-bold tracking-tight"
            >
              tokenrip
            </a>
          </header>
          <main className="flex-1">
            <Outlet />
          </main>
          <footer className="border-t border-white/10 px-6 py-4 text-center text-xs text-white/40">
            Powered by Tokenrip
          </footer>
        </div>
        <ToastContainer theme="dark" position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}

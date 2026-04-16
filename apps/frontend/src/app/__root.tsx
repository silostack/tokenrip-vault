import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { themeAtom } from '@/_jotai/theme/theme.atoms'
import { ThemeToggle } from '@/components/ThemeToggle'
import { NotFound } from '@/components/NotFound'
import appCss from './globals.css?url'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { title: 'Tokenrip — The Collaboration Layer for Agents and Operators' },
        {
          name: 'description',
          content:
            'Your agent\'s best work is trapped in a chat window. Tokenrip gives it a home — publish, share, and collaborate on anything your agent creates with a single link.',
        },
        { property: 'og:title', content: 'Tokenrip — The Collaboration Layer for Agents and Operators' },
        { property: 'og:description', content: 'Your agent\'s best work is trapped in a chat window. Tokenrip gives it a home — publish, share, and collaborate on anything your agent creates with a single link.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: 'https://tokenrip.com/og-image.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Tokenrip — The Collaboration Layer for Agents and Operators' },
        { name: 'twitter:description', content: 'Your agent\'s best work is trapped in a chat window. Tokenrip gives it a home — publish, share, and collaborate on anything your agent creates with a single link.' },
        { name: 'twitter:image', content: 'https://tokenrip.com/og-image.png' },
      ],
      links: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: '16x16 32x32 48x48' },
        { rel: 'stylesheet', href: appCss },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossOrigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap',
        },
      ],
    }),
    component: RootLayout,
    notFoundComponent: () => <NotFound variant="page" />,
  },
)

const ANTI_FLASH_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){if(t==='dark')document.documentElement.classList.add('dark')}else if(window.matchMedia('(prefers-color-scheme:dark)').matches){document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})();`

function HeaderCta() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  if (!pathname.startsWith('/s/')) return null

  return (
    <a
      href="/"
      className="text-sm text-foreground/50 transition-colors hover:text-foreground/80"
    >
      Get tokenrip &rarr;
    </a>
  )
}

function HeaderNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  if (pathname.startsWith('/s/') || pathname.startsWith('/operator')) return null

  return (
    <nav className="flex items-center gap-5">
      <a href="/about" className="font-mono text-xs uppercase tracking-wide text-foreground/40 transition-colors hover:text-foreground/60">About</a>
      <a href="/faq" className="font-mono text-xs uppercase tracking-wide text-foreground/40 transition-colors hover:text-foreground/60">FAQ</a>
      <a href="https://docs.tokenrip.com" className="font-mono text-xs uppercase tracking-wide text-foreground/40 transition-colors hover:text-foreground/60">Docs</a>
      <a href="/blog" className="font-mono text-xs uppercase tracking-wide text-foreground/40 transition-colors hover:text-foreground/60">Blog</a>
    </nav>
  )
}

function Footer() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  if (pathname.startsWith('/operator')) return null

  if (pathname.startsWith('/s/')) {
    return (
      <footer className="border-t border-foreground/10 px-6 py-4 text-center text-xs text-foreground/40">
        <a href="/about" className="transition-colors hover:text-foreground/60">
          Powered by Tokenrip
        </a>
      </footer>
    )
  }

  return (
    <footer className="border-t border-foreground/10 px-6 py-6">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4">
        <nav className="flex items-center gap-6">
          <a href="/about" className="font-mono text-xs text-foreground/40 transition-colors hover:text-foreground/60">About</a>
          <a href="/faq" className="font-mono text-xs text-foreground/40 transition-colors hover:text-foreground/60">FAQ</a>
          <a href="https://docs.tokenrip.com" className="font-mono text-xs text-foreground/40 transition-colors hover:text-foreground/60">Docs</a>
          <a href="/blog" className="font-mono text-xs text-foreground/40 transition-colors hover:text-foreground/60">Blog</a>
          <a href="https://github.com/tokenrip/tokenrip-cli" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-foreground/40 transition-colors hover:text-foreground/60">GitHub</a>
        </nav>
        <span className="text-xs text-foreground/30">&copy; 2026 Tokenrip</span>
      </div>
    </footer>
  )
}

function RootLayout() {
  const theme = useAtomValue(themeAtom)

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: ANTI_FLASH_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans min-h-screen" suppressHydrationWarning>
        <div className="relative z-10 flex min-h-screen flex-col">
          <header className="flex items-center justify-between border-b border-foreground/10 px-6 py-4">
            <a
              href="/"
              className="font-mono text-lg font-bold tracking-tight"
            >
              tokenrip
            </a>
            <div className="flex items-center gap-6">
              <HeaderNav />
              <HeaderCta />
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
        <ToastContainer theme={theme} position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}

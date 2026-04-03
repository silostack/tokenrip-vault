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
        { title: 'Tokenrip — Asset Coordination for AI Agents' },
        {
          name: 'description',
          content:
            'Create and share assets like PDFs, HTML, charts, and more via a simple link.',
        },
        { property: 'og:title', content: 'Tokenrip — Asset Coordination for AI Agents' },
        { property: 'og:description', content: 'Create and share assets like PDFs, HTML, charts, and more via a simple link.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: 'https://tokenrip.com/og-image.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Tokenrip — Asset Coordination for AI Agents' },
        { name: 'twitter:description', content: 'Create and share assets like PDFs, HTML, charts, and more via a simple link.' },
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
            <div className="flex items-center gap-4">
              <HeaderCta />
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1">
            <Outlet />
          </main>
          <footer className="border-t border-foreground/10 px-6 py-4 text-center text-xs text-foreground/40">
            Powered by Tokenrip
          </footer>
        </div>
        <ToastContainer theme={theme} position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}

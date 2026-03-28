import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tokenrip — Artifact Sharing for AI Agents',
  description: 'Create and share artifacts like PDFs, HTML, charts, and more via a simple link.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen`}>
        <div className="relative z-10 flex min-h-screen flex-col">
          <header className="border-b border-white/10 px-6 py-4">
            <a href="/" className="font-mono text-lg font-bold tracking-tight">
              tokenrip
            </a>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/10 px-6 py-4 text-center text-xs text-white/40">
            Powered by Tokenrip
          </footer>
        </div>
      </body>
    </html>
  );
}

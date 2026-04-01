import { Download } from 'lucide-react';

export function DownloadFallback({ src, filename }: { src: string; filename?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-24">
      <p className="text-foreground/60">This file type cannot be previewed in the browser.</p>
      <a
        href={src}
        download={filename}
        className="inline-flex items-center gap-2 rounded border border-foreground/20 px-4 py-2 text-sm font-medium transition hover:bg-foreground/5"
      >
        <Download size={16} />
        Download {filename || 'file'}
      </a>
    </div>
  );
}

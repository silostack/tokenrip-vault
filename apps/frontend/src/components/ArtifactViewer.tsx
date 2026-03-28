import { useEffect, useState } from 'react';
import { getArtifactContentUrl } from '@/lib/api';
import type { ArtifactMetadata } from '@/lib/api';
import { MarkdownViewer } from './viewers/MarkdownViewer';
import { HtmlViewer } from './viewers/HtmlViewer';
import { ImageViewer } from './viewers/ImageViewer';
import { PdfViewer } from './viewers/PdfViewer';
import { DownloadFallback } from './viewers/DownloadFallback';

export function ArtifactViewer({ artifact }: { artifact: ArtifactMetadata }) {
  const contentUrl = getArtifactContentUrl(artifact.id);
  const [textContent, setTextContent] = useState<string | null>(null);

  const needsTextContent = artifact.type === 'markdown' || artifact.type === 'html' || artifact.type === 'chart';

  useEffect(() => {
    if (!needsTextContent) return;
    fetch(contentUrl)
      .then((res) => res.text())
      .then(setTextContent);
  }, [contentUrl, needsTextContent]);

  if (needsTextContent && textContent === null) {
    return <div className="flex items-center justify-center py-24 text-white/40">Loading...</div>;
  }

  if (artifact.type === 'markdown') {
    return <MarkdownViewer content={textContent!} />;
  }

  if (artifact.type === 'html') {
    return <HtmlViewer content={textContent!} />;
  }

  if (artifact.type === 'chart') {
    return (
      <div className="px-6 py-8 text-white/60">
        Chart rendering coming soon. <a href={contentUrl} className="underline">Download raw data</a>
      </div>
    );
  }

  if (artifact.mimeType?.startsWith('image/')) {
    return <ImageViewer src={contentUrl} alt={artifact.title} />;
  }

  if (artifact.mimeType === 'application/pdf') {
    return <PdfViewer src={contentUrl} />;
  }

  return <DownloadFallback src={contentUrl} filename={artifact.title} />;
}

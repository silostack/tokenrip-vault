import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { getAssetContentUrl, getVersionContentUrl } from '@/lib/api';
import type { AssetMetadata } from '@/lib/api';
import { MarkdownViewer } from './viewers/MarkdownViewer';
import { HtmlViewer } from './viewers/HtmlViewer';
import { CodeViewer } from './viewers/CodeViewer';
import { PlainTextViewer } from './viewers/PlainTextViewer';
import { JsonViewer } from './viewers/JsonViewer';
import { ImageViewer } from './viewers/ImageViewer';
import { PdfViewer } from './viewers/PdfViewer';
import { DownloadFallback } from './viewers/DownloadFallback';
import { CollectionViewer } from './viewers/CollectionViewer';
import type { CollectionRow } from '@/lib/collection';

export function AssetViewer({ asset, versionId, initialContent, initialRows, initialNextCursor }: { asset: AssetMetadata; versionId?: string; initialContent?: string; initialRows?: CollectionRow[]; initialNextCursor?: string | null }) {
  const contentUrl = versionId
    ? getVersionContentUrl(asset.id, versionId)
    : getAssetContentUrl(asset.id);
  const [textContent, setTextContent] = useState<string | null>(initialContent ?? null);

  if (asset.type === 'collection') {
    return <CollectionViewer asset={asset} initialRows={initialRows} initialNextCursor={initialNextCursor} />;
  }

  const needsTextContent = asset.type === 'markdown' || asset.type === 'html' || asset.type === 'chart' || asset.type === 'code' || asset.type === 'text' || asset.type === 'json';

  useEffect(() => {
    if (!needsTextContent || initialContent != null) return;
    api.get(contentUrl, { responseType: 'text', baseURL: '' })
      .then((res) => setTextContent(res.data));
  }, [contentUrl, needsTextContent]);

  if (needsTextContent && textContent === null) {
    return <div className="flex items-center justify-center py-24 text-foreground/40">Loading...</div>;
  }

  if (asset.type === 'markdown') {
    return <MarkdownViewer content={textContent!} />;
  }

  if (asset.type === 'html') {
    return <HtmlViewer content={textContent!} />;
  }

  if (asset.type === 'code') {
    return <CodeViewer content={textContent!} language={asset.metadata?.language as string | undefined} />;
  }

  if (asset.type === 'text') {
    return <PlainTextViewer content={textContent!} />;
  }

  if (asset.type === 'json') {
    return <JsonViewer content={textContent!} />;
  }

  if (asset.type === 'chart') {
    return (
      <div className="px-6 py-8 text-foreground/60">
        Chart rendering coming soon. <a href={contentUrl} className="underline">Download raw data</a>
      </div>
    );
  }

  if (asset.mimeType?.startsWith('image/')) {
    return <ImageViewer src={contentUrl} alt={asset.title} />;
  }

  if (asset.mimeType === 'application/pdf') {
    return <PdfViewer src={contentUrl} />;
  }

  return <DownloadFallback src={contentUrl} filename={asset.title} />;
}

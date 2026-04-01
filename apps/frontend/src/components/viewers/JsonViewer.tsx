import { useState, useCallback } from 'react';
import { JsonNode } from './json/JsonNode';
import { PlainTextViewer } from './PlainTextViewer';
import type { Selection } from './json/JsonNode';

export function JsonViewer({ content }: { content: string }) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [selection, setSelection] = useState<Selection | null>(null);

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return <PlainTextViewer content={content} />;
  }

  const onToggleCollapse = useCallback((path: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const onTapContent = useCallback((path: string) => {
    setSelection((prev) => {
      if (prev?.path !== path) return { path, depth: 'value' };
      if (prev.depth === 'value') return { path, depth: 'key+value' };
      return null;
    });
  }, []);

  return (
    <pre className="overflow-auto px-6 py-8 font-mono text-sm">
      <JsonNode
        name={null}
        value={parsed}
        path="$"
        depth={0}
        collapsed={collapsed}
        selection={selection}
        onToggleCollapse={onToggleCollapse}
        onTapContent={onTapContent}
      />
    </pre>
  );
}

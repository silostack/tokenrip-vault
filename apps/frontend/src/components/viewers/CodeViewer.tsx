import { useMemo } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

export function CodeViewer({ content, language }: { content: string; language?: string }) {
  const highlighted = useMemo(() => {
    if (language) {
      try {
        return hljs.highlight(content, { language }).value;
      } catch {
        // unknown language, fall through to auto
      }
    }
    return hljs.highlightAuto(content).value;
  }, [content, language]);

  // highlight.js output is safe — it only produces <span class="hljs-..."> tags
  // from its own grammar rules, never passes through raw HTML
  return (
    <pre className="overflow-auto px-6 py-8">
      <code className="hljs text-sm" dangerouslySetInnerHTML={{ __html: highlighted }} />
    </pre>
  );
}

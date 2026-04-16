import { createRoot } from 'react-dom/client';
import { MarkdownRenderer } from './MarkdownRenderer';

function mount() {
  const source = document.getElementById('markdown-source');
  const target = document.getElementById('markdown-rendered');

  if (!source || !target) return;

  const markdown = source.textContent || '';

  // Hide raw markdown visually, keep for agents/screen readers
  source.setAttribute('aria-hidden', 'true');
  source.classList.add('sr-only');
  target.classList.remove('hidden');

  const root = createRoot(target);
  root.render(<MarkdownRenderer content={markdown} />);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}

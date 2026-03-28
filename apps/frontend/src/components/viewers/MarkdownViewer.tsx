import ReactMarkdown from 'react-markdown';

export function MarkdownViewer({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none px-6 py-8">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

export function PlainTextViewer({ content }: { content: string }) {
  return (
    <pre className="whitespace-pre-wrap break-words px-6 py-8 font-mono text-sm text-foreground/90 overflow-auto">
      {content}
    </pre>
  );
}

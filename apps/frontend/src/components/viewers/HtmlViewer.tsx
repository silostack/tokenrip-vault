export function HtmlViewer({ content }: { content: string }) {
  return (
    <iframe
      srcDoc={content}
      sandbox="allow-same-origin"
      className="h-[80vh] w-full rounded border border-foreground/10 bg-white"
      title="HTML Preview"
    />
  );
}

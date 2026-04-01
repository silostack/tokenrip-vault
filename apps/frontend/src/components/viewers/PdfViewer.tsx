export function PdfViewer({ src }: { src: string }) {
  return (
    <iframe
      src={src}
      className="h-[85vh] w-full rounded border border-foreground/10"
      title="PDF Viewer"
    />
  );
}

export function ImageViewer({ src, alt }: { src: string; alt?: string }) {
  return (
    <div className="flex justify-center px-6 py-8">
      <img
        src={src}
        alt={alt || 'Asset image'}
        className="max-h-[80vh] max-w-full rounded object-contain"
      />
    </div>
  );
}

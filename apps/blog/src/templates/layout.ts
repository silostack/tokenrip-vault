export function renderLayout(head: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
${head}
<link rel="stylesheet" href="/blog/_assets/blog.css">
</head>
<body>
${body}
<script type="module" src="/blog/_assets/blog.js"></script>
</body>
</html>`;
}

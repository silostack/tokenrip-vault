import matter from 'gray-matter';

export interface EnrichResult {
  frontmatter: {
    title: string;
    slug: string;
    description?: string;
    publishedAt?: string;
    tags?: string[];
    [key: string]: any;
  };
  content: string;
  output: string;
}

export function enrichArticle(raw: string): EnrichResult {
  const { data, content } = matter(raw);

  if (!data.slug && data.title) {
    data.slug = slugify(data.title);
  }

  if (!data.description && content.trim()) {
    data.description = extractExcerpt(content, 160);
  }

  if (!data.publishedAt) {
    data.publishedAt = new Date().toISOString();
  }

  const output = matter.stringify(content, data);

  return {
    frontmatter: data as EnrichResult['frontmatter'],
    content,
    output,
  };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function extractExcerpt(content: string, maxLength: number): string {
  const lines = content
    .split('\n')
    .filter((l) => l.trim() && !l.startsWith('#'));
  const paragraph = lines[0] || '';
  if (paragraph.length <= maxLength) return paragraph;
  return paragraph.slice(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

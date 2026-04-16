import type { BlogPost } from './types';
import { escapeHtml as esc } from './escape';

function buildJsonLd(post: BlogPost, baseUrl: string): string {
  const scripts: string[] = [];
  const m = post.metadata;

  const article: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: m.title,
    description: m.description || '',
    datePublished: m.publish_date || '',
    dateModified: post.updatedAt || m.publish_date || '',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.alias}`,
    },
    author: {
      '@type': 'Person',
      name: m.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'TokenRip',
    },
  };
  if (m.og_image) article.image = m.og_image;
  scripts.push(
    `<script type="application/ld+json">${JSON.stringify(article)}</script>`,
  );

  if (m.faq && m.faq.length > 0) {
    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: m.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    };
    scripts.push(
      `<script type="application/ld+json">${JSON.stringify(faq)}</script>`,
    );
  }

  return scripts.join('\n');
}

export function renderHead(
  post: BlogPost,
  baseUrl: string,
): string {
  const m = post.metadata;
  const title = esc(m.title);
  const desc = m.description ? esc(m.description) : '';
  const ogImage = m.og_image || '';

  return [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${title}</title>`,
    desc && `<meta name="description" content="${desc}">`,
    `<link rel="canonical" href="${baseUrl}/blog/${post.alias}">`,
    `<meta property="og:title" content="${title}">`,
    '<meta property="og:type" content="article">',
    desc && `<meta property="og:description" content="${desc}">`,
    ogImage && `<meta property="og:image" content="${esc(ogImage)}">`,
    `<meta property="og:url" content="${baseUrl}/blog/${post.alias}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${title}">`,
    desc && `<meta name="twitter:description" content="${desc}">`,
    ogImage && `<meta name="twitter:image" content="${esc(ogImage)}">`,
    buildJsonLd(post, baseUrl),
  ]
    .filter(Boolean)
    .join('\n');
}

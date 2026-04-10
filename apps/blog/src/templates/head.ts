import type { ArticleFrontmatter } from './types';
import { escapeHtml as esc } from './escape';

function buildJsonLd(fm: ArticleFrontmatter, baseUrl: string): string {
  const scripts: string[] = [];

  const article: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: fm.title,
    description: fm.description || '',
    datePublished: fm.publishedAt || '',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${fm.slug}`,
    },
  };
  if (fm.image) article.image = fm.image;
  if (fm.jsonLd?.article?.author) {
    article.author = {
      '@type': fm.jsonLd.article.author.type || 'Organization',
      name: fm.jsonLd.article.author.name,
    };
  }
  scripts.push(
    `<script type="application/ld+json">${JSON.stringify(article)}</script>`,
  );

  if (fm.jsonLd?.faq && fm.jsonLd.faq.length > 0) {
    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: fm.jsonLd.faq.map((item) => ({
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
  fm: ArticleFrontmatter,
  baseUrl: string,
): string {
  const title = esc(fm.title);
  const desc = fm.description ? esc(fm.description) : '';
  const ogType = fm.og?.type || 'article';
  const ogImage = fm.og?.image || fm.image || '';

  return [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${title}</title>`,
    desc && `<meta name="description" content="${desc}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:type" content="${esc(ogType)}">`,
    desc && `<meta property="og:description" content="${desc}">`,
    ogImage && `<meta property="og:image" content="${esc(ogImage)}">`,
    `<meta property="og:url" content="${baseUrl}/blog/${fm.slug}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${title}">`,
    desc && `<meta name="twitter:description" content="${desc}">`,
    ogImage && `<meta name="twitter:image" content="${esc(ogImage)}">`,
    buildJsonLd(fm, baseUrl),
  ]
    .filter(Boolean)
    .join('\n');
}

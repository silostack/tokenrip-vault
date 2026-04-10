export interface ArticleFrontmatter {
  title: string;
  slug: string;
  description?: string;
  publishedAt?: string;
  image?: string;
  tags?: string[];
  jsonLd?: {
    article?: {
      type?: string;
      author?: { name: string; type?: string };
    };
    faq?: Array<{ q: string; a: string }>;
  };
  og?: { type?: string; image?: string; [key: string]: any };
  [key: string]: any;
}

export interface ArticleListItem {
  slug: string;
  title: string;
  description: string | null;
  publishedAt: string | null;
  image: string | null;
  tags: string[];
}

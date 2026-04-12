export interface BlogPostMetadata {
  post_type: 'blog_post';
  title: string;
  description: string;
  publish_date: string;
  author: string;
  tags: string[];
  og_image?: string;
  excerpt?: string;
  reading_time?: number;
  featured?: boolean;
  draft?: boolean;
  faq?: Array<{ q: string; a: string }>;
  [key: string]: unknown;
}

export interface BlogPost {
  publicId: string;
  alias: string;
  content: string;
  metadata: BlogPostMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostSummary {
  publicId: string;
  alias: string;
  title: string | null;
  metadata: BlogPostMetadata;
  createdAt: string;
  updatedAt: string;
}

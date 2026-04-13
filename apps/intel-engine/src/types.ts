import { z } from 'zod';

// --- Signal schemas ---

export const SignalTypeEnum = z.enum([
  'technique',
  'frustration',
  'recommendation',
  'warning',
  'comparison',
  'experience',
]);
export type SignalType = z.infer<typeof SignalTypeEnum>;

export const SourceTypeEnum = z.enum([
  'article',
  'clipping',
  'markdown',
  'own-testing',
]);
export type SourceType = z.infer<typeof SourceTypeEnum>;

export const ConfidenceEnum = z.enum(['low', 'medium', 'high']);
export type Confidence = z.infer<typeof ConfidenceEnum>;

export const CorroborationSchema = z.object({
  count: z.number().default(1),
  supporting: z.array(z.string()).default([]),
  contradicting: z.array(z.string()).default([]),
});
export type Corroboration = z.infer<typeof CorroborationSchema>;

export const SignalFrontmatterSchema = z.object({
  id: z.string(),
  type: z.literal('signal'),
  signal_type: SignalTypeEnum,
  claim: z.string(),
  entities: z.array(z.string()),
  concepts: z.array(z.string()).default([]),
  problems: z.array(z.string()).default([]),
  source: z.string(),
  source_type: SourceTypeEnum,
  source_date: z.string(),
  extracted: z.string(),
  confidence: ConfidenceEnum,
  corroboration: CorroborationSchema.default({ count: 1, supporting: [], contradicting: [] }),
});
export type SignalFrontmatter = z.infer<typeof SignalFrontmatterSchema>;

export interface Signal {
  frontmatter: SignalFrontmatter;
  body: string;
  filePath: string;
}

// --- Wiki schemas ---

export const WikiTypeEnum = z.enum(['entity', 'concept', 'comparison', 'synthesis']);
export type WikiType = z.infer<typeof WikiTypeEnum>;

export const WikiStatusEnum = z.enum(['stub', 'draft', 'complete']);
export type WikiStatus = z.infer<typeof WikiStatusEnum>;

export const WikiFrontmatterSchema = z.object({
  title: z.string(),
  type: WikiTypeEnum,
  tags: z.array(z.string()),
  created: z.string(),
  updated: z.string(),
  sources: z.array(z.string()).default([]),
  signals: z.array(z.string()).default([]),
  status: WikiStatusEnum,
});
export type WikiFrontmatter = z.infer<typeof WikiFrontmatterSchema>;

export interface WikiPage {
  frontmatter: WikiFrontmatter;
  body: string;
  filePath: string;
}

// --- Other types ---

export interface ParsedSource {
  frontmatter: Record<string, unknown>;
  content: string;
  filePath: string;
  sourceType: SourceType;
}

export interface IngestResult {
  signals: Signal[];
  wikiUpdates: Array<{ path: string; action: 'create' | 'update' }>;
  sourceMovedTo: string;
}

export interface SurfaceResult {
  briefPath: string;
  metrics: {
    totalSignals: number;
    totalWikiPages: number;
    stalePages: number;
    signalStarvedPages: number;
    orphanPages: number;
    coverageGaps: number;
  };
}

export interface PublishResult {
  path: string;
  slug: string;
}

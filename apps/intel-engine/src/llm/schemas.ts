import { z } from 'zod';
import { SignalTypeEnum, ConfidenceEnum, WikiTypeEnum } from '../types';

// --- Extracted Signal (from LLM response) ---

export const ExtractedSignalSchema = z.object({
  claim: z.string(),
  signal_type: SignalTypeEnum,
  entities: z.array(z.string()),
  concepts: z.array(z.string()).default([]),
  problems: z.array(z.string()).default([]),
  confidence: ConfidenceEnum,
});
export type ExtractedSignal = z.infer<typeof ExtractedSignalSchema>;

export const ExtractedSignalsResponseSchema = z.object({
  signals: z.array(ExtractedSignalSchema),
});
export type ExtractedSignalsResponse = z.infer<typeof ExtractedSignalsResponseSchema>;

// --- Wiki Update (from LLM response) ---

export const WikiUpdateSchema = z.object({
  path: z.string(),
  action: z.enum(['create', 'update']),
  title: z.string(),
  type: WikiTypeEnum,
  tags: z.array(z.string()),
  body: z.string(),
});
export type WikiUpdate = z.infer<typeof WikiUpdateSchema>;

export const WikiUpdatesResponseSchema = z.object({
  updates: z.array(WikiUpdateSchema),
});
export type WikiUpdatesResponse = z.infer<typeof WikiUpdatesResponseSchema>;

// --- Story Candidate & Editorial Brief (from LLM response) ---

export const StoryCandidateSchema = z.object({
  title: z.string(),
  angle: z.string(),
  signal_ids: z.array(z.string()),
  entities: z.array(z.string()).default([]),
});
export type StoryCandidate = z.infer<typeof StoryCandidateSchema>;

export const EditorialBriefSchema = z.object({
  candidates: z.array(StoryCandidateSchema),
  trends: z.array(z.string()).default([]),
  gaps: z.array(z.string()).default([]),
});
export type EditorialBrief = z.infer<typeof EditorialBriefSchema>;

// --- Blog Draft (from LLM response) ---

export const BlogDraftSchema = z.object({
  title: z.string(),
  body: z.string(),
});
export type BlogDraft = z.infer<typeof BlogDraftSchema>;

// --- Enrichment (from LLM response) ---

export const EnrichmentSchema = z.object({
  description: z.string(),
  tags: z.array(z.string()),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
});
export type Enrichment = z.infer<typeof EnrichmentSchema>;

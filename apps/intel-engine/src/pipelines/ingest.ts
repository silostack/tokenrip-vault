import matter from 'gray-matter';
import type { LLMClient } from '../llm/client';
import {
  ExtractedSignalsResponseSchema,
  WikiUpdatesResponseSchema,
} from '../llm/schemas';
import { buildExtractSignalsPrompt } from '../llm/prompts/extract-signals';
import { buildUpdateWikiPrompt } from '../llm/prompts/update-wiki';
import { RepoReader } from '../repo/reader';
import { RepoWriter } from '../repo/writer';
import { rebuildIndex } from '../repo/index-manager';
import { generateSignalId } from '../signals/id-generator';
import { findCorroborations } from '../signals/corroborate';
import type {
  Signal,
  IngestResult,
  SourceType,
  WikiPage,
} from '../types';

function normalizeDate(value: unknown): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString().split('T')[0];
  const str = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const parsed = new Date(str);
  return isNaN(parsed.getTime()) ? str : parsed.toISOString().split('T')[0];
}

export interface IngestParams {
  sourcePath: string;
  repoPath: string;
  llm: LLMClient;
}

function detectSourceType(
  sourcePath: string,
  frontmatter: Record<string, unknown>,
): SourceType {
  if (sourcePath.includes('Clippings/')) return 'clipping';

  const tags = frontmatter.tags;
  if (Array.isArray(tags) && tags.some((t: unknown) => String(t).toLowerCase() === 'clippings')) {
    return 'clipping';
  }

  if (sourcePath.endsWith('.md')) return 'markdown';
  return 'article';
}

export async function ingest(params: IngestParams): Promise<IngestResult> {
  const { sourcePath, repoPath, llm } = params;
  const reader = new RepoReader(repoPath);
  const writer = new RepoWriter(repoPath);

  // Parse source
  const raw = await reader.readFile(sourcePath);
  const { data: frontmatter, content } = matter(raw);
  const sourceType = detectSourceType(sourcePath, frontmatter);

  // Extract signals via LLM
  const extractPrompt = buildExtractSignalsPrompt({ content, sourcePath, sourceType });
  const extractedResponse = await llm.complete({
    system: extractPrompt.system,
    user: extractPrompt.user,
    schema: ExtractedSignalsResponseSchema,
  });

  // Build Signal objects
  const existingIds = await reader.getAllSignalIds();
  const today = new Date().toISOString().split('T')[0];
  const allIds = [...existingIds];
  const newSignals: Signal[] = [];

  for (const extracted of extractedResponse.signals) {
    const id = generateSignalId(allIds, today);
    allIds.push(id);

    newSignals.push({
      frontmatter: {
        id,
        type: 'signal',
        signal_type: extracted.signal_type,
        claim: extracted.claim,
        entities: extracted.entities,
        concepts: extracted.concepts ?? [],
        problems: extracted.problems ?? [],
        source: sourcePath,
        source_type: sourceType,
        source_date: normalizeDate(frontmatter.published) ?? today,
        extracted: today,
        confidence: extracted.confidence,
        corroboration: { count: 1, supporting: [], contradicting: [] },
      },
      body: extracted.claim,
      filePath: '',
    });
  }

  // Corroborate against existing signals
  const existingSignals = await reader.readAllSignals();
  for (const newSignal of newSignals) {
    const matches = findCorroborations(newSignal, existingSignals);
    for (const match of matches) {
      newSignal.frontmatter.corroboration.count += 1;
      newSignal.frontmatter.corroboration.supporting.push(match.existingSignalId);

      const existingSignal = existingSignals.find(
        (s) => s.frontmatter.id === match.existingSignalId,
      );
      if (existingSignal) {
        existingSignal.frontmatter.corroboration.count += 1;
        existingSignal.frontmatter.corroboration.supporting.push(newSignal.frontmatter.id);
        await writer.writeSignal(existingSignal);
      }
    }
  }

  // Write new signals
  for (const signal of newSignals) {
    signal.filePath = await writer.writeSignal(signal);
  }

  // Determine affected wiki pages
  const signalEntities = newSignals.flatMap((s) => s.frontmatter.entities);
  const signalConcepts = newSignals.flatMap((s) => s.frontmatter.concepts);
  const allNames = [...new Set([...signalEntities, ...signalConcepts])];

  const existingPages = await reader.readAllWikiPages();
  const affectedPages: Array<{ path: string; content: string }> = [];
  for (const page of existingPages) {
    const pageEntities = page.frontmatter.tags ?? [];
    const titleLower = page.frontmatter.title.toLowerCase();
    const hasOverlap = allNames.some(
      (name) =>
        pageEntities.some((t) => t.toLowerCase() === name.toLowerCase()) ||
        titleLower === name.toLowerCase(),
    );
    if (hasOverlap) {
      affectedPages.push({ path: page.filePath, content: page.body });
    }
  }

  let indexContent = '';
  try {
    indexContent = await reader.readFile('index.md');
  } catch {
    // no index yet
  }

  // Update wiki via LLM
  const wikiPrompt = buildUpdateWikiPrompt({
    signals: newSignals.map((s) => ({
      id: s.frontmatter.id,
      claim: s.frontmatter.claim,
      entities: s.frontmatter.entities,
    })),
    existingPages: affectedPages,
    indexContent,
  });

  const wikiResponse = await llm.complete({
    system: wikiPrompt.system,
    user: wikiPrompt.user,
    schema: WikiUpdatesResponseSchema,
  });

  // Write wiki updates
  const wikiUpdates: Array<{ path: string; action: 'create' | 'update' }> = [];
  const allPages = [...existingPages];
  const signalIds = newSignals.map((s) => s.frontmatter.id);
  const now = new Date().toISOString().split('T')[0];

  for (const update of wikiResponse.updates) {
    const page: WikiPage = {
      frontmatter: {
        title: update.title,
        type: update.type,
        tags: update.tags,
        created: now,
        updated: now,
        sources: [sourcePath],
        signals: signalIds,
        status: 'stub',
      },
      body: update.body,
      filePath: update.path,
    };

    if (update.action === 'update') {
      const existing = existingPages.find((p) => p.filePath === update.path);
      if (existing) {
        page.frontmatter.created = existing.frontmatter.created;
        page.frontmatter.status = existing.frontmatter.status;
        page.frontmatter.signals = [...new Set([...existing.frontmatter.signals, ...signalIds])];
        page.frontmatter.sources = [...new Set([...existing.frontmatter.sources, sourcePath])];
        page.body = existing.body + '\n\n' + update.body;
      }
    }

    await writer.writeWikiPage(page);
    wikiUpdates.push({ path: update.path, action: update.action });

    const existingIdx = allPages.findIndex((p) => p.filePath === update.path);
    if (existingIdx >= 0) {
      allPages[existingIdx] = page;
    } else {
      allPages.push(page);
    }
  }

  // Rebuild index
  await rebuildIndex(repoPath, allPages);

  // Log
  await writer.appendLog(
    'ingest',
    sourcePath,
    `${newSignals.length} signals extracted, ${wikiUpdates.length} wiki updates`,
    wikiUpdates.map((u) => u.path),
  );

  // Move source if in inbox
  let sourceMovedTo = sourcePath;
  if (sourcePath.startsWith('sources/inbox/') && !sourcePath.startsWith('sources/inbox/processed/') && !sourcePath.startsWith('sources/inbox/failed/')) {
    await writer.moveToProcessed(sourcePath);
    const filename = sourcePath.split('/').pop()!;
    sourceMovedTo = `sources/inbox/processed/${filename}`;
  }

  return { signals: newSignals, wikiUpdates, sourceMovedTo };
}

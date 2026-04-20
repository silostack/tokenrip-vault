import api from '@/utils/api'
import type { ThreadMessage } from '@/lib/thread'

// ── Types ──────────────────────────────────────────────

export interface OperatorAgent {
  agent_id: string
  alias: string | null
  public_key?: string | null
  metadata: Record<string, unknown> | null
  registered_at: string
}

export interface InboxThread {
  thread_id: string
  state: 'open' | 'closed'
  updated_at: string
  new_message_count: number
  last_sequence: number | null
  last_intent: string | null
  last_body_preview: string | null
  refs: Array<{ type: string; target_id: string; version?: number }>
  owner_id: string
  participants: Array<{ agent_id: string; alias: string | null }>
  ref_count: number
}

export interface InboxFetchOpts {
  since?: string
  limit?: number
  type?: 'thread' | 'asset'
  q?: string
  state?: 'open' | 'closed'
  team?: string
}

export interface InboxAsset {
  asset_id: string
  title: string | null
  updated_at: string
  new_version_count: number
  latest_version: number
  description: string | null
  thread_count: number
}

export interface InboxData {
  threads: InboxThread[]
  assets: InboxAsset[]
  poll_after: number
}

export interface OperatorAssetItem {
  id: string
  title: string | null
  description: string | null
  type: string
  mimeType: string | null
  state: string
  versionCount: number
  threadCount: number
  createdAt: string
  updatedAt: string
}

export interface ThreadUpdate {
  thread_id: string
  state: string
  resolution: Record<string, unknown> | null
  owner_id: string
}

export interface AuthResponse {
  user_id: string
  auth_token: string
  is_new_registration: boolean
}

// ── Inbox item (unified feed) ──────────────────────────

export type InboxItem =
  | { kind: 'thread'; data: InboxThread }
  | { kind: 'asset'; data: InboxAsset }

export function mergeInboxItems(inbox: InboxData): InboxItem[] {
  const items: InboxItem[] = [
    ...inbox.threads.map((t) => ({ kind: 'thread' as const, data: t })),
    ...inbox.assets.map((a) => ({ kind: 'asset' as const, data: a })),
  ]
  items.sort((a, b) => new Date(b.data.updated_at).getTime() - new Date(a.data.updated_at).getTime())
  return items
}

export interface ThreadRef {
  id: string
  type: string
  target_id: string
  version?: number
}

// ── Auth ───────────────────────────────────────────────

export async function authenticateOperator(params: {
  token: string
  display_name?: string
  password?: string
}): Promise<AuthResponse> {
  const res = await api.post('/v0/auth/operator', params)
  return res.data.data
}

// ── Dashboard ──────────────────────────────────────────

export async function fetchOperatorAgent(): Promise<OperatorAgent> {
  const res = await api.get('/v0/operator/agent')
  return res.data.data
}

export async function fetchInbox(opts?: InboxFetchOpts): Promise<InboxData> {
  const params: Record<string, string | number> = {}
  if (opts?.since) params.since = opts.since
  if (opts?.limit) params.limit = opts.limit
  if (opts?.type) params.type = opts.type
  if (opts?.q) params.q = opts.q
  if (opts?.state) params.state = opts.state
  if (opts?.team) params.team = opts.team
  const res = await api.get('/v0/operator/inbox', { params })
  return res.data.data
}

export async function fetchOperatorAssets(params?: {
  since?: string
  limit?: number
  type?: string
  archived?: boolean
  include_archived?: boolean
  team?: string
}): Promise<OperatorAssetItem[]> {
  const res = await api.get('/v0/operator/assets', { params })
  return res.data.data
}

// ── Actions ────────────────────────────────────────────

export async function archiveAsset(publicId: string): Promise<void> {
  await api.post(`/v0/operator/assets/${publicId}/archive`)
}

export async function unarchiveAsset(publicId: string): Promise<void> {
  await api.post(`/v0/operator/assets/${publicId}/unarchive`)
}

export async function destroyAsset(publicId: string): Promise<void> {
  await api.delete(`/v0/operator/assets/${publicId}`)
}

export async function updateThread(
  threadId: string,
  body: { state?: string; resolution?: Record<string, unknown> },
): Promise<ThreadUpdate> {
  const res = await api.patch(`/v0/operator/threads/${threadId}`, body)
  return res.data.data
}

export async function dismissThread(threadId: string): Promise<void> {
  await api.post(`/v0/operator/threads/${threadId}/dismiss`)
}

export async function postOperatorMessage(
  threadId: string,
  body: string,
): Promise<ThreadMessage> {
  const res = await api.post(`/v0/operator/threads/${threadId}/messages`, {
    body,
  })
  return res.data.data
}

// ── Share tokens ───────────────────────────────────────────

export interface ShareTokenResult {
  id: string
  token: string
  url: string
  perm: string[]
  label: string | null
  expires_at: string | null
  created_at: string
}

export async function createShareToken(
  publicId: string,
  opts?: { perm?: string[]; label?: string; expires_in?: string },
): Promise<ShareTokenResult> {
  const res = await api.post(`/v0/operator/assets/${publicId}/share`, opts ?? {})
  return res.data.data
}

// ── Contacts ──────────────────────────────────────────────

export interface OperatorContact {
  id: string
  agentId: string
  alias: string | null
  label: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export async function fetchOperatorContacts(): Promise<OperatorContact[]> {
  const res = await api.get('/v0/operator/contacts')
  return res.data.data
}

export async function addOperatorContact(opts: {
  agentId: string
  label?: string
  notes?: string
}): Promise<OperatorContact> {
  const res = await api.post('/v0/operator/contacts', opts)
  return res.data.data
}

export async function updateOperatorContact(
  id: string,
  opts: { label?: string; notes?: string },
): Promise<OperatorContact> {
  const res = await api.patch(`/v0/operator/contacts/${id}`, opts)
  return res.data.data
}

export async function removeOperatorContact(id: string): Promise<void> {
  await api.delete(`/v0/operator/contacts/${id}`)
}

// ── Thread list ──────────────────────────────────────────

export interface ThreadListItem {
  thread_id: string
  state: 'open' | 'closed'
  created_by: string
  owner_id: string
  participant_count: number
  participants: Array<{ agent_id: string; alias: string | null }>
  ref_count: number
  last_message_at: string | null
  last_message_preview: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface ThreadListData {
  threads: ThreadListItem[]
  total: number
}

export interface ThreadListFetchOpts {
  state?: 'open' | 'closed'
  limit?: number
  offset?: number
  team?: string
}

export async function fetchOperatorThreads(
  opts?: ThreadListFetchOpts,
): Promise<ThreadListData> {
  const params: Record<string, string | number> = {}
  if (opts?.state) params.state = opts.state
  if (opts?.limit) params.limit = opts.limit
  if (opts?.offset != null) params.offset = opts.offset
  if (opts?.team) params.team = opts.team
  const res = await api.get('/v0/operator/threads', { params })
  return res.data.data
}

// ── Thread refs ───────────────────────────────────────────

export async function addThreadRefs(
  threadId: string,
  refs: Array<{ type: string; target_id: string }>,
): Promise<ThreadRef[]> {
  const res = await api.post(`/v0/operator/threads/${threadId}/refs`, { refs })
  return res.data.data
}

export async function removeThreadRef(threadId: string, refId: string): Promise<void> {
  await api.delete(`/v0/operator/threads/${threadId}/refs/${refId}`)
}

// ── Thread data (uses regular endpoints with session cookie) ──

export async function fetchOperatorThread(threadId: string) {
  const res = await api.get(`/v0/operator/threads/${threadId}`)
  return res.data.data
}

export async function fetchOperatorMessages(
  threadId: string,
  sinceSequence?: number,
): Promise<ThreadMessage[]> {
  const params: Record<string, string> = {}
  if (sinceSequence != null) params.since_sequence = String(sinceSequence)
  const res = await api.get(`/v0/operator/threads/${threadId}/messages`, { params })
  return res.data.data
}

// ── Teams ─────────────────────────────────────────────────

export interface TeamDetail {
  id: string
  name: string
  slug: string
  description: string | null
  owner_id: string
  members: Array<{ agent_id: string; alias: string | null }>
  recent_assets: Array<{ public_id: string; title: string | null; type: string }>
}

export async function fetchOperatorTeams(): Promise<
  Array<{ id: string; name: string; slug: string; memberCount: number }>
> {
  const res = await api.get('/v0/operator/teams')
  return res.data.data.map((t: any) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    memberCount: t.member_count ?? 0,
  }))
}

export async function fetchTeamDetail(slug: string): Promise<TeamDetail> {
  const res = await api.get(`/v0/operator/teams/${slug}`)
  return res.data.data
}

export async function createTeam(data: {
  slug: string
  name?: string
  description?: string
}): Promise<TeamDetail> {
  const res = await api.post('/v0/operator/teams', data)
  return res.data.data
}

export async function addTeamMember(slug: string, agentId: string): Promise<void> {
  await api.post(`/v0/operator/teams/${slug}/members`, { agent_id: agentId })
}

export async function removeTeamMember(slug: string, agentId: string): Promise<void> {
  await api.delete(`/v0/operator/teams/${slug}/members/${agentId}`)
}

export async function generateTeamInvite(
  slug: string,
): Promise<{ invite_url?: string; token?: string }> {
  const res = await api.post(`/v0/operator/teams/${slug}/invite`)
  return res.data.data
}

export async function deleteTeam(slug: string): Promise<void> {
  await api.delete(`/v0/operator/teams/${slug}`)
}

export async function leaveTeam(slug: string): Promise<void> {
  await api.post(`/v0/operator/teams/${slug}/leave`)
}

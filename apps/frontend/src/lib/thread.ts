import api from '@/utils/api'

export interface ThreadMessage {
  id: string
  sequence: number
  body: string
  intent?: string
  type?: string
  data?: Record<string, unknown>
  in_reply_to?: string
  sender: {
    agent_id?: string
    user_id?: string
  }
  created_at: string
}

export interface ThreadMeta {
  id: string
  created_by: string
  resolution?: Record<string, unknown>
  metadata?: Record<string, unknown>
  participants: Array<{
    id: string
    agent_id?: string
    user_id?: string
    role?: string
    joined_at: string
  }>
  created_at: string
  updated_at: string
}

export async function fetchThread(threadId: string, cap: string): Promise<ThreadMeta> {
  const res = await api.get(`/v0/threads/${threadId}`, { params: { cap } })
  return res.data.data
}

export async function fetchMessages(
  threadId: string,
  cap: string,
  sinceSequence?: number,
): Promise<ThreadMessage[]> {
  const params: Record<string, string> = { cap }
  if (sinceSequence != null) params.since_sequence = String(sinceSequence)
  const res = await api.get(`/v0/threads/${threadId}/messages`, { params })
  return res.data.data
}

export async function postMessage(
  threadId: string,
  cap: string,
  body: string,
): Promise<ThreadMessage> {
  const res = await api.post(
    `/v0/threads/${threadId}/messages?cap=${encodeURIComponent(cap)}`,
    { body },
  )
  return res.data.data
}

export async function fetchAssetMessages(
  publicId: string,
  cap: string,
): Promise<{ messages: ThreadMessage[]; thread_id?: string }> {
  const res = await api.get(`/v0/assets/${publicId}/messages`, { params: { cap } })
  return { messages: res.data.data, thread_id: res.data.thread_id }
}

export async function postAssetComment(
  publicId: string,
  cap: string,
  body: string,
): Promise<{ message: ThreadMessage; thread_id: string }> {
  const res = await api.post(
    `/v0/assets/${publicId}/messages?cap=${encodeURIComponent(cap)}`,
    { body },
  )
  return { message: res.data.data, thread_id: res.data.data.thread_id }
}

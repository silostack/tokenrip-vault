import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const client = axios.create({ baseURL: API_URL });

export interface ArtifactMetadata {
  id: string;
  title?: string;
  description?: string;
  type: 'file' | 'markdown' | 'html' | 'chart';
  mimeType?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export async function getArtifact(uuid: string): Promise<ArtifactMetadata> {
  const { data } = await client.get(`/v0/artifacts/${uuid}`);
  return data.data;
}

export function getArtifactContentUrl(uuid: string): string {
  return `${API_URL}/v0/artifacts/${uuid}/content`;
}

export interface AssetResponse {
  id: string;
  alias: string | null;
  title: string | null;
  type: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface QueryResult {
  assets: Array<{
    publicId: string;
    alias: string | null;
    type: string;
    title: string | null;
    metadata: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
  }>;
  pagination: { total: number; limit: number; offset: number };
}

export class TokenripClient {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
  ) {}

  async publishAsset(
    content: string,
    alias: string,
    metadata: Record<string, unknown>,
  ): Promise<{ publicId: string; alias: string | null }> {
    const res = await fetch(`${this.baseUrl}/v0/assets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'markdown',
        content,
        alias,
        metadata,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Failed to publish asset (${res.status}): ${body}`);
    }

    const json = await res.json() as any;
    return { publicId: json.data.id, alias: json.data.alias };
  }

  async getByAlias(alias: string): Promise<AssetResponse | null> {
    const res = await fetch(`${this.baseUrl}/v0/assets/${alias}`);

    if (res.status === 404) return null;
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Failed to get asset by alias (${res.status}): ${body}`);
    }

    const json = await res.json() as any;
    return json.data;
  }

  async getContent(identifier: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/v0/assets/${identifier}/content`);

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Failed to get content (${res.status}): ${body}`);
    }

    return res.text();
  }

  async updateAsset(
    publicId: string,
    updates: { alias?: string; metadata?: Record<string, unknown> },
  ): Promise<void> {
    const res = await fetch(`${this.baseUrl}/v0/assets/${publicId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Failed to update asset (${res.status}): ${body}`);
    }
  }

  async createVersion(
    publicId: string,
    content: string,
  ): Promise<void> {
    const res = await fetch(`${this.baseUrl}/v0/assets/${publicId}/versions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'markdown', content }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Failed to create version (${res.status}): ${body}`);
    }
  }

  async queryAssets(filters: {
    metadata?: Record<string, unknown>;
    tag?: string;
    sort?: string;
    limit?: number;
    offset?: number;
  }): Promise<QueryResult> {
    const res = await fetch(`${this.baseUrl}/v0/assets/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Failed to query assets (${res.status}): ${body}`);
    }

    const json = await res.json() as any;
    return { assets: json.assets, pagination: json.pagination };
  }
}

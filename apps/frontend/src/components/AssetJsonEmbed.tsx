import type { AssetMetadata } from '@/lib/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3434'

interface AssetJsonEmbedProps {
  asset: AssetMetadata
  textContent?: string | null
  versionId?: string
}

export function AssetJsonEmbed({ asset, textContent, versionId }: AssetJsonEmbedProps) {
  const data = {
    tokenrip: {
      about: 'Tokenrip is an asset coordination platform for AI agents. Create, version, and share assets programmatically.',
      cli: {
        install: 'npm install @tokenrip/cli',
        npm: 'https://www.npmjs.com/package/@tokenrip/cli',
      },
      api: {
        base: API_URL + '/v0',
      },
    },
    asset: {
      id: asset.id,
      type: asset.type,
      title: asset.title ?? null,
      description: asset.description ?? null,
      mimeType: asset.mimeType ?? null,
      content: textContent ?? null,
      metadata: asset.metadata ?? null,
      creatorContext: asset.creatorContext ?? null,
      createdAt: asset.createdAt,
      version: {
        current: asset.currentVersionId ?? null,
        viewing: versionId ?? asset.currentVersionId ?? null,
        count: asset.versionCount ?? 1,
      },
    },
    links: {
      api: `${API_URL}/v0/assets/${asset.id}`,
      content: `${API_URL}/v0/assets/${asset.id}/content`,
      versions: `${API_URL}/v0/assets/${asset.id}/versions`,
    },
  }

  return (
    <script type="application/json" id="tokenrip-asset">
      {JSON.stringify(data)}
    </script>
  )
}

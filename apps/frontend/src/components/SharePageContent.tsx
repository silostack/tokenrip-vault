import { useEffect, useState, useCallback, useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  assetAtom,
  isLoadingAssetAtom,
  assetErrorAtom,
  versionsAtom,
  activeVersionIdAtom,
} from '@/_jotai/asset/asset.atoms'
import { useAssetActions } from '@/_jotai/asset/asset.actions'
import { AssetViewer } from './AssetViewer'
import { AssetToolbar } from './AssetToolbar'
import { VersionDropdown } from './VersionDropdown'
import { CommentPanel } from './CommentPanel'
import { NotFound } from './NotFound'
import { fetchAssetMessages } from '@/lib/thread'
import { hasSession, setSession } from '@/lib/session'
import api from '@/utils/api'
import type { AssetMetadata } from '@/lib/api'
import type { CollectionRow } from '@/lib/collection'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3434'

interface SharePageContentProps {
  uuid: string
  versionId?: string
  ssrAsset?: AssetMetadata | null
  ssrTextContent?: string | null
  ssrDestroyed?: boolean
  ssrDestroyedTitle?: string | null
  ssrRows?: CollectionRow[] | null
  ssrNextCursor?: string | null
}

function StaticContent({ asset, textContent, versionId }: { asset: AssetMetadata; textContent?: string | null; versionId?: string }) {
  const contentUrl = versionId
    ? `${API_URL}/v0/assets/${asset.id}/versions/${versionId}/content`
    : `${API_URL}/v0/assets/${asset.id}/content`

  if (textContent != null) {
    switch (asset.type) {
      case 'markdown':
        return <div>{textContent}</div>
      case 'code':
        return <pre><code>{textContent}</code></pre>
      case 'json': {
        let formatted = textContent
        try { formatted = JSON.stringify(JSON.parse(textContent), null, 2) } catch {}
        return <pre>{formatted}</pre>
      }
      case 'html':
      case 'text':
      case 'chart':
        return <pre>{textContent}</pre>
    }
  }

  if (asset.mimeType?.startsWith('image/')) {
    return <img src={contentUrl} alt={asset.title || 'Image asset'} />
  }

  return <a href={contentUrl}>Download: {asset.title || 'asset'}</a>
}

export function SharePageContent({ uuid, versionId, ssrAsset, ssrTextContent, ssrDestroyed, ssrDestroyedTitle, ssrRows, ssrNextCursor }: SharePageContentProps) {
  const [mounted, setMounted] = useState(false)
  const jotaiAsset = useAtomValue(assetAtom)
  const isLoading = useAtomValue(isLoadingAssetAtom)
  const error = useAtomValue(assetErrorAtom)
  const versions = useAtomValue(versionsAtom)
  const activeVersionId = useAtomValue(activeVersionIdAtom)
  const setAsset = useSetAtom(assetAtom)
  const setIsLoading = useSetAtom(isLoadingAssetAtom)
  const setActiveVersionId = useSetAtom(activeVersionIdAtom)
  const { fetchAsset, fetchVersions } = useAssetActions()

  const cap = useMemo(
    () => (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('cap') : null),
    [],
  )

  // Session + own-agent detection
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isOwnAgent, setIsOwnAgent] = useState(false)
  const [onboardDismissed, setOnboardDismissed] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (ssrAsset) {
      setAsset(ssrAsset)
      setIsLoading(false)
      setActiveVersionId(versionId || null)
    } else {
      fetchAsset(uuid, versionId, cap ?? undefined)
    }

    // Check session + own-agent
    if (typeof window !== 'undefined') {
      const loggedIn = hasSession()
      setIsLoggedIn(loggedIn)
      setOnboardDismissed(localStorage.getItem('tokenrip:onboard-dismissed') === '1')

      if (loggedIn && ssrAsset?.creator?.agentId) {
        api.get('/v0/operator/agent').then((res) => {
          if (res.data?.data?.agent_id === ssrAsset.creator?.agentId) {
            setIsOwnAgent(true)
          }
        }).catch(() => {})
      }
    }
  }, [uuid, versionId])

  const [panelOpen, setPanelOpen] = useState(false)
  const [commentCount, setCommentCount] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (!cap || !mounted) return
    fetchAssetMessages(uuid, cap)
      .then((result) => setCommentCount(result.messages.length))
      .catch(() => {})
  }, [uuid, cap, mounted])

  const togglePanel = useCallback(() => setPanelOpen((prev) => !prev), [])

  const dismissOnboard = useCallback(() => {
    setOnboardDismissed(true)
    localStorage.setItem('tokenrip:onboard-dismissed', '1')
  }, [])

  const asset = ssrAsset || jotaiAsset

  // During SSR and initial hydration: render raw content directly
  if (!mounted) {
    if (!ssrAsset) return null
    return (
      <article className="sr-only">
        <StaticContent asset={ssrAsset} textContent={ssrTextContent} versionId={versionId} />
      </article>
    )
  }

  if (!ssrAsset && isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-foreground/40">
        Loading...
      </div>
    )
  }

  if (!asset) {
    const destroyed = ssrDestroyed || error?.code === 'ASSET_DESTROYED'
    const title = ssrDestroyedTitle || error?.title
    return <NotFound variant={destroyed ? 'destroyed' : 'asset'} title={title} />
  }

  const showVersions = asset.versionCount != null && asset.versionCount > 1
  const isOlderVersion = activeVersionId != null && activeVersionId !== asset.currentVersionId

  return (
    <div className={`mx-auto pb-20 sm:pb-16 transition-all duration-200 ${panelOpen ? 'md:mr-[380px] md:max-w-[calc(100vw-380px-2rem)]' : 'max-w-5xl'}`}>
      {(asset.title || showVersions) && (
        <div className="border-b border-foreground/10 px-6 py-4">
          <div className="flex items-center gap-3">
            {asset.title && (
              <h1 className="font-mono text-xl font-bold">{asset.title}</h1>
            )}
            {showVersions && (
              <VersionDropdown
                uuid={asset.id}
                versions={versions}
                activeVersionId={activeVersionId}
                currentVersionId={asset.currentVersionId}
                versionCount={asset.versionCount}
                onOpen={() => fetchVersions(uuid)}
              />
            )}
          </div>
          {asset.description && (
            <p className="mt-1 text-sm text-foreground/60">
              {asset.description}
            </p>
          )}
          {isOlderVersion && (
            <div className="mt-2 rounded bg-status-warning/10 px-3 py-1.5 text-xs text-status-warning">
              Viewing an older version.{' '}
              <a href={`/s/${asset.id}`} className="underline">
                View latest
              </a>
            </div>
          )}
        </div>
      )}
      <AssetViewer asset={asset} versionId={versionId} initialContent={ssrTextContent ?? undefined} initialRows={ssrRows ?? undefined} initialNextCursor={ssrNextCursor} />
      <AssetToolbar
        asset={asset}
        activeVersionId={activeVersionId}
        cap={cap}
        commentCount={commentCount}
        commentPanelOpen={panelOpen}
        onToggleComments={togglePanel}
      />
      {cap && (
        <CommentPanel
          publicId={uuid}
          cap={cap}
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
        />
      )}

      {/* Onboarding strip: shown for cap-token pages when not logged in */}
      {mounted && cap && !isLoggedIn && !onboardDismissed && (
        <div className="fixed bottom-16 left-0 right-0 z-40 sm:bottom-12">
          <div className="mx-auto max-w-xl px-4">
            <div className="flex items-center justify-between gap-3 rounded-lg border border-foreground/10 bg-background/95 px-4 py-3 shadow-lg backdrop-blur-sm">
              <p className="text-xs text-foreground/60">
                You're commenting anonymously.{' '}
                <button
                  onClick={() => setShowSignup(true)}
                  className="font-medium text-foreground underline underline-offset-2"
                >
                  Create an account
                </button>{' '}
                to own your identity.
              </p>
              <button
                onClick={dismissOnboard}
                className="shrink-0 text-foreground/30 hover:text-foreground/60"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline signup panel */}
      {mounted && showSignup && (
        <SharePageSignup
          onClose={() => setShowSignup(false)}
          onSuccess={() => {
            setShowSignup(false)
            setIsLoggedIn(true)
          }}
        />
      )}

      {/* Own-agent banner */}
      {mounted && isOwnAgent && (
        <div className="fixed bottom-16 left-0 right-0 z-40 sm:bottom-12">
          <div className="mx-auto max-w-xl px-4">
            <div className="flex items-center justify-between rounded-lg border border-foreground/10 bg-background/95 px-4 py-3 shadow-lg backdrop-blur-sm">
              <p className="text-xs text-foreground/60">
                Your agent published this.
              </p>
              <a
                href="/operator"
                className="text-xs font-medium text-foreground underline underline-offset-2"
              >
                View in dashboard
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Powered by TokenRip badge: shown for read-only pages (no cap token) */}
      {mounted && !cap && (
        <div className="fixed bottom-4 right-4 z-30">
          <a
            href="/"
            className="rounded-md border border-foreground/10 bg-background/80 px-2.5 py-1 font-mono text-[10px] text-foreground/30 backdrop-blur-sm transition-colors hover:text-foreground/50"
          >
            Powered by Tokenrip
          </a>
        </div>
      )}
    </div>
  )
}

/** Inline signup panel for share page onboarding */
function SharePageSignup({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [alias, setAlias] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!displayName.trim() || !password || submitting) return

    setSubmitting(true)
    setError('')
    try {
      const res = await api.post('/v0/auth/register', {
        displayName: displayName.trim(),
        password,
        alias: alias || undefined,
      })
      setSession(res.data.data.auth_token)
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-lg border border-foreground/10 bg-background p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-sm font-bold">Create Account</h2>
          <button onClick={onClose} className="text-foreground/30 hover:text-foreground/60">×</button>
        </div>

        <div className="mt-3 flex gap-3 text-xs text-foreground/50">
          <div className="flex-1 rounded-md border border-foreground/10 bg-foreground/5 px-3 py-2">
            <p className="font-medium text-foreground/70">Browser signup</p>
            <p className="mt-0.5">Quick account creation</p>
          </div>
          <div className="flex-1 rounded-md border border-foreground/10 px-3 py-2">
            <p className="font-medium text-foreground/70">Full capabilities?</p>
            <p className="mt-0.5">
              <code className="text-[10px]">npm i -g @tokenrip/cli</code>
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded border border-status-error/20 bg-status-error/5 px-3 py-2">
            <p className="text-xs text-status-error">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display name"
            autoFocus
            className="w-full rounded-lg border border-foreground/10 bg-foreground/5 px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/25 focus:border-foreground/20 focus:outline-none"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a password"
            className="w-full rounded-lg border border-foreground/10 bg-foreground/5 px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/25 focus:border-foreground/20 focus:outline-none"
          />
          <input
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value.toLowerCase())}
            placeholder="Username (optional)"
            className="w-full rounded-lg border border-foreground/10 bg-foreground/5 px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/25 focus:border-foreground/20 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!displayName.trim() || !password || submitting}
            className="w-full rounded-lg bg-foreground px-3 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

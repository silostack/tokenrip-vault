import { createFileRoute } from '@tanstack/react-router'
import { OAuthAuthorizePage } from '@/components/oauth/OAuthAuthorizePage'

export const Route = createFileRoute('/oauth/authorize')({
  validateSearch: (search: Record<string, unknown>) => ({
    client_id: (search.client_id as string) || '',
    redirect_uri: (search.redirect_uri as string) || '',
    state: (search.state as string) || '',
    code_challenge: (search.code_challenge as string) || '',
    code_challenge_method: (search.code_challenge_method as string) || '',
    response_type: (search.response_type as string) || '',
  }),
  head: () => ({
    meta: [
      { title: 'Connect to Tokenrip' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: OAuthAuthorizeRoute,
})

function OAuthAuthorizeRoute() {
  const params = Route.useSearch()

  if (!params.redirect_uri || !params.code_challenge || !params.state) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm text-foreground/50">Invalid OAuth request.</p>
          <p className="mt-2 text-xs text-foreground/30">
            Missing required OAuth parameters.
          </p>
        </div>
      </div>
    )
  }

  return (
    <OAuthAuthorizePage
      redirectUri={params.redirect_uri}
      state={params.state}
      codeChallenge={params.code_challenge}
    />
  )
}

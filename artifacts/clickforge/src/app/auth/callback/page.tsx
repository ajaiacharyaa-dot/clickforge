import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { createClient } from '@/lib/supabase-client'

/**
 * Handles the Supabase email-confirmation OAuth callback.
 * Supabase appends ?code=... to the redirect URL after the user clicks
 * the confirmation link. We exchange that code for a session and then
 * send the user to the home page.
 */
export default function AuthCallbackPage() {
  const [, setLocation] = useLocation()

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setLocation('/')
      }
    })

    // Also try exchanging a code in the URL if present (PKCE flow)
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code')
    if (code) {
      supabase.auth
        .exchangeCodeForSession(code)
        .then(() => setLocation('/'))
        .catch(() => setLocation('/auth'))
    } else {
      // No code — just go home; session may already be set via cookie
      setTimeout(() => setLocation('/'), 1500)
    }
  }, [setLocation])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Confirming your account…</p>
      </div>
    </div>
  )
}

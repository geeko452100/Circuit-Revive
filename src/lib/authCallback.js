import { formatAuthError } from '../utils/authErrors'

function mapOtpType(type) {
  switch (type) {
    case 'signup':
      return 'signup'
    case 'recovery':
      return 'recovery'
    case 'invite':
      return 'invite'
    case 'email_change':
      return 'email_change'
    default:
      return 'email'
  }
}

/**
 * Complete Supabase auth redirects (email confirm, password reset, OAuth).
 * Uses token_hash when present so email links work across browsers/devices.
 */
export async function completeAuthCallback(supabase) {
  const params = new URLSearchParams(window.location.search)
  const tokenHash = params.get('token_hash')
  const type = params.get('type')

  if (tokenHash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: mapOtpType(type),
    })

    if (error) {
      return { session: null, error: formatAuthError(error) }
    }

    return { session: data.session, error: null }
  }

  // Implicit / hash tokens — detectSessionInUrl runs on client init
  const {
    data: { session: existingSession },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    return { session: null, error: formatAuthError(sessionError) }
  }

  if (existingSession) {
    return { session: existingSession, error: null }
  }

  const code = params.get('code')
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      const message = error.message?.includes('PKCE')
        ? 'This link must be opened in the same browser where you signed up. Confirm your email, then sign in with your password here instead.'
        : formatAuthError(error)

      return { session: null, error: message }
    }

    return { session: data.session, error: null }
  }

  return {
    session: null,
    error:
      'Could not complete sign in. If you confirmed your email, return to login and sign in with your password.',
  }
}

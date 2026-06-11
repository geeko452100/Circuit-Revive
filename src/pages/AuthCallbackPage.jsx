import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { completeAuthCallback } from '../lib/authCallback'
import { getSupabase } from '../lib/supabase'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const supabase = getSupabase()

    if (!supabase) {
      setError('Supabase is not configured.')
      return undefined
    }

    completeAuthCallback(supabase).then(({ session, error: callbackError }) => {
      if (!active) return

      if (callbackError) {
        setError(callbackError)
        return
      }

      if (session) {
        navigate('/account', { replace: true })
        return
      }

      setError('Could not complete sign in. Return to login and try again.')
    })

    return () => {
      active = false
    }
  }, [navigate])

  return (
    <div className="panel w-full max-w-[440px] p-8 text-left shadow-card">
      <h1 className="!mb-3 text-[1.75rem]">Signing you in…</h1>
      {error ? (
        <>
          <p className="mb-6 text-sm text-danger">{error}</p>
          <Link to="/login" className="btn btn-primary no-underline">
            Back to login
          </Link>
        </>
      ) : (
        <p className="text-text-muted">Finishing authentication.</p>
      )}
    </div>
  )
}

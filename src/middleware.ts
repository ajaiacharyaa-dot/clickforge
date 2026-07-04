import { createServerClient, serializeCookieHeader } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        response.cookies.set(name, value, { ...options, sameSite: 'lax', secure: true })
      },
      remove(name: string, options: any) {
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        response.cookies.delete(name)
      },
    },
  })

  const { data } = await supabase.auth.getSession()
  const session = data.session

  // Redirect unauthenticated users trying to access /dashboard
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Redirect authenticated users trying to access /auth
  if (session && request.nextUrl.pathname === '/auth') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth'],
}

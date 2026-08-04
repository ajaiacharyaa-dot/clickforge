import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createServerClient_Cookies = () => {
  return createServerComponentClient({ cookies })
}

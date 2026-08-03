import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client for sensitive operations
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
export const supabaseServer = createClient(supabaseUrl, serviceRoleKey)

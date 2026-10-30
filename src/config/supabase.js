import { createClient } from '@supabase/supabase-js'
import { env } from './env'

if (!env.supabaseUrl || !env.supabaseAnonKey) {
  throw new Error(
    'VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY precisam estar no .env'
  )
}

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey)
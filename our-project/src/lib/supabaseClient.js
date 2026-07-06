import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum diatur. ' +
    'Lihat SETUP-SUPABASE.md untuk cara mendapatkannya.'
  )
}

// `anon key` ini AMAN untuk ditaruh di frontend/dibundle — memang begitu
// cara kerja Supabase. Yang benar-benar menjaga keamanan data adalah
// Row Level Security (RLS) yang diatur di sisi database (lihat
// supabase-setup.sql), bukan kerahasiaan key ini.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

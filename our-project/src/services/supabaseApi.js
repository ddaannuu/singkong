import { supabase } from '../lib/supabaseClient'

const CONTENT_ROW_ID = 1
const CONTENT_TABLE = 'site_content'
const STORAGE_BUCKET = 'uploads'

// ---------------------------------------------------------------------------
// AUTH
// ---------------------------------------------------------------------------

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(translateAuthError(error.message))
  return data
}

export async function signOut() {
  await supabase.auth.signOut()
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export function onAuthStateChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session))
  return data.subscription
}

function translateAuthError(message) {
  if (/invalid login credentials/i.test(message)) return 'Email atau password salah.'
  if (/email not confirmed/i.test(message)) return 'Email belum dikonfirmasi. Cek inbox, atau konfirmasi manual lewat Supabase Dashboard.'
  return message
}

// ---------------------------------------------------------------------------
// KONTEN (site_content table — satu baris berisi seluruh JSON konten)
// ---------------------------------------------------------------------------

export async function fetchPublishedContent() {
  const { data, error } = await supabase
    .from(CONTENT_TABLE)
    .select('content')
    .eq('id', CONTENT_ROW_ID)
    .single()

  if (error) throw new Error('Gagal memuat konten dari Supabase: ' + error.message)
  return data.content
}

export async function publishContentToSupabase(contentObject) {
  const { error } = await supabase
    .from(CONTENT_TABLE)
    .update({ content: contentObject, updated_at: new Date().toISOString() })
    .eq('id', CONTENT_ROW_ID)

  if (error) throw new Error('Gagal publish ke Supabase: ' + error.message)
}

/**
 * Dengarkan perubahan realtime pada baris konten — dipakai supaya tab lain
 * yang sedang membuka website ikut ter-update otomatis begitu ada publish
 * baru, tanpa perlu refresh manual.
 */
export function subscribeToContentChanges(callback) {
  const channel = supabase
    .channel('site_content_changes')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: CONTENT_TABLE, filter: `id=eq.${CONTENT_ROW_ID}` },
      (payload) => callback(payload.new.content)
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}

// ---------------------------------------------------------------------------
// GAMBAR (Supabase Storage)
// ---------------------------------------------------------------------------

/**
 * Upload gambar (sudah dalam bentuk File/Blob hasil resize) ke Storage,
 * mengembalikan URL publik yang siap dipakai langsung di <img src>.
 */
export async function uploadImageToStorage(key, blob, extension) {
  const filename = `${key}-${Date.now()}.${extension}`
  const path = `${filename}`

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, blob, {
    cacheControl: '31536000', // 1 tahun — aman karena nama file selalu unik per upload
    upsert: false,
    contentType: blob.type
  })

  if (error) throw new Error('Gagal upload gambar: ' + error.message)

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

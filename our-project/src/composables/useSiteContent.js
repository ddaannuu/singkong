import { reactive, watch } from 'vue'
import fallbackContent from '../content/site-content.json'
import { fetchPublishedContent, subscribeToContentChanges } from '../services/supabaseApi'

// ---------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH
// ---------------------------------------------------------------------------
// `content` adalah satu-satunya objek reactive yang dipakai oleh:
//  1. Komponen-komponen publik (Navbar, HeroSection, dll) — read only
//  2. Halaman /admin — read & write (live preview langsung terlihat karena
//     sama-sama menunjuk ke objek reactive yang sama)
//
// Sumber data sebenarnya sekarang ada di Supabase (tabel `site_content`).
// `content/site-content.json` yang ikut ter-bundle hanya dipakai sebagai:
//   a) tampilan awal super cepat sebelum data dari Supabase selesai dimuat
//      (menghindari layar kosong / flash-of-empty-content)
//   b) fallback kalau koneksi ke Supabase gagal (mis. env var belum diatur,
//      internet putus, dsb.)
// ---------------------------------------------------------------------------

const DRAFT_KEY = 'scm_admin_draft_v1'

function deepMerge(base, override) {
  if (Array.isArray(override)) return override
  if (typeof override !== 'object' || override === null) return override
  const result = { ...base }
  for (const key in override) {
    result[key] = deepMerge(base?.[key], override[key])
  }
  return result
}

export const content = reactive(structuredClone(fallbackContent))

// Menyimpan versi terakhir yang benar-benar "published" (dari Supabase),
// dipakai oleh discardDraft() untuk kembali ke versi live, bukan ke
// fallbackContent bawaan yang mungkin sudah usang.
let publishedSnapshot = structuredClone(fallbackContent)

// Status pemuatan awal, bisa dipakai komponen App.vue untuk skeleton/loading
// state kalau diperlukan.
export const contentStatus = reactive({ loading: true, error: null, loadedFromSupabase: false })

// ---------------------------------------------------------------------------
// DRAFT AUTOSAVE (localStorage) — supaya edit admin yang belum di-publish
// tidak hilang kalau tab tidak sengaja ter-reload.
// ---------------------------------------------------------------------------

let saveTimeout = null
let draftWatcherStarted = false

function startDraftAutosave() {
  if (draftWatcherStarted) return
  draftWatcherStarted = true
  watch(
    content,
    (val) => {
      clearTimeout(saveTimeout)
      saveTimeout = setTimeout(() => {
        try {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(val))
        } catch (e) {
          console.warn('Gagal menyimpan draft admin:', e)
        }
      }, 300)
    },
    { deep: true }
  )
}

function applyDraftIfAny() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) {
      const draft = JSON.parse(raw)
      const merged = deepMerge(structuredClone(publishedSnapshot), draft)
      Object.keys(content).forEach((k) => delete content[k])
      Object.assign(content, merged)
    }
  } catch (e) {
    console.warn('Gagal memuat draft admin dari localStorage:', e)
  }
}

export function discardDraft() {
  localStorage.removeItem(DRAFT_KEY)
  const fresh = structuredClone(publishedSnapshot)
  Object.keys(content).forEach((k) => delete content[k])
  Object.assign(content, fresh)
}

export function hasDraft() {
  return !!localStorage.getItem(DRAFT_KEY)
}

export function getPublishedJson() {
  return JSON.stringify(content, null, 2)
}

// ---------------------------------------------------------------------------
// MEMUAT KONTEN DARI SUPABASE
// ---------------------------------------------------------------------------

export async function loadPublishedContent() {
  try {
    const data = await fetchPublishedContent()
    publishedSnapshot = structuredClone(data)
    contentStatus.loadedFromSupabase = true
    contentStatus.error = null

    // Kalau ada draft admin yang belum di-publish, tetap prioritaskan draft
    // itu (supaya kalau admin sedang mengedit lalu ke-refresh, tidak balik
    // ke versi lama). Kalau tidak ada draft, langsung pakai data terbaru.
    if (hasDraft()) {
      applyDraftIfAny()
    } else {
      Object.keys(content).forEach((k) => delete content[k])
      Object.assign(content, structuredClone(data))
    }
  } catch (e) {
    console.warn('Gagal memuat konten dari Supabase, memakai fallback bawaan:', e)
    contentStatus.error = e.message
  } finally {
    contentStatus.loading = false
  }
}

/**
 * Dipanggil setelah admin berhasil publish, supaya "versi live" yang
 * dipakai discardDraft() ikut ter-update tanpa perlu fetch ulang.
 */
export function markAsPublished(newContentSnapshot) {
  publishedSnapshot = structuredClone(newContentSnapshot)
  localStorage.removeItem(DRAFT_KEY)
}

/**
 * Sinkronisasi realtime: kalau ada publish dari sesi/tab lain, konten di
 * tab ini ikut ter-update otomatis (selama tidak sedang ada draft lokal
 * yang belum disimpan, supaya tidak menimpa edit yang sedang berlangsung).
 */
export function initRealtimeSync() {
  return subscribeToContentChanges((newContent) => {
    publishedSnapshot = structuredClone(newContent)
    if (!hasDraft()) {
      Object.keys(content).forEach((k) => delete content[k])
      Object.assign(content, structuredClone(newContent))
    }
  })
}

// ---------------------------------------------------------------------------
// CSS VARIABLE MAPPING
// ---------------------------------------------------------------------------

const CSS_VAR_MAP = {
  colors: {
    primary: '--primary-color',
    primaryHover: '--primary-hover',
    secondary: '--secondary-color',
    accent: '--accent-color',
    background: '--bg-gradient',
    textMain: '--text-main',
    textMuted: '--text-muted',
    textMains: '--text-mains',
    textMuteds: '--text-muteds',
    buttonText: '--button-text-color',
    navbarBg: '--navbar-bg',
    navbarText: '--navbar-text',
    footerBg: '--footer-bg',
    footerText: '--footer-text',
    cardBg: '--card-bg',
    borderColor: '--card-border',
    iconColor: '--icon-color',
    ctaAccent: '--cta-accent',
    ctaAccentHover: '--cta-accent-hover'
  },
  typography: {
    fontFamily: '--font-family',
    titleSize: '--title-size',
    titleWeight: '--title-weight',
    subtitleSize: '--subtitle-size',
    subtitleWeight: '--subtitle-weight',
    paragraphSize: '--paragraph-size',
    paragraphWeight: '--paragraph-weight',
    captionSize: '--caption-size',
    captionWeight: '--caption-weight',
    buttonTextSize: '--button-text-size',
    buttonTextWeight: '--button-text-weight',
    lineHeight: '--line-height-base'
  },
  layout: {
    borderRadiusButton: '--radius-button',
    borderRadiusCard: '--radius-card',
    borderRadiusSection: '--radius-section',
    shadowSoft: '--shadow-soft',
    shadowCard: '--shadow-card',
    sectionPaddingX: '--section-padding-x',
    sectionPaddingY: '--section-padding-y',
    containerMaxWidth: '--container-max-width',
    gridGap: '--grid-gap'
  }
}

function applyCssVars() {
  const root = document.documentElement
  for (const group of Object.keys(CSS_VAR_MAP)) {
    const values = content[group] || {}
    for (const key in CSS_VAR_MAP[group]) {
      const cssVar = CSS_VAR_MAP[group][key]
      if (values[key] !== undefined) {
        root.style.setProperty(cssVar, values[key])
      }
    }
  }
}

export function initSiteContent() {
  applyCssVars()
  applyDraftIfAny()
  startDraftAutosave()
  watch(
    () => [content.colors, content.typography, content.layout],
    applyCssVars,
    { deep: true }
  )
  // Muat data asli dari Supabase secara asinkron (tidak blocking render).
  loadPublishedContent()
}

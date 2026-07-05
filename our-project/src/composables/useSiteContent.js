import { reactive, watch } from 'vue'
import defaultContent from '../content/site-content.json'

// ---------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH
// ---------------------------------------------------------------------------
// `content` adalah satu-satunya objek reactive yang dipakai oleh:
//  1. Komponen-komponen publik (Navbar, HeroSection, dll) — read only
//  2. Halaman /admin — read & write (live preview langsung terlihat karena
//     sama-sama menunjuk ke objek reactive yang sama)
//
// Saat pertama kali dibuka, kita coba muat draft yang tersimpan di
// localStorage (perubahan admin yang BELUM di-publish ke GitHub). Kalau
// tidak ada draft, pakai isi bawaan dari site-content.json (yaitu versi
// yang sudah live / sudah pernah di-publish sebelumnya, karena file ini
// ikut ter-bundle ulang setiap kali Vercel build).
// ---------------------------------------------------------------------------

const DRAFT_KEY = 'scm_admin_draft_v1'

function loadInitialContent() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) {
      const draft = JSON.parse(raw)
      // merge dangkal per section supaya field baru dari default tetap ada
      // walau draft lama belum punya field tersebut
      return deepMerge(structuredClone(defaultContent), draft)
    }
  } catch (e) {
    console.warn('Gagal memuat draft admin dari localStorage:', e)
  }
  return structuredClone(defaultContent)
}

function deepMerge(base, override) {
  if (Array.isArray(override)) return override
  if (typeof override !== 'object' || override === null) return override
  const result = { ...base }
  for (const key in override) {
    result[key] = deepMerge(base?.[key], override[key])
  }
  return result
}

export const content = reactive(loadInitialContent())

// Simpan otomatis ke localStorage setiap kali ada perubahan (draft autosave),
// supaya kalau tab tidak sengaja ter-reload, edit yang belum di-publish
// tidak hilang.
let saveTimeout = null
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

export function discardDraft() {
  localStorage.removeItem(DRAFT_KEY)
  const fresh = structuredClone(defaultContent)
  Object.keys(content).forEach((k) => delete content[k])
  Object.assign(content, fresh)
}

export function hasDraft() {
  return !!localStorage.getItem(DRAFT_KEY)
}

export function getPublishedJson() {
  // JSON yang akan dikirim ke GitHub saat tombol "Publish" ditekan
  return JSON.stringify(content, null, 2)
}

// ---------------------------------------------------------------------------
// CSS VARIABLE MAPPING
// ---------------------------------------------------------------------------
// Setiap kali `content.colors`, `content.typography`, atau `content.layout`
// berubah, kita tulis ulang CSS custom properties di :root. Karena semua
// CSS yang sudah ada (main.css) sudah memakai var(--xxx), tampilan akan
// ter-update secara realtime tanpa perlu mengubah struktur/desain apa pun.
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
  watch(
    () => [content.colors, content.typography, content.layout],
    applyCssVars,
    { deep: true }
  )
}

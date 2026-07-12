<template>
  <div class="adm-root">

    <!-- ================= LOADING SESSION ================= -->
    <div v-if="checkingSession" class="adm-boot-screen">
      <i class="fas fa-spinner fa-spin"></i> Memuat...
    </div>

    <!-- ================= LOGIN GATE ================= -->
    <AdminLoginScreen
      v-else-if="!authed"
      v-model:email="email"
      v-model:password="password"
      :login-error="loginError"
      :logging-in="loggingIn"
      @submit="handleLogin"
    />

    <!-- ================= DASHBOARD ================= -->
    <div v-else class="adm-shell">
      <AdminSidebar
        v-model="activeSection"
        :sections="sections"
        :open="sidebarOpen"
        @logout="handleLogout"
        @close="sidebarOpen = false"
      />

      <div class="adm-main">
        <AdminTopBar
          :title="activeSectionMeta.label"
          :subtitle="activeSectionMeta.desc"
          :draft-exists="draftExists"
          :publishing="publishing"
          :preview-open="previewOpen"
          @publish="handlePublish"
          @reset="handleReset"
          @download="handleDownloadJson"
          @toggle-preview="previewOpen = !previewOpen"
          @toggle-sidebar="sidebarOpen = !sidebarOpen"
        />

        <div class="adm-body" :class="{ 'adm-body-split': previewOpen }">
          <div class="adm-content">
            <div v-if="contentStatus.error" class="adm-status-text adm-status-error adm-conn-banner">
              <i class="fas fa-triangle-exclamation"></i>
              <div>
                <strong>Status Koneksi Supabase:</strong> {{ contentStatus.error }}<br />
                <span class="adm-hint">
                  Website sedang menampilkan data cadangan bawaan (bukan data live). Cek env variable
                  <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code>, lalu refresh halaman ini.
                </span>
              </div>
            </div>

            <component :is="activeSectionMeta.component" />

            <p
              v-if="publishResult"
              class="adm-status-text"
              :class="publishResult.ok ? 'adm-status-success' : 'adm-status-error'"
            >
              {{ publishResult.message }}
            </p>
          </div>

          <div v-if="previewOpen" class="adm-preview-pane">
            <div class="adm-preview-label"><i class="fas fa-eye"></i> Live Preview</div>
            <div class="adm-preview-frame">
              <Navbar />
              <HeroSection />
              <About />
              <Stat />
              <FeaturesSection />
              <HowItWorks />
              <Testimoni />
              <Action />
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, markRaw, onMounted, onBeforeUnmount } from 'vue'
import {
  content,
  contentStatus,
  discardDraft,
  hasDraft,
  getPublishedJson,
  markAsPublished,
  enableAdminDraftMode,
  disableAdminDraftMode
} from '../composables/useSiteContent'
import { signIn, signOut, getSession, onAuthStateChange, publishContentToSupabase } from '../services/supabaseApi'

import Navbar from '../components/landing-page/Navbar.vue'
import HeroSection from '../components/landing-page/HeroSection.vue'
import About from '../components/landing-page/About.vue'
import Stat from '../components/landing-page/Stat.vue'
import FeaturesSection from '../components/landing-page/FeaturesSection.vue'
import HowItWorks from '../components/landing-page/HowItWorks.vue'
import Testimoni from '../components/landing-page/Testimoni.vue'
import Action from '../components/landing-page/Action.vue'
import Footer from '../components/landing-page/Footer.vue'

import AdminSidebar from '../components/admin/AdminSidebar.vue'
import AdminTopBar from '../components/admin/AdminTopBar.vue'
import AdminLoginScreen from '../components/admin/AdminLoginScreen.vue'

import DesignPanel from '../components/admin/panels/DesignPanel.vue'
import ImagesPanel from '../components/admin/panels/ImagesPanel.vue'
import NavbarPanel from '../components/admin/panels/NavbarPanel.vue'
import HeroPanel from '../components/admin/panels/HeroPanel.vue'
import AboutPanel from '../components/admin/panels/AboutPanel.vue'
import StatsPanel from '../components/admin/panels/StatsPanel.vue'
import FeaturesPanel from '../components/admin/panels/FeaturesPanel.vue'
import HowItWorksPanel from '../components/admin/panels/HowItWorksPanel.vue'
import TestimoniPanel from '../components/admin/panels/TestimoniPanel.vue'
import ActionPanel from '../components/admin/panels/ActionPanel.vue'
import FooterPanel from '../components/admin/panels/FooterPanel.vue'

import '../assets/admin-theme.css'

// ---------- Session ----------
const checkingSession = ref(true)
const authed = ref(false)
const email = ref('')
const password = ref('')
const loginError = ref('')
const loggingIn = ref(false)
let authSub = null

onMounted(async () => {
  enableAdminDraftMode()
  const session = await getSession()
  authed.value = !!session
  checkingSession.value = false
  authSub = onAuthStateChange((session) => {
    authed.value = !!session
  })
})

onBeforeUnmount(() => {
  if (authSub) authSub.unsubscribe()
  disableAdminDraftMode()
})

async function handleLogin() {
  loginError.value = ''
  loggingIn.value = true
  try {
    await signIn(email.value, password.value)
    authed.value = true
    password.value = ''
  } catch (e) {
    loginError.value = e.message
  } finally {
    loggingIn.value = false
  }
}

async function handleLogout() {
  await signOut()
  authed.value = false
}

// ---------- Sidebar navigation ----------
const sections = [
  { key: 'design', label: 'Desain', desc: 'Warna, typography, dan layout website.', icon: 'fas fa-palette', component: markRaw(DesignPanel) },
  { key: 'images', label: 'Gambar', desc: 'Logo dan foto hero.', icon: 'fas fa-image', component: markRaw(ImagesPanel) },
  { key: 'navbar', label: 'Navbar', desc: 'Logo teks, tombol CTA, dan menu.', icon: 'fas fa-compass', component: markRaw(NavbarPanel) },
  { key: 'hero', label: 'Hero Section', desc: 'Konten paling atas halaman.', icon: 'fas fa-house', component: markRaw(HeroPanel) },
  { key: 'about', label: 'Tentang Kami', desc: 'Badge, judul, misi, dan visi.', icon: 'fas fa-circle-info', component: markRaw(AboutPanel) },
  { key: 'stats', label: 'Statistik', desc: 'Angka pencapaian di website.', icon: 'fas fa-chart-column', component: markRaw(StatsPanel) },
  { key: 'features', label: 'Fitur', desc: 'Daftar keunggulan produk.', icon: 'fas fa-star', component: markRaw(FeaturesPanel) },
  { key: 'howItWorks', label: 'Cara Kerja', desc: 'Langkah-langkah proses.', icon: 'fas fa-diagram-project', component: markRaw(HowItWorksPanel) },
  { key: 'testimoni', label: 'Testimoni', desc: 'Ulasan dari pengguna.', icon: 'fas fa-comments', component: markRaw(TestimoniPanel) },
  { key: 'action', label: 'Ajakan (CTA)', desc: 'Section ajakan sebelum footer.', icon: 'fas fa-bullhorn', component: markRaw(ActionPanel) },
  { key: 'footer', label: 'Footer', desc: 'Teks paling bawah website.', icon: 'fas fa-align-left', component: markRaw(FooterPanel) }
]

const activeSection = ref('design')
const activeSectionMeta = computed(() => sections.find((s) => s.key === activeSection.value) || sections[0])

// ---------- Preview ----------
const previewOpen = ref(false)

// ---------- Mobile sidebar drawer ----------
const sidebarOpen = ref(false)

// ---------- Publish / draft actions ----------
const publishing = ref(false)
const publishResult = ref(null)
const draftExists = computed(() => hasDraft())

async function handlePublish() {
  publishing.value = true
  publishResult.value = null
  try {
    await publishContentToSupabase(content)
    markAsPublished(content)
    publishResult.value = { ok: true, message: 'Berhasil dipublikasikan! Perubahan langsung tayang untuk semua pengunjung, tanpa perlu build ulang.' }
  } catch (e) {
    publishResult.value = { ok: false, message: 'Gagal publish: ' + e.message }
  } finally {
    publishing.value = false
  }
}

function handleReset() {
  if (confirm('Semua perubahan yang belum di-publish akan hilang dan kembali ke versi live terakhir. Lanjutkan?')) {
    discardDraft()
    publishResult.value = null
  }
}

function handleDownloadJson() {
  const blob = new Blob([getPublishedJson()], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'site-content.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.adm-boot-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--adm-text-muted);
  font-family: var(--adm-font);
  background: var(--adm-bg, #f2f5f4);
}

.adm-body {
  display: flex;
  align-items: flex-start;
}

.adm-body .adm-content {
  flex: 1;
}

.adm-body-split .adm-content {
  max-width: 640px;
  margin: 0;
}

.adm-conn-banner {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-bottom: 20px;
}

.adm-preview-pane {
  position: sticky;
  top: 73px;
  width: 46%;
  min-width: 380px;
  height: calc(100vh - 73px);
  border-left: 1px solid var(--adm-border);
  background: var(--adm-card-bg);
  display: flex;
  flex-direction: column;
}

.adm-preview-label {
  padding: 14px 20px;
  font-size: 13px;
  font-weight: 700;
  color: var(--adm-text-muted);
  border-bottom: 1px solid var(--adm-border-soft);
  display: flex;
  align-items: center;
  gap: 8px;
}

.adm-preview-frame {
  flex: 1;
  overflow-y: auto;
}

/* ---------- Mobile / narrow tablet ---------- */
@media (max-width: 1000px) {
  .adm-body-split {
    flex-direction: column;
  }

  .adm-body-split .adm-content {
    max-width: none;
  }

  .adm-preview-pane {
    position: static;
    width: 100%;
    min-width: 0;
    height: 70vh;
    border-left: none;
    border-top: 1px solid var(--adm-border);
  }
}

@media (max-width: 640px) {
  .adm-preview-pane { height: 60vh; }
}
</style>
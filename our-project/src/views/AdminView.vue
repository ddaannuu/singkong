<template>
  <div class="admin-page">

    <!-- ================= LOGIN GATE ================= -->
    <div v-if="!authed" class="login-box">
      <h1>🔐 Admin Login</h1>
      <p class="muted">Masuk untuk mengelola konten Second Chance Market.</p>
      <form @submit.prevent="handleLogin">
        <input
          v-model="passwordInput"
          type="password"
          placeholder="Password admin"
          autofocus
        />
        <button type="submit">Masuk</button>
      </form>
      <p v-if="loginError" class="error-text">{{ loginError }}</p>
    </div>

    <!-- ================= ADMIN PANEL ================= -->
    <div v-else class="admin-shell">

      <header class="admin-header">
        <div>
          <h1>🛠️ Admin — Second Chance Market</h1>
          <p class="muted">Edit konten, warna, typography, dan layout website di sini.</p>
        </div>
        <div class="header-actions">
          <span v-if="draftExists" class="badge-draft">● Ada perubahan belum di-publish</span>
          <button class="btn-secondary" @click="handleLogout">Keluar</button>
        </div>
      </header>

      <div class="admin-layout">

        <!-- ============ EDITOR ============ -->
        <div class="editor-column">

          <!-- GITHUB CONFIG -->
          <details class="panel" open>
            <summary>⚙️ Koneksi GitHub (untuk Publish)</summary>
            <div class="panel-body">
              <div class="field">
                <label>Owner (username/organisasi)</label>
                <input v-model="gh.owner" placeholder="mis. johndoe" />
              </div>
              <div class="field">
                <label>Nama Repo</label>
                <input v-model="gh.repo" placeholder="mis. second-chance-market" />
              </div>
              <div class="field">
                <label>Branch</label>
                <input v-model="gh.branch" placeholder="main" />
              </div>
              <div class="field">
                <label>Path file konten di repo</label>
                <input v-model="gh.path" placeholder="src/content/site-content.json" />
              </div>
              <div class="field">
                <label>Personal Access Token</label>
                <input v-model="gh.token" type="password" placeholder="ghp_xxx atau github_pat_xxx" />
                <p class="hint">Token disimpan hanya di browser ini (localStorage), tidak pernah dikirim ke mana pun selain api.github.com.</p>
              </div>
              <div class="field-row">
                <button class="btn-secondary" @click="saveGithubConfig">Simpan Pengaturan</button>
                <button class="btn-secondary" @click="handleTestConnection" :disabled="testing">
                  {{ testing ? 'Menguji...' : 'Tes Koneksi' }}
                </button>
              </div>
              <p v-if="testResult" :class="testResult.ok ? 'success-text' : 'error-text'">{{ testResult.message }}</p>
            </div>
          </details>

          <!-- COLORS -->
          <details class="panel">
            <summary>🎨 Warna</summary>
            <div class="panel-body grid-2">
              <div class="field" v-for="f in colorFields" :key="f.key">
                <label>{{ f.label }}</label>
                <div class="color-row">
                  <input
                    v-if="isHex(content.colors[f.key])"
                    type="color"
                    v-model="content.colors[f.key]"
                  />
                  <input type="text" v-model="content.colors[f.key]" />
                </div>
              </div>
            </div>
          </details>

          <!-- TYPOGRAPHY -->
          <details class="panel">
            <summary>🔤 Typography</summary>
            <div class="panel-body grid-2">
              <div class="field">
                <label>Font Family (CSS)</label>
                <input v-model="content.typography.fontFamily" />
              </div>
              <div class="field">
                <label>Line Height Dasar</label>
                <input v-model="content.typography.lineHeight" />
              </div>
              <div class="field" v-for="f in typographyFields" :key="f.key">
                <label>{{ f.label }}</label>
                <input v-model="content.typography[f.key]" />
              </div>
            </div>
          </details>

          <!-- LAYOUT -->
          <details class="panel">
            <summary>📐 Layout</summary>
            <div class="panel-body grid-2">
              <div class="field" v-for="f in layoutFields" :key="f.key">
                <label>{{ f.label }}</label>
                <input v-model="content.layout[f.key]" />
              </div>
            </div>
          </details>

          <!-- IMAGES -->
          <details class="panel">
            <summary>🖼️ Gambar</summary>
            <div class="panel-body">
              <p class="hint">
                Pilih gambar akan langsung terlihat di Live Preview (belum tersimpan permanen).
                Gambar baru akan ikut ter-upload ke GitHub otomatis saat Anda klik
                <strong>🚀 Publish ke GitHub</strong> di bagian bawah — jadi tidak perlu koneksi
                GitHub aktif hanya untuk mencoba-coba tampilan gambar terlebih dahulu.
              </p>

              <div v-for="img in imageFields" :key="img.key" class="list-item-block">
                <label class="sub-label">{{ img.label }}</label>
                <img :src="content.images[img.key]" :alt="img.label" class="image-preview" />
                <input
                  type="file"
                  accept="image/*"
                  @change="(e) => handleImageUpload(img.key, img.maxWidth, e)"
                />
                <p v-if="imageState[img.key].uploading" class="hint">⏳ Mengunggah & mengompres gambar...</p>
                <p v-if="imageState[img.key].result" :class="imageState[img.key].result.ok ? 'success-text' : 'error-text'">
                  {{ imageState[img.key].result.message }}
                </p>
              </div>
            </div>
          </details>

          <!-- NAVBAR -->
          <details class="panel">
            <summary>🧭 Navbar</summary>
            <div class="panel-body">
              <div class="field">
                <label>Teks Logo</label>
                <input v-model="content.navbar.logoText" />
              </div>
              <div class="field">
                <label>Teks Tombol CTA</label>
                <input v-model="content.navbar.ctaText" />
              </div>
              <label class="sub-label">Menu Navigasi</label>
              <div v-for="(item, i) in content.navbar.menu" :key="i" class="list-item">
                <input v-model="item.label" placeholder="Label" />
                <input v-model="item.href" placeholder="#link" />
                <button class="btn-danger-mini" @click="content.navbar.menu.splice(i, 1)">✕</button>
              </div>
              <button class="btn-add" @click="content.navbar.menu.push({ label: 'Menu Baru', href: '#' })">+ Tambah Menu</button>
            </div>
          </details>

          <!-- HERO -->
          <details class="panel">
            <summary>🏠 Hero Section</summary>
            <div class="panel-body">
              <div class="field">
                <label>Judul (sebelum highlight)</label>
                <input v-model="content.hero.titleBefore" />
              </div>
              <div class="field">
                <label>Judul (bagian highlight)</label>
                <input v-model="content.hero.titleHighlight" />
              </div>
              <div class="field">
                <label>Sub-pesan (highlight, tebal)</label>
                <textarea v-model="content.hero.subtitleHighlight" rows="2"></textarea>
              </div>
              <div class="field">
                <label>Paragraf Subjudul</label>
                <textarea v-model="content.hero.subtitle" rows="2"></textarea>
              </div>
              <div class="field">
                <label>Teks Tombol Utama</label>
                <input v-model="content.hero.primaryBtnText" />
              </div>
              <div class="field">
                <label>Teks Tombol Outline</label>
                <input v-model="content.hero.outlineBtnText" />
              </div>
            </div>
          </details>

          <!-- FEATURES -->
          <details class="panel">
            <summary>⭐ Fitur</summary>
            <div class="panel-body">
              <div class="field">
                <label>Judul Section</label>
                <input v-model="content.features.sectionTitle" />
              </div>
              <div class="field">
                <label>Intro (Tebal)</label>
                <textarea v-model="content.features.introBold" rows="2"></textarea>
              </div>
              <div class="field">
                <label>Intro (Teks)</label>
                <textarea v-model="content.features.introText" rows="3"></textarea>
              </div>
              <label class="sub-label">Daftar Fitur</label>
              <div v-for="(item, i) in content.features.items" :key="i" class="list-item-block">
                <div class="field">
                  <label>Icon (kelas Font Awesome)</label>
                  <input v-model="item.icon" placeholder="fas fa-box-open" />
                </div>
                <div class="field">
                  <label>Judul</label>
                  <input v-model="item.title" />
                </div>
                <div class="field">
                  <label>Deskripsi</label>
                  <textarea v-model="item.text" rows="2"></textarea>
                </div>
                <button class="btn-danger-mini" @click="content.features.items.splice(i, 1)">✕ Hapus Fitur Ini</button>
              </div>
              <button class="btn-add" @click="content.features.items.push({ icon: 'fas fa-star', title: 'Fitur Baru', text: 'Deskripsi fitur.' })">+ Tambah Fitur</button>
            </div>
          </details>

          <!-- HOW IT WORKS -->
          <details class="panel">
            <summary>🔄 Cara Kerja</summary>
            <div class="panel-body">
              <div class="field">
                <label>Judul Section</label>
                <input v-model="content.howItWorks.sectionTitle" />
              </div>
              <label class="sub-label">Langkah-langkah</label>
              <div v-for="(step, i) in content.howItWorks.steps" :key="i" class="list-item-block">
                <div class="field">
                  <label>Langkah {{ i + 1 }} — Judul</label>
                  <input v-model="step.title" />
                </div>
                <div class="field">
                  <label>Deskripsi</label>
                  <textarea v-model="step.text" rows="2"></textarea>
                </div>
                <button class="btn-danger-mini" @click="content.howItWorks.steps.splice(i, 1)">✕ Hapus Langkah Ini</button>
              </div>
              <button class="btn-add" @click="content.howItWorks.steps.push({ title: 'Langkah Baru', text: 'Deskripsi langkah.' })">+ Tambah Langkah</button>
            </div>
          </details>

          <!-- TESTIMONI -->
          <details class="panel">
            <summary>💬 Testimoni</summary>
            <div class="panel-body">
              <div class="field">
                <label>Judul Section</label>
                <input v-model="content.testimoni.sectionTitle" />
              </div>
              <div class="field">
                <label>Teks Tombol CTA Bawah</label>
                <input v-model="content.testimoni.ctaButtonText" />
              </div>
              <label class="sub-label">Daftar Testimoni</label>
              <div v-for="(item, i) in content.testimoni.items" :key="item.id" class="list-item-block">
                <div class="field">
                  <label>Nama</label>
                  <input v-model="item.name" />
                </div>
                <div class="field">
                  <label>Jurusan/Angkatan</label>
                  <input v-model="item.major" />
                </div>
                <div class="field">
                  <label>Isi Testimoni</label>
                  <textarea v-model="item.text" rows="2"></textarea>
                </div>
                <button class="btn-danger-mini" @click="content.testimoni.items.splice(i, 1)">✕ Hapus Testimoni Ini</button>
              </div>
              <button class="btn-add" @click="addTestimoni">+ Tambah Testimoni</button>
            </div>
          </details>

          <!-- ACTION -->
          <details class="panel">
            <summary>📣 Call To Action</summary>
            <div class="panel-body">
              <div class="field">
                <label>Judul</label>
                <textarea v-model="content.action.title" rows="2"></textarea>
              </div>
              <div class="field">
                <label>Deskripsi (baris 1)</label>
                <input v-model="content.action.descriptionLine1" />
              </div>
              <div class="field">
                <label>Deskripsi (baris 2)</label>
                <input v-model="content.action.descriptionLine2" />
              </div>
              <div class="field">
                <label>Teks Tombol</label>
                <input v-model="content.action.buttonText" />
              </div>
            </div>
          </details>

          <!-- FOOTER -->
          <details class="panel">
            <summary>📄 Footer</summary>
            <div class="panel-body">
              <div class="field">
                <label>Baris 1</label>
                <input v-model="content.footer.line1" />
              </div>
              <div class="field">
                <label>Baris 2</label>
                <input v-model="content.footer.line2" />
              </div>
            </div>
          </details>

          <!-- PUBLISH ACTIONS -->
          <div class="publish-bar">
            <button class="btn-danger" @click="handleReset">↺ Reset ke Versi Live</button>
            <button class="btn-secondary" @click="handleDownloadJson">⬇ Download JSON</button>
            <button class="btn-primary" @click="handlePublish" :disabled="publishing">
              {{ publishing ? 'Mempublikasikan...' : '🚀 Publish ke GitHub' }}
            </button>
          </div>
          <p v-if="publishResult" :class="publishResult.ok ? 'success-text' : 'error-text'">{{ publishResult.message }}</p>
        </div>

        <!-- ============ LIVE PREVIEW ============ -->
        <div class="preview-column">
          <div class="preview-label">👁️ Live Preview</div>
          <div class="preview-frame">
            <Navbar />
            <HeroSection />
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
</template>

<script>
import { content, discardDraft, hasDraft, getPublishedJson } from '../composables/useSiteContent'
import { publishContent, testConnection, publishImage } from '../services/githubApi'
import { resizeImage } from '../utils/imageResize'

import Navbar from '../components/Navbar.vue'
import HeroSection from '../components/HeroSection.vue'
import FeaturesSection from '../components/FeaturesSection.vue'
import HowItWorks from '../components/HowItWorks.vue'
import Testimoni from '../components/Testimoni.vue'
import Action from '../components/Action.vue'
import Footer from '../components/Footer.vue'

const SESSION_KEY = 'scm_admin_authed'
const GH_CONFIG_KEY = 'scm_admin_gh_config'
const GH_TOKEN_KEY = 'scm_admin_gh_token'

async function sha256Hex(str) {
  const bytes = new TextEncoder().encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export default {
  name: 'AdminView',

  components: { Navbar, HeroSection, FeaturesSection, HowItWorks, Testimoni, Action, Footer },

  data() {
    return {
      content,
      authed: false,
      passwordInput: '',
      loginError: '',

      testing: false,
      testResult: null,
      publishing: false,
      publishResult: null,

      gh: {
        owner: import.meta.env.VITE_GITHUB_OWNER || '',
        repo: import.meta.env.VITE_GITHUB_REPO || '',
        branch: import.meta.env.VITE_GITHUB_BRANCH || 'main',
        path: import.meta.env.VITE_GITHUB_PATH || 'src/content/site-content.json',
        token: ''
      },

      imageFields: [
        { key: 'logo', label: 'Logo', maxWidth: 400, path: 'public/uploads' },
        { key: 'hero', label: 'Foto Hero', maxWidth: 1600, path: 'public/uploads' }
      ],
      imageState: {
        logo: { uploading: false, result: null },
        hero: { uploading: false, result: null }
      },
      pendingImages: {},
      // Gambar yang sudah dipilih & di-resize secara lokal tapi BELUM
      // di-upload ke GitHub (menunggu tombol "Publish ke GitHub").
      pendingImages: {
        logo: null,
        hero: null
      },

      colorFields: [
        { key: 'primary', label: 'Warna Utama (Primary)' },
        { key: 'primaryHover', label: 'Warna Utama saat Hover' },
        { key: 'secondary', label: 'Warna Sekunder' },
        { key: 'accent', label: 'Warna Aksen' },
        { key: 'background', label: 'Warna Background Utama' },
        { key: 'textMain', label: 'Warna Teks (di background gelap)' },
        { key: 'textMuted', label: 'Warna Teks Muted (di background gelap)' },
        { key: 'textMains', label: 'Warna Teks Utama (di background terang)' },
        { key: 'textMuteds', label: 'Warna Teks Sekunder (di background terang)' },
        { key: 'buttonText', label: 'Warna Teks Tombol' },
        { key: 'navbarBg', label: 'Warna Background Navbar' },
        { key: 'navbarText', label: 'Warna Teks Navbar' },
        { key: 'footerBg', label: 'Warna Background Footer' },
        { key: 'footerText', label: 'Warna Teks Footer' },
        { key: 'cardBg', label: 'Warna Card' },
        { key: 'borderColor', label: 'Warna Border/Garis' },
        { key: 'iconColor', label: 'Warna Icon' },
        { key: 'ctaAccent', label: 'Warna Tombol Section Ajakan (CTA)' },
        { key: 'ctaAccentHover', label: 'Warna Tombol CTA saat Hover' }
      ],

      typographyFields: [
        { key: 'titleSize', label: 'Ukuran Judul (H1)' },
        { key: 'titleWeight', label: 'Ketebalan Judul (H1)' },
        { key: 'subtitleSize', label: 'Ukuran Subjudul' },
        { key: 'subtitleWeight', label: 'Ketebalan Subjudul' },
        { key: 'paragraphSize', label: 'Ukuran Paragraf' },
        { key: 'paragraphWeight', label: 'Ketebalan Paragraf' },
        { key: 'captionSize', label: 'Ukuran Caption' },
        { key: 'captionWeight', label: 'Ketebalan Caption' },
        { key: 'buttonTextSize', label: 'Ukuran Teks Tombol' },
        { key: 'buttonTextWeight', label: 'Ketebalan Teks Tombol' }
      ],

      layoutFields: [
        { key: 'borderRadiusButton', label: 'Border Radius Tombol' },
        { key: 'borderRadiusCard', label: 'Border Radius Card' },
        { key: 'borderRadiusSection', label: 'Border Radius Section' },
        { key: 'shadowSoft', label: 'Shadow Halus (navbar, dll)' },
        { key: 'shadowCard', label: 'Shadow Card' },
        { key: 'sectionPaddingX', label: 'Padding Kiri/Kanan Section' },
        { key: 'sectionPaddingY', label: 'Padding Atas/Bawah Section' },
        { key: 'containerMaxWidth', label: 'Lebar Maksimum Konten' },
        { key: 'gridGap', label: 'Jarak Antar Grid/Card' }
      ]
    }
  },

  computed: {
    draftExists() {
      return hasDraft()
    }
  },

  created() {
    this.authed = sessionStorage.getItem(SESSION_KEY) === '1'
    this.loadGithubConfig()
  },

  methods: {
    isHex(value) {
      return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value || '')
    },

    async handleLogin() {
      this.loginError = ''
      const configuredHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH
      if (!configuredHash) {
        this.loginError = 'VITE_ADMIN_PASSWORD_HASH belum diatur di environment variables. Lihat SETUP-ADMIN.md.'
        return
      }
      const inputHash = await sha256Hex(this.passwordInput)
      if (inputHash.toLowerCase() === configuredHash.toLowerCase()) {
        this.authed = true
        sessionStorage.setItem(SESSION_KEY, '1')
        this.passwordInput = ''
      } else {
        this.loginError = 'Password salah. Coba lagi.'
      }
    },

    handleLogout() {
      this.authed = false
      sessionStorage.removeItem(SESSION_KEY)
    },

    loadGithubConfig() {
      try {
        const raw = localStorage.getItem(GH_CONFIG_KEY)
        if (raw) Object.assign(this.gh, JSON.parse(raw))
        const token = localStorage.getItem(GH_TOKEN_KEY)
        if (token) this.gh.token = token
      } catch (e) {
        console.warn('Gagal memuat konfigurasi GitHub:', e)
      }
    },

    saveGithubConfig() {
      const { owner, repo, branch, path, token } = this.gh
      localStorage.setItem(GH_CONFIG_KEY, JSON.stringify({ owner, repo, branch, path }))
      if (token) localStorage.setItem(GH_TOKEN_KEY, token)
      this.testResult = { ok: true, message: 'Pengaturan disimpan di browser ini.' }
    },

    async handleTestConnection() {
      this.testing = true
      this.testResult = null
      try {
        await testConnection(this.gh)
        this.testResult = { ok: true, message: '✅ Koneksi berhasil! Token & repo valid.' }
      } catch (e) {
        this.testResult = { ok: false, message: '❌ ' + e.message }
      } finally {
        this.testing = false
      }
    },

    async handlePublish() {
      this.publishing = true
      this.publishResult = null
      try {
        if (!this.gh.owner || !this.gh.repo || !this.gh.token) {
          throw new Error('Lengkapi dulu Owner, Repo, dan Token pada bagian Koneksi GitHub.')
        }

        // 1) Upload dulu semua gambar yang masih berupa preview lokal
        //    (data URL), lalu ganti isi content.images dengan path final
        //    di repo, supaya site-content.json yang di-publish tidak
        //    berisi data URL raksasa, melainkan path bersih.
        const pendingKeys = Object.keys(this.pendingImages)
        for (const key of pendingKeys) {
          const { base64, mimeType, extension } = this.pendingImages[key]
          const filename = `${key}-${Date.now()}.${extension}`
          const targetPath = `public/uploads/${filename}`

          this.imageState[key] = { uploading: true, result: null }

          await publishImage({
            ...this.gh,
            path: targetPath,
            base64Content: base64,
            commitMessage: `chore: upload gambar ${key} via Admin CMS`
          })

          this.content.images[key] = `/uploads/${filename}`
          delete this.pendingImages[key]
          this.imageState[key] = { uploading: false, result: { ok: true, message: '✅ Terupload ke GitHub.' } }
        }

        // 2) Publish site-content.json (sekarang sudah berisi path gambar
        //    final, bukan data URL sementara).
        await publishContent({
          ...this.gh,
          jsonString: getPublishedJson(),
          commitMessage: 'chore: update konten website via Admin CMS'
        })

        this.publishResult = {
          ok: true,
          message: '✅ Berhasil dipublikasikan! Vercel akan otomatis mem-build ulang, biasanya selesai dalam ~1 menit.'
        }
      } catch (e) {
        this.publishResult = { ok: false, message: '❌ Gagal publish: ' + e.message }
      } finally {
        this.publishing = false
      }
    },

    handleReset() {
      if (confirm('Semua perubahan yang belum di-publish akan hilang dan kembali ke versi live terakhir. Lanjutkan?')) {
        discardDraft()
        this.pendingImages = {}
        this.imageState = {
          logo: { uploading: false, result: null },
          hero: { uploading: false, result: null }
        }
        this.publishResult = null
      }
    },

    handleDownloadJson() {
      const blob = new Blob([getPublishedJson()], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'site-content.json'
      a.click()
      URL.revokeObjectURL(url)
    },

    async handleImageUpload(key, maxWidth, event) {
      const file = event.target.files[0]
      if (!file) return

      this.imageState[key] = { uploading: true, result: null }

      try {
        const { base64, mimeType, extension } = await resizeImage(file, { maxWidth })

        // Simpan sebagai "pending" — belum dikirim ke GitHub. Preview
        // (data URL) langsung dipasang ke content.images supaya terlihat
        // instan di Live Preview, dan ikut tersimpan di draft localStorage.
        this.pendingImages[key] = { base64, mimeType, extension }
        this.content.images[key] = `data:${mimeType};base64,${base64}`

        this.imageState[key] = {
          uploading: false,
          result: { ok: true, message: 'ℹ️ Preview lokal terpasang. Belum di-upload ke GitHub — klik Publish di bawah untuk menyimpannya permanen.' }
        }
      } catch (e) {
        this.imageState[key] = { uploading: false, result: { ok: false, message: '❌ ' + e.message } }
      } finally {
        event.target.value = ''
      }
    },

    addTestimoni() {
      const maxId = this.content.testimoni.items.reduce((m, it) => Math.max(m, it.id), 0)
      this.content.testimoni.items.push({ id: maxId + 1, name: 'Nama', major: 'Jurusan', text: 'Isi testimoni.' })
    }
  }
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #f1f4f2;
  font-family: 'Segoe UI', sans-serif;
  color: #1f2d27;
}

/* ---------- LOGIN ---------- */
.login-box {
  max-width: 380px;
  margin: 120px auto;
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  text-align: center;
}
.login-box form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}
.login-box input {
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #d6ddd9;
  font-size: 1rem;
}
.login-box button {
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: #1e6f5c;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.muted { color: #6b7a73; font-size: 0.9rem; }
.error-text { color: #d33; margin-top: 10px; font-size: 0.9rem; }
.success-text { color: #1e7d3c; margin-top: 10px; font-size: 0.9rem; }

/* ---------- SHELL ---------- */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 20px 30px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
}
.admin-header h1 { font-size: 1.3rem; margin: 0; }
.header-actions { display: flex; align-items: center; gap: 14px; }
.badge-draft {
  background: #fff4d6;
  color: #916800;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.admin-layout {
  display: grid;
  grid-template-columns: minmax(340px, 480px) 1fr;
  gap: 20px;
  padding: 20px;
  align-items: start;
}

@media (max-width: 1000px) {
  .admin-layout { grid-template-columns: 1fr; }
}

/* ---------- EDITOR ---------- */
.editor-column {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.panel {
  background: white;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  overflow: hidden;
}
.panel summary {
  padding: 16px 20px;
  font-weight: 700;
  cursor: pointer;
  list-style: none;
}
.panel summary::-webkit-details-marker { display: none; }
.panel-body {
  padding: 4px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
@media (max-width: 600px) {
  .grid-2 { grid-template-columns: 1fr; }
}

.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 0.8rem; font-weight: 600; color: #45564d; }
.field input, .field textarea {
  padding: 9px 12px;
  border-radius: 8px;
  border: 1px solid #d6ddd9;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
}
.field-row { display: flex; gap: 10px; flex-wrap: wrap; }

.color-row { display: flex; gap: 8px; align-items: center; }
.color-row input[type="color"] { width: 42px; height: 38px; padding: 2px; border-radius: 8px; }
.color-row input[type="text"] { flex: 1; }

.sub-label { font-weight: 700; font-size: 0.85rem; margin-top: 6px; }

.list-item {
  display: flex;
  gap: 8px;
  align-items: center;
}
.list-item input { flex: 1; padding: 8px 10px; border-radius: 8px; border: 1px solid #d6ddd9; }

.list-item-block {
  border: 1px solid #e5eae7;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #fbfdfc;
}

.btn-add {
  align-self: flex-start;
  background: #eaf5f0;
  color: #1e6f5c;
  border: 1px dashed #1e6f5c;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
}

.btn-danger-mini {
  align-self: flex-start;
  background: #fdeaea;
  color: #c0392b;
  border: none;
  padding: 6px 12px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
}

.hint { font-size: 0.75rem; color: #8a9690; margin: 0; }

.image-preview {
  max-width: 100%;
  max-height: 160px;
  object-fit: contain;
  border: 1px solid #e5eae7;
  border-radius: 10px;
  background: #f6f8f7;
  padding: 6px;
}

/* ---------- PUBLISH BAR ---------- */
.publish-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding: 16px 4px;
}
.btn-primary, .btn-secondary, .btn-danger {
  padding: 12px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.9rem;
}
.btn-primary { background: #1e6f5c; color: white; }
.btn-primary:disabled { opacity: 0.6; cursor: wait; }
.btn-secondary { background: #eef2f0; color: #1f2d27; }
.btn-danger { background: #fdeaea; color: #c0392b; }

/* ---------- PREVIEW ---------- */
.preview-column {
  position: sticky;
  top: 20px;
}
.preview-label {
  font-weight: 700;
  margin-bottom: 10px;
  color: #45564d;
}
.preview-frame {
  border: 1px solid #d6ddd9;
  border-radius: 16px;
  overflow: auto;
  max-height: 85vh;
  background: white;
}
</style>

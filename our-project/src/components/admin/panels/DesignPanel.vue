<template>
  <div>
    <h2 class="adm-page-title">Desain</h2>
    <p class="adm-page-subtitle">Warna, typography, dan layout website secara keseluruhan.</p>

    <div class="adm-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        class="adm-tab"
        :class="{ 'is-active': activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        <i :class="tab.icon"></i> {{ tab.label }}
      </button>
    </div>

    <!-- COLORS -->
    <section v-if="activeTab === 'colors'" class="adm-panel">
      <div class="adm-panel-header">
        <div class="adm-panel-title"><i class="fas fa-palette"></i> Warna</div>
      </div>
      <div class="adm-panel-body adm-grid-2">
        <AdminColorField
          v-for="f in colorFields"
          :key="f.key"
          :label="f.label"
          v-model="content.colors[f.key]"
        />
      </div>
    </section>

    <!-- TYPOGRAPHY -->
    <section v-if="activeTab === 'typography'" class="adm-panel">
      <div class="adm-panel-header">
        <div class="adm-panel-title"><i class="fas fa-font"></i> Typography</div>
      </div>
      <div class="adm-panel-body adm-grid-2">
        <AdminField label="Font Family (CSS)" v-model="content.typography.fontFamily" />
        <AdminField label="Line Height Dasar" v-model="content.typography.lineHeight" />
        <AdminField
          v-for="f in typographyFields"
          :key="f.key"
          :label="f.label"
          v-model="content.typography[f.key]"
        />
      </div>
    </section>

    <!-- LAYOUT -->
    <section v-if="activeTab === 'layout'" class="adm-panel">
      <div class="adm-panel-header">
        <div class="adm-panel-title"><i class="fas fa-ruler-combined"></i> Layout</div>
      </div>
      <div class="adm-panel-body adm-grid-2">
        <AdminField
          v-for="f in layoutFields"
          :key="f.key"
          :label="f.label"
          v-model="content.layout[f.key]"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { content } from '../../../composables/useSiteContent'
import AdminField from '../ui/AdminField.vue'
import AdminColorField from '../ui/AdminColorField.vue'

const tabs = [
  { key: 'colors', label: 'Warna', icon: 'fas fa-palette' },
  { key: 'typography', label: 'Typography', icon: 'fas fa-font' },
  { key: 'layout', label: 'Layout', icon: 'fas fa-ruler-combined' }
]
const activeTab = ref('colors')

const colorFields = [
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
]

const typographyFields = [
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
]

const layoutFields = [
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
</script>

<style scoped>
.adm-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--adm-border);
}

.adm-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--adm-text-muted);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-family: var(--adm-font);
}

.adm-tab:hover { color: var(--adm-text-main); }

.adm-tab.is-active {
  color: var(--adm-teal-accent);
  border-bottom-color: var(--adm-teal-accent);
}
</style>

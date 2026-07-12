<template>
  <div>
    <h2 class="adm-page-title">Navbar</h2>
    <p class="adm-page-subtitle">Logo, tombol CTA, dan menu navigasi di bagian atas website.</p>

    <section class="adm-panel">
      <div class="adm-panel-header">
        <div class="adm-panel-title"><i class="fas fa-compass"></i> Pengaturan Navbar</div>
      </div>
      <div class="adm-panel-body">
        <div class="adm-grid-2">
          <AdminField label="Teks Logo" v-model="content.navbar.logoText" />
          <AdminField label="Teks Tombol CTA" v-model="content.navbar.ctaText" />
        </div>

        <label class="adm-label" style="display:block; margin: 20px 0 10px;">Menu Navigasi</label>
        <div v-for="(item, i) in content.navbar.menu" :key="i" class="adm-list-item-inline">
          <input class="adm-input" v-model="item.label" placeholder="Label" />
          <input class="adm-input" v-model="item.href" placeholder="#link" />
          <button type="button" class="adm-btn-icon-danger" @click="content.navbar.menu.splice(i, 1)">
            <i class="fas fa-trash-can"></i>
          </button>
        </div>
        <button type="button" class="adm-btn adm-btn-add" @click="content.navbar.menu.push({ label: 'Menu Baru', href: '#' })">
          <i class="fas fa-plus"></i> Tambah Menu
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { content } from '../../../composables/useSiteContent'
import AdminField from '../ui/AdminField.vue'
</script>

<template>
  <div>
    <h2 class="adm-page-title">Hero Section</h2>
    <p class="adm-page-subtitle">Bagian paling atas halaman, yang pertama dilihat pengunjung.</p>

    <section class="adm-panel">
      <div class="adm-panel-header">
        <div class="adm-panel-title"><i class="fas fa-house"></i> Konten Hero</div>
      </div>
      <div class="adm-panel-body">
        <AdminField label="Judul (sebelum highlight)" v-model="content.hero.titleBefore" />
        <AdminField label="Judul (bagian highlight)" v-model="content.hero.titleHighlight" />
        <AdminField label="Sub-pesan (highlight, tebal)" type="textarea" :rows="2" v-model="content.hero.subtitleHighlight" />
        <AdminField label="Paragraf Subjudul" type="textarea" :rows="2" v-model="content.hero.subtitle" />
        <div class="adm-grid-2">
          <AdminField label="Teks Tombol Utama" v-model="content.hero.primaryBtnText" />
          <AdminField label="Teks Tombol Outline" v-model="content.hero.outlineBtnText" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { content } from '../../../composables/useSiteContent'
import AdminField from '../ui/AdminField.vue'
</script>

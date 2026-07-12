<template>
  <div>
    <h2 class="adm-page-title">Tentang Kami</h2>
    <p class="adm-page-subtitle">Badge, judul, dan kartu misi/visi pada section Tentang Kami.</p>

    <section class="adm-panel">
      <div class="adm-panel-header">
        <div class="adm-panel-title"><i class="fas fa-circle-info"></i> Konten Tentang Kami</div>
      </div>
      <div class="adm-panel-body">
        <AdminField label="Label Badge" v-model="content.about.badge" />
        <div class="adm-grid-2">
          <AdminField label="Judul (sebelum highlight)" v-model="content.about.titleBefore" />
          <AdminField label="Judul (bagian highlight)" v-model="content.about.titleHighlight" />
        </div>
        <AdminField label="Judul (baris kedua)" v-model="content.about.titleAfter" />
        <AdminField label="Paragraf Pembuka" type="textarea" :rows="3" v-model="content.about.subtitle" />

        <div class="adm-grid-2">
          <AdminField label="Judul Kartu Misi" v-model="content.about.missionTitle" />
          <AdminField label="Judul Kartu Visi" v-model="content.about.visionTitle" />
        </div>
        <div class="adm-grid-2">
          <AdminField label="Isi Kartu Misi" type="textarea" :rows="3" v-model="content.about.missionText" />
          <AdminField label="Isi Kartu Visi" type="textarea" :rows="3" v-model="content.about.visionText" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { content } from '../../../composables/useSiteContent'
import AdminField from '../ui/AdminField.vue'
</script>

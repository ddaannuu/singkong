<template>
  <div>
    <h2 class="adm-page-title">Ajakan (Call To Action)</h2>
    <p class="adm-page-subtitle">Section ajakan sebelum footer.</p>

    <section class="adm-panel">
      <div class="adm-panel-header">
        <div class="adm-panel-title"><i class="fas fa-bullhorn"></i> Konten CTA</div>
      </div>
      <div class="adm-panel-body">
        <AdminField label="Judul" type="textarea" :rows="2" v-model="content.action.title" />
        <div class="adm-grid-2">
          <AdminField label="Deskripsi (baris 1)" v-model="content.action.descriptionLine1" />
          <AdminField label="Deskripsi (baris 2)" v-model="content.action.descriptionLine2" />
        </div>
        <AdminField label="Teks Tombol" v-model="content.action.buttonText" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { content } from '../../../composables/useSiteContent'
import AdminField from '../ui/AdminField.vue'
</script>

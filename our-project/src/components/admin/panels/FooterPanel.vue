<template>
  <div>
    <h2 class="adm-page-title">Footer</h2>
    <p class="adm-page-subtitle">Teks yang tampil di bagian paling bawah website.</p>

    <section class="adm-panel">
      <div class="adm-panel-header">
        <div class="adm-panel-title"><i class="fas fa-align-left"></i> Konten Footer</div>
      </div>
      <div class="adm-panel-body">
        <AdminField label="Baris 1" v-model="content.footer.line1" />
        <AdminField label="Baris 2" v-model="content.footer.line2" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { content } from '../../../composables/useSiteContent'
import AdminField from '../ui/AdminField.vue'
</script>

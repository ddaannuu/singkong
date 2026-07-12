<template>
  <div>
    <h2 class="adm-page-title">Testimoni</h2>
    <p class="adm-page-subtitle">Ulasan dan tanggapan dari pengguna.</p>

    <section class="adm-panel">
      <div class="adm-panel-header">
        <div class="adm-panel-title"><i class="fas fa-comments"></i> Judul &amp; CTA</div>
      </div>
      <div class="adm-panel-body adm-grid-2">
        <AdminField label="Judul Section" v-model="content.testimoni.sectionTitle" />
        <AdminField label="Teks Tombol CTA Bawah" v-model="content.testimoni.ctaButtonText" />
      </div>
    </section>

    <section class="adm-panel">
      <div class="adm-panel-header">
        <div class="adm-panel-title"><i class="fas fa-quote-left"></i> Daftar Testimoni</div>
      </div>
      <div class="adm-panel-body">
        <AdminItemCard
          v-for="(item, i) in content.testimoni.items"
          :key="item.id"
          :index-label="item.name || `Testimoni ${i + 1}`"
          @remove="content.testimoni.items.splice(i, 1)"
        >
          <div class="adm-grid-2">
            <AdminField label="Nama" v-model="item.name" />
            <AdminField label="Jurusan/Angkatan" v-model="item.major" />
          </div>
          <AdminField label="Isi Testimoni" type="textarea" :rows="2" v-model="item.text" />
        </AdminItemCard>

        <button type="button" class="adm-btn adm-btn-add" @click="addTestimoni">
          <i class="fas fa-plus"></i> Tambah Testimoni
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { content } from '../../../composables/useSiteContent'
import AdminField from '../ui/AdminField.vue'
import AdminItemCard from '../ui/AdminItemCard.vue'

function addTestimoni() {
  const maxId = content.testimoni.items.reduce((m, it) => Math.max(m, it.id), 0)
  content.testimoni.items.push({ id: maxId + 1, name: 'Nama', major: 'Jurusan', text: 'Isi testimoni.' })
}
</script>

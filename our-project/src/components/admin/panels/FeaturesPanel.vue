<template>
  <div>
    <h2 class="adm-page-title">Fitur</h2>
    <p class="adm-page-subtitle">Daftar fitur/keunggulan yang ditawarkan.</p>

    <section class="adm-panel">
      <div class="adm-panel-header">
        <div class="adm-panel-title"><i class="fas fa-star"></i> Judul &amp; Intro</div>
      </div>
      <div class="adm-panel-body">
        <AdminField label="Judul Section" v-model="content.features.sectionTitle" />
        <AdminField label="Intro (Tebal)" type="textarea" :rows="2" v-model="content.features.introBold" />
        <AdminField label="Intro (Teks)" type="textarea" :rows="3" v-model="content.features.introText" />
      </div>
    </section>

    <section class="adm-panel">
      <div class="adm-panel-header">
        <div class="adm-panel-title"><i class="fas fa-list-ul"></i> Daftar Fitur</div>
      </div>
      <div class="adm-panel-body">
        <AdminItemCard
          v-for="(item, i) in content.features.items"
          :key="i"
          :index-label="`Fitur ${i + 1}`"
          @remove="content.features.items.splice(i, 1)"
        >
          <AdminField label="Icon (kelas Font Awesome)" placeholder="fas fa-box-open" v-model="item.icon" />
          <AdminField label="Judul" v-model="item.title" />
          <AdminField label="Deskripsi" type="textarea" :rows="2" v-model="item.text" />
        </AdminItemCard>

        <button
          type="button"
          class="adm-btn adm-btn-add"
          @click="content.features.items.push({ icon: 'fas fa-star', title: 'Fitur Baru', text: 'Deskripsi fitur.' })"
        >
          <i class="fas fa-plus"></i> Tambah Fitur
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { content } from '../../../composables/useSiteContent'
import AdminField from '../ui/AdminField.vue'
import AdminItemCard from '../ui/AdminItemCard.vue'
</script>

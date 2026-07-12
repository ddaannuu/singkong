<template>
  <div>
    <h2 class="adm-page-title">Cara Kerja</h2>
    <p class="adm-page-subtitle">Langkah-langkah proses yang ditampilkan ke pengunjung.</p>

    <section class="adm-panel">
      <div class="adm-panel-header">
        <div class="adm-panel-title"><i class="fas fa-diagram-project"></i> Judul Section</div>
      </div>
      <div class="adm-panel-body">
        <AdminField label="Judul Section" v-model="content.howItWorks.sectionTitle" />
      </div>
    </section>

    <section class="adm-panel">
      <div class="adm-panel-header">
        <div class="adm-panel-title"><i class="fas fa-shoe-prints"></i> Langkah-langkah</div>
      </div>
      <div class="adm-panel-body">
        <AdminItemCard
          v-for="(step, i) in content.howItWorks.steps"
          :key="i"
          :index-label="`Langkah ${i + 1}`"
          @remove="content.howItWorks.steps.splice(i, 1)"
        >
          <AdminField label="Judul" v-model="step.title" />
          <AdminField label="Deskripsi" type="textarea" :rows="2" v-model="step.text" />
        </AdminItemCard>

        <button
          type="button"
          class="adm-btn adm-btn-add"
          @click="content.howItWorks.steps.push({ title: 'Langkah Baru', text: 'Deskripsi langkah.' })"
        >
          <i class="fas fa-plus"></i> Tambah Langkah
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

<template>
  <div>
    <h2 class="adm-page-title">Statistik</h2>
    <p class="adm-page-subtitle">Angka-angka pencapaian yang ditampilkan di website.</p>

    <section class="adm-panel">
      <div class="adm-panel-header">
        <div class="adm-panel-title"><i class="fas fa-chart-column"></i> Daftar Statistik</div>
      </div>
      <div class="adm-panel-body">
        <AdminItemCard
          v-for="(stat, i) in content.stats.items"
          :key="i"
          :index-label="`Statistik ${i + 1}`"
          @remove="content.stats.items.splice(i, 1)"
        >
          <div class="adm-grid-2">
            <AdminField label="Angka" placeholder="5.000+" v-model="stat.number" />
            <AdminField label="Label" placeholder="Mahasiswa Terdaftar" v-model="stat.label" />
          </div>
        </AdminItemCard>

        <button type="button" class="adm-btn adm-btn-add" @click="content.stats.items.push({ number: '0', label: 'Label Baru' })">
          <i class="fas fa-plus"></i> Tambah Statistik
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

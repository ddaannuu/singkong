<template>
  <header class="adm-topbar">
    <div>
      <h1 class="adm-topbar-title">{{ title }}</h1>
      <p class="adm-topbar-subtitle">{{ subtitle }}</p>
    </div>

    <div class="adm-topbar-actions">
      <span v-if="draftExists" class="adm-badge-draft">
        <i class="fas fa-circle" style="font-size:7px;"></i> Ada perubahan belum di-publish
      </span>

      <button type="button" class="adm-btn adm-btn-secondary" @click="$emit('toggle-preview')">
        <i class="fas" :class="previewOpen ? 'fa-eye-slash' : 'fa-eye'"></i>
        {{ previewOpen ? 'Sembunyikan Preview' : 'Live Preview' }}
      </button>

      <button type="button" class="adm-btn adm-btn-danger" @click="$emit('reset')">
        <i class="fas fa-rotate-left"></i> Reset
      </button>

      <button type="button" class="adm-btn adm-btn-secondary" @click="$emit('download')">
        <i class="fas fa-download"></i> JSON
      </button>

      <button type="button" class="adm-btn adm-btn-primary" :disabled="publishing" @click="$emit('publish')">
        <i class="fas" :class="publishing ? 'fa-spinner fa-spin' : 'fa-rocket'"></i>
        {{ publishing ? 'Mempublikasikan...' : 'Publish' }}
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  draftExists: { type: Boolean, default: false },
  publishing: { type: Boolean, default: false },
  previewOpen: { type: Boolean, default: false }
})
defineEmits(['publish', 'reset', 'download', 'toggle-preview'])
</script>

<style scoped>
.adm-topbar {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 32px;
  background: rgba(242, 245, 244, 0.9);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid var(--adm-border);
}

.adm-topbar-title {
  font-size: 20px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.01em;
}

.adm-topbar-subtitle {
  font-size: 13px;
  color: var(--adm-text-muted);
  margin: 3px 0 0;
}

.adm-topbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
</style>

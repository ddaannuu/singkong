<template>
  <header class="adm-topbar">
    <div class="adm-topbar-heading">
      <button type="button" class="adm-topbar-menu-btn" @click="$emit('toggle-sidebar')">
        <i class="fas fa-bars"></i>
      </button>
      <div>
        <h1 class="adm-topbar-title">{{ title }}</h1>
        <p class="adm-topbar-subtitle">{{ subtitle }}</p>
      </div>
    </div>

    <div class="adm-topbar-actions">
      <span v-if="draftExists" class="adm-badge-draft">
        <i class="fas fa-circle" style="font-size:7px;"></i>
        <span class="adm-hide-xs">Ada perubahan belum di-publish</span>
        <span class="adm-show-xs">Draft</span>
      </span>

      <button type="button" class="adm-btn adm-btn-secondary" @click="$emit('toggle-preview')">
        <i class="fas" :class="previewOpen ? 'fa-eye-slash' : 'fa-eye'"></i>
        <span class="adm-hide-xs">{{ previewOpen ? 'Sembunyikan Preview' : 'Live Preview' }}</span>
      </button>

      <button type="button" class="adm-btn adm-btn-danger" @click="$emit('reset')">
        <i class="fas fa-rotate-left"></i> <span class="adm-hide-xs">Reset</span>
      </button>

      <button type="button" class="adm-btn adm-btn-secondary" @click="$emit('download')">
        <i class="fas fa-download"></i> <span class="adm-hide-xs">JSON</span>
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
defineEmits(['publish', 'reset', 'download', 'toggle-preview', 'toggle-sidebar'])
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

.adm-topbar-heading {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
}

.adm-topbar-menu-btn {
  display: none;
  width: 34px;
  height: 34px;
  min-width: 34px;
  align-items: center;
  justify-content: center;
  border-radius: var(--adm-radius-sm);
  border: 1px solid var(--adm-border);
  background: #fff;
  color: var(--adm-text-main);
  cursor: pointer;
  font-size: 14px;
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

.adm-show-xs { display: none; }

/* ---------- Tablet / mobile ---------- */
@media (max-width: 900px) {
  .adm-topbar-menu-btn { display: flex; }
}

@media (max-width: 720px) {
  .adm-topbar {
    padding: 14px 16px;
    flex-wrap: wrap;
  }

  .adm-topbar-title { font-size: 17px; }
  .adm-topbar-subtitle { display: none; }

  .adm-topbar-actions {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 2px;
    -webkit-overflow-scrolling: touch;
  }

  .adm-topbar-actions .adm-btn { padding: 8px 12px; }
  .adm-hide-xs { display: none; }
  .adm-show-xs { display: inline; }
}
</style>
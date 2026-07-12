<template>
  <!-- Backdrop only shows on mobile when drawer is open -->
  <div v-if="open" class="adm-sidebar-backdrop" @click="$emit('close')"></div>

  <aside class="adm-sidebar" :class="{ 'is-open': open }">
    <div class="adm-sidebar-brand">
      <div class="adm-sidebar-logo"><i class="fas fa-recycle"></i></div>
      <div>
        <div class="adm-sidebar-brand-name">Second Chance</div>
        <div class="adm-sidebar-brand-sub">Admin Panel</div>
      </div>
      <button type="button" class="adm-sidebar-close" @click="$emit('close')">
        <i class="fas fa-xmark"></i>
      </button>
    </div>

    <nav class="adm-sidebar-nav">
      <div class="adm-sidebar-group-label">Konten</div>
      <button
        v-for="item in sections"
        :key="item.key"
        type="button"
        class="adm-sidebar-link"
        :class="{ 'is-active': modelValue === item.key }"
        @click="handleSelect(item.key)"
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </button>
    </nav>

    <div class="adm-sidebar-footer">
      <button type="button" class="adm-sidebar-link adm-sidebar-logout" @click="$emit('logout')">
        <i class="fas fa-arrow-right-from-bracket"></i>
        <span>Keluar</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: 'design' },
  sections: { type: Array, required: true },
  open: { type: Boolean, default: false } // controls the mobile drawer only
})
const emit = defineEmits(['update:modelValue', 'logout', 'close'])

function handleSelect(key) {
  emit('update:modelValue', key)
  emit('close') // no-op on desktop, closes the drawer on mobile
}
</script>

<style scoped>
.adm-sidebar {
  width: var(--adm-sidebar-width);
  min-width: var(--adm-sidebar-width);
  background: var(--adm-sidebar-bg);
  color: var(--adm-sidebar-text);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.adm-sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 22px 20px;
  border-bottom: 1px solid var(--adm-sidebar-border);
}

.adm-sidebar-close {
  display: none;
  margin-left: auto;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.06);
  border: none;
  border-radius: var(--adm-radius-sm);
  color: var(--adm-sidebar-text);
  cursor: pointer;
  font-size: 14px;
}

.adm-sidebar-backdrop {
  display: none;
}

.adm-sidebar-logo {
  width: 36px;
  height: 36px;
  border-radius: var(--adm-radius-sm);
  background: var(--adm-accent);
  color: #2a1e05;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}

.adm-sidebar-brand-name {
  color: #fff;
  font-weight: 700;
  font-size: 14.5px;
  line-height: 1.2;
}

.adm-sidebar-brand-sub {
  font-size: 12px;
  color: var(--adm-sidebar-text);
  margin-top: 1px;
}

.adm-sidebar-nav {
  flex: 1;
  padding: 16px 12px;
}

.adm-sidebar-group-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--adm-sidebar-text);
  opacity: 0.6;
  padding: 8px 12px 10px;
}

.adm-sidebar-link {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--adm-radius-sm);
  background: transparent;
  border: none;
  color: var(--adm-sidebar-text);
  font-size: 13.5px;
  font-weight: 500;
  font-family: var(--adm-font);
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  margin-bottom: 2px;
}

.adm-sidebar-link i { width: 16px; text-align: center; font-size: 13px; }

.adm-sidebar-link:hover {
  background: rgba(255,255,255,0.06);
  color: #fff;
}

.adm-sidebar-link.is-active {
  background: var(--adm-sidebar-bg-active);
  color: var(--adm-sidebar-text-active);
  box-shadow: inset 3px 0 0 var(--adm-accent);
}

.adm-sidebar-footer {
  padding: 12px;
  border-top: 1px solid var(--adm-sidebar-border);
}

.adm-sidebar-logout:hover {
  background: rgba(193, 67, 47, 0.18);
  color: #f3a08f;
}

/* ---------- Mobile: off-canvas drawer ---------- */
@media (max-width: 900px) {
  .adm-sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(8, 22, 21, 0.55);
    z-index: 40;
  }

  .adm-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.22s ease;
    box-shadow: var(--adm-shadow-lg);
  }

  .adm-sidebar.is-open {
    transform: translateX(0);
  }

  .adm-sidebar-close {
    display: flex;
  }
}
</style>
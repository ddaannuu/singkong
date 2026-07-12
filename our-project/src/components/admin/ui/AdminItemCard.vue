<template>
  <div class="adm-item-card">
    <div class="adm-item-card-head">
      <span class="adm-item-index">{{ indexLabel }}</span>
      <button type="button" class="adm-btn-icon-danger" :title="removeLabel" @click="$emit('remove')">
        <i class="fas fa-trash-can"></i>
      </button>
    </div>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  indexLabel: { type: String, default: '' },
  removeLabel: { type: String, default: 'Hapus' }
})
defineEmits(['remove'])
</script>

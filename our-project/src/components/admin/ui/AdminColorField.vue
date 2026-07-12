<template>
  <div class="adm-field">
    <label class="adm-label">{{ label }}</label>
    <div class="adm-color-row">
      <input
        v-if="isHex(modelValue)"
        type="color"
        class="adm-color-swatch"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <input
        type="text"
        class="adm-input"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' }
})
defineEmits(['update:modelValue'])

function isHex(value) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value || '')
}
</script>

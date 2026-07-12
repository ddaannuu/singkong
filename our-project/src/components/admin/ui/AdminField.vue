<template>
  <div class="adm-field">
    <label v-if="label" class="adm-label">{{ label }}</label>
    <textarea
      v-if="type === 'textarea'"
      class="adm-textarea"
      :rows="rows"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
    <input
      v-else
      class="adm-input"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' }, // 'text' | 'textarea'
  rows: { type: [Number, String], default: 2 },
  placeholder: { type: String, default: '' }
})
defineEmits(['update:modelValue'])
</script>

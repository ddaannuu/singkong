<template>
  <section class="action-section">
    <div class="action-inner">
      <!-- <div class="action-icon">
        <i class="fas fa-bullhorn"></i>
      </div> -->

      <h3 class="action-title">{{ content.action.title }}</h3>

      <p class="action-desc">
        {{ content.action.descriptionLine1 }}<br />
        {{ content.action.descriptionLine2 }}
      </p>

      <button @click="handleAction" class="btn-action-large">
        {{ content.action.buttonText }}
      </button>
    </div>
  </section>
</template>

<script>
import { content } from '../../composables/useSiteContent'

export default {
  name: 'CallToAction',

  data() {
    return { content }
  },

  methods: {
    handleAction() {
      // Emit event ke parent component
      this.$emit('action-click')

      // Bisa juga langsung panggil method atau router
      // this.$router.push('/marketplace');
    },
  },
}
</script>

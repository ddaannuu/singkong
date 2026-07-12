<template>
  <section class="stats-section">
    <div class="stats-grid">
      <div v-for="(stat, i) in content.stats.items" :key="i" class="stat-item">
        <span class="stat-number">{{ stat.number }}</span>
        <span class="stat-label">{{ stat.label }}</span>
      </div>
    </div>
  </section>
</template>

<script>
import { content } from '../../composables/useSiteContent'

export default {
  name: 'Stat',

  data() {
    return { content }
  },
}
</script>

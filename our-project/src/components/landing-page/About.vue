<template>
  <div class="about-page">
    <!-- Hero -->
    <section class="about-hero">
      <span class="typing-badge">{{ content.about.badge }}</span>
      <h1>
        {{ content.about.titleBefore }} <span class="highlight">{{ content.about.titleHighlight }}</span><br />
        {{ content.about.titleAfter }}
      </h1>
      <p>{{ content.about.subtitle }}</p>
    </section>

    <!-- Misi & Visi -->
    <section class="mission-section">
      <div class="mission-grid">
        <div class="mission-card">
          <div class="mission-icon">
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-7.2-4.6-9.6-9.1C.8 8.6 2.2 5 5.6 5c1.9 0 3.4 1 4.4 2.5C11 6 12.5 5 14.4 5c3.4 0 4.8 3.6 3.2 6.9C19.2 16.4 12 21 12 21Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
          </div>
          <h3>{{ content.about.missionTitle }}</h3>
          <p>{{ content.about.missionText }}</p>
        </div>

        <div class="mission-card">
          <div class="mission-icon">
            <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
          </div>
          <h3>{{ content.about.visionTitle }}</h3>
          <p>{{ content.about.visionText }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { content } from '../../composables/useSiteContent'

export default {
  name: 'About',

  data() {
    return { content }
  }
}
</script>
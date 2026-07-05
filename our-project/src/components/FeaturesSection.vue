<template>
  <div class="features" id="fitur">
    <div class="section-title">
      {{ content.features.sectionTitle }}
    </div>
      <div style="text-align: center; max-width: 800px; margin: -20px auto 40px auto; background: #eef5f2; padding: 18px 24px; border-radius: 48px;">
        <strong style="color: var(--text-mains);">{{ content.features.introBold }}</strong>
        {{ content.features.introText }}
      </div>
    <div class="feature-grid">

      <div
        v-for="(item, index) in content.features.items"
        :key="index"
        class="feature-card"
      >
        <div class="feature-icon">
          <i :class="item.icon"></i>
        </div>

        <h3>{{ item.title }}</h3>

        <p>{{ item.text }}</p>
      </div>

    </div>
  </div>
</template>

<script>
import { content } from '../composables/useSiteContent'

export default {
  name: 'FeaturesSection',

  data() {
    return { content }
  },

  mounted() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('.feature-card').forEach(el => {
      el.style.opacity = "0"
      el.style.transform = "translateY(20px)"
      el.style.transition = "0.5s ease-out"
      observer.observe(el)
    })
  }
}
</script>

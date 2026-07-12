<template>
  <div class="how-it-works" id="cara-kerja">
    <div class="section-title">
      {{ content.howItWorks.sectionTitle }}
    </div>

    <div class="steps">

      <div
        v-for="(step, index) in content.howItWorks.steps"
        :key="index"
        class="step"
      >
        <div class="step-number">{{ index + 1 }}</div>

        <h3>{{ step.title }}</h3>

        <p>{{ step.text }}</p>
      </div>

    </div>
  </div>
</template>

<script>
import { content } from '../../composables/useSiteContent'

export default {
  name: 'HowItWorks',

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

    document.querySelectorAll('.step').forEach(el => {
      el.style.opacity = "0"
      el.style.transform = "translateY(20px)"
      el.style.transition = "0.5s ease-out"
      observer.observe(el)
    })
  }
}
</script>

<template>
  <div class="aida-action-section">
    <i class="fas fa-bullhorn" style="font-size: 2.5rem; margin-bottom: 10px;"></i>
    <h3>{{ content.action.title }}</h3>
    <p>
      {{ content.action.descriptionLine1 }}<br>
      <i class="fas fa-mouse-pointer"></i> {{ content.action.descriptionLine2 }}
    </p>
    <button @click="handleAction" class="btn-action-large">
      <i class="fas fa-hand-peace"></i> {{ content.action.buttonText }}
    </button>
  </div>
</template>

<script>
import { content } from '../composables/useSiteContent'

export default {
  name: 'CallToAction',

  data() {
    return { content }
  },

  methods: {
    handleAction() {
      // Emit event ke parent component
      this.$emit('action-click');

      // Bisa juga langsung panggil method atau router
      // this.$router.push('/marketplace');
    }
  }
}
</script>

<style scoped>
.aida-action-section {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  border-radius: var(--radius-card);
  margin: 0 8% 50px 8%;
  padding: 40px 30px;
  text-align: center;
  color: white;
  box-shadow: 0 20px 35px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.aida-action-section:hover {
  transform: translateY(-5px);
}

.aida-action-section h3 {
  font-size: var(--subtitle-size);
  margin-bottom: 15px;
}

.aida-action-section p {
  font-size: var(--paragraph-size);
  margin-bottom: 25px;
  opacity: 0.95;
}

.btn-action-large {
  background: var(--cta-accent);
  color: var(--primary-color);
  border: none;
  padding: 14px 42px;
  border-radius: 60px;
  font-weight: bold;
  font-size: var(--button-text-size);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 14px rgba(0,0,0,0.2);
}

.btn-action-large:hover {
  background: var(--cta-accent-hover);
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0,0,0,0.25);
}

@media (max-width: 768px) {
  .aida-action-section {
    margin: 0 5% 40px 5%;
    padding: 30px 20px;
  }

  .aida-action-section h3 {
    font-size: 1.4rem;
  }

  .btn-action-large {
    padding: 12px 28px;
    font-size: 1rem;
    width: 100%;
  }
}
</style>

<template>
  <section class="action-section">
    <div class="action-inner">
      <div class="action-icon">
        <i class="fas fa-bullhorn"></i>
      </div>

      <h3 class="action-title">{{ content.action.title }}</h3>

      <p class="action-desc">
        {{ content.action.descriptionLine1 }}<br>
        <i class="fas fa-mouse-pointer"></i> {{ content.action.descriptionLine2 }}
      </p>

      <button @click="handleAction" class="btn-action-large">
        <i class="fas fa-hand-peace"></i> {{ content.action.buttonText }}
      </button>
    </div>
  </section>
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
.action-section {
  padding: 0 var(--section-padding-x) 50px;
}

.action-inner {
  max-width: var(--container-max-width);
  margin: 0 auto;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  border-radius: var(--radius-card);
  padding: 50px 30px;
  text-align: center;
  color: var(--button-text-color);
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.action-inner:hover {
  transform: translateY(-5px);
  box-shadow: 0 26px 45px rgba(0, 0, 0, 0.14);
}

.action-icon {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 22px;
  font-size: 1.8rem;
  transition: transform 0.3s ease;
}

.action-inner:hover .action-icon {
  transform: scale(1.08);
}

.action-title {
  font-size: var(--subtitle-size);
  font-weight: var(--subtitle-weight);
  line-height: 1.35;
  margin-bottom: 16px;
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
}

.action-desc {
  font-size: var(--paragraph-size);
  font-weight: var(--paragraph-weight);
  line-height: var(--line-height-base);
  margin-bottom: 30px;
  opacity: 0.95;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
}

.action-desc i {
  margin-right: 4px;
}

.btn-action-large {
  background: var(--cta-accent);
  color: var(--primary-color);
  border: none;
  padding: 14px 42px;
  border-radius: var(--radius-button);
  font-weight: var(--button-text-weight);
  font-size: var(--button-text-size);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
}

.btn-action-large:hover {
  background: var(--cta-accent-hover);
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
}

@media (max-width: 768px) {
  .action-section {
    padding: 0 5% 40px;
  }

  .action-inner {
    padding: 36px 22px;
  }

  .action-icon {
    width: 56px;
    height: 56px;
    font-size: 1.5rem;
  }

  .action-title {
    font-size: 1.4rem;
  }

  .btn-action-large {
    padding: 12px 28px;
    font-size: 1rem;
    width: 100%;
  }
}
</style>
<template>
  <section class="testimoni">
    <div class="section-title">
      {{ content.testimoni.sectionTitle }}
    </div>

    <div class="testimonial-wrapper">
      <button class="nav-btn left" @click="prevTestimonial">
        <i class="fas fa-chevron-left"></i>
      </button>

      <div class="testimonial-container">
        <div
          v-for="(item, index) in visibleTestimonials"
          :key="item.id"
          class="testi-card"
          :class="{
            active: index === 1,
            side: index !== 1
          }"
        >
          <div class="stars">
            <i
              v-for="star in 5"
              :key="star"
              class="fas fa-star"
            ></i>
          </div>

          <p class="testimonial-text">
            "{{ item.text }}"
          </p>

          <h4>
            — {{ item.name }}, {{ item.major }}
          </h4>
        </div>
      </div>

      <button class="nav-btn right" @click="nextTestimonial">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <div class="indicator">
      <span
        v-for="(item, index) in content.testimoni.items"
        :key="item.id"
        :class="{ active: currentIndex === index }"
      ></span>
    </div>

    <div class="cta-wrapper">
      <button class="btn-primary-landing" @click="goToMarket">
        <img
          :src="content.images.logo"
          alt="Logo"
          class="btn-logo"
        />
        <span>{{ content.testimoni.ctaButtonText }}</span>
      </button>
    </div>
  </section>
</template>

<script>
import { content } from '../../composables/useSiteContent'

export default {
  name: "Testimoni",

  data() {
    return {
      content,
      currentIndex: 0
    };
  },

  computed: {
    testimonials() {
      return this.content.testimoni.items
    },

    visibleTestimonials() {
      const total = this.testimonials.length;

      const prevIndex =
        (this.currentIndex - 1 + total) % total;

      const nextIndex =
        (this.currentIndex + 1) % total;

      return [
        this.testimonials[prevIndex],
        this.testimonials[this.currentIndex],
        this.testimonials[nextIndex]
      ];
    }
  },

  methods: {
    nextTestimonial() {
      this.currentIndex =
        (this.currentIndex + 1) %
        this.testimonials.length;
    },

    prevTestimonial() {
      this.currentIndex =
        (this.currentIndex - 1 + this.testimonials.length) %
        this.testimonials.length;
    },

    goToMarket() {
      alert(
        "✨ Menuju ke Marketplace Second Chance Market ✨\n(Dalam implementasi nyata, ini akan membuka halaman marketplace.)"
      );

      window.open("#", "_self");
    }
  },

  mounted() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      {
        threshold: 0.2
      }
    );

    const section = document.querySelector(".testimonial-wrapper");

    if (section) {
      observer.observe(section);
    }
  }
};
</script>

<template>
  <div class="hero">
    <div class="hero-left animate-left">
      <h1>
        {{ content.hero.titleBefore }}
        <span class="highlight">{{ content.hero.titleHighlight }}</span>
      </h1>
      <!-- INTEREST (I) dimasukkan di sini sebagai sub-pesan yang kuat -->
      <p>
        <span class="highlight-interest">{{ content.hero.subtitleHighlight }}</span>
        {{ content.hero.subtitle }}
      </p>

      <div class="cta-group">
        <button class="btn-primary-landing" @click="$router.push('/dashboard')">
          {{ content.hero.primaryBtnText }}
        </button>

        <button class="btn-outline-landing" @click="showDemo">
          {{ content.hero.outlineBtnText }}
        </button>
      </div>
    </div>

    <div class="hero-right animate-up">
      <div style="border-radius: 48px; padding: 12px">
        <img
          :src="content.images.hero"
          alt="Marketplace Preview"
          style="border-radius: 40px; width: 100%; height: auto"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { content } from '../../composables/useSiteContent'

export default {
  name: 'HeroSection',

  data() {
    return { content }
  },

  methods: {
    goToMarket() {
      alert(
        '✨ Menuju ke Marketplace Second Chance Market ✨\n(Dalam implementasi nyata, ini akan membuka halaman utama marketplace dengan semua fitur: Posting, Chat, Wishlist, Bundling, Titip Jual)',
      )

      window.open('#', '_self')
    },

    showDemo() {
      alert(
        '🎥 Demo Fitur:\n- Post barang dengan foto emoji\n- Chat realtime antar user\n- Wishlist & Titip jual\n- Bundling barang kos.\nSilakan buka marketplace untuk mencoba langsung.',
      )
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Poppins:wght@400;500;600;700&display=swap');

.hero-left h1 {
  font-family: var(--font-family);
}

.hero-left p {
  font-family: var(--font-family);
}

.btn-primary-landing,
.btn-outline-landing {
  font-family: var(--font-family);
}
</style>

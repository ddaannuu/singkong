<template>
  <div class="navbar">
    <div class="logo">
      {{ content.navbar.logoText }}
    </div>

    <div class="nav-links">
      <a
        v-for="(item, index) in content.navbar.menu"
        :key="index"
        :href="item.href"
      >
        {{ item.label }}
      </a>

      <a href="#" @click="$router.push('/dashboard')" class="btn-masuk">
        {{ content.navbar.ctaText }}
      </a>
    </div>
  </div>
</template>

<script>
import { content } from '../../composables/useSiteContent'

export default {
  name: 'Navbar',

  data() {
    return { content }
  },

  methods: {
    goToMarket() {
      alert(
        "Menuju ke Marketplace Second Chance Market \n(Dalam implementasi nyata, ini akan membuka halaman utama marketplace dengan semua fitur: Posting, Chat, Wishlist, Bundling, Titip Jual)"
      )

      window.open("#", "_self")
    }
  }
}
</script>

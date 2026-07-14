<template>
  <div class="market-page">

    <!-- ================= PROMO BANNER ================= -->
    <section class="promo-banner">
      <div class="banner-track" :style="{ transform: `translateX(-${bannerIndex * 100}%)` }">
        <div class="banner-slide" v-for="(slide, i) in banners" :key="i" :style="{ background: slide.bg }">
          <div class="banner-text">
            <span class="banner-tag">{{ slide.tag }}</span>
            <h2>{{ slide.title }}</h2>
            <p>{{ slide.desc }}</p>
          </div>
        </div>
      </div>
      <div class="banner-dots">
        <span
          v-for="(slide, i) in banners"
          :key="i"
          class="banner-dot"
          :class="{ active: bannerIndex === i }"
          @click="bannerIndex = i"
        ></span>
      </div>
    </section>

    <!-- ================= SEARCH ================= -->
    <section class="market-search">
      <div class="search-bar">
        <svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <input v-model="searchQuery" type="text" placeholder="Cari buku, elektronik, perlengkapan kos..." />
      </div>

      <!-- Kategori dengan ikon -->
      <div class="category-icons">
        <button
          v-for="cat in categories"
          :key="cat.name"
          class="category-item"
          :class="{ active: activeCategory === cat.name }"
          @click="activeCategory = cat.name"
        >
          <span class="category-icon" v-html="cat.icon"></span>
          <span>{{ cat.name }}</span>
        </button>
      </div>
    </section>

    <!-- ================= TABS ================= -->
    <section class="market-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-btn"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        <svg v-if="tab.key === 'all'" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/></svg>
        <svg v-else-if="tab.key === 'preorder'" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 9.5h18" stroke="currentColor" stroke-width="2"/><path d="M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <svg v-else viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M4 7.5L12 12l8-4.5M12 12v9" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
        {{ tab.label }}
      </button>
    </section>

    <!-- ================= SORT & RESULT COUNT ================= -->
    <section class="market-toolbar">
      <p class="result-count">{{ filteredProducts.length }} produk ditemukan</p>
      <div class="sort-select">
        <label>Urutkan:</label>
        <select v-model="sortBy">
          <option value="terbaru">Terbaru</option>
          <option value="termurah">Harga Terendah</option>
          <option value="termahal">Harga Tertinggi</option>
          <option value="terlaris">Terlaris</option>
        </select>
      </div>
    </section>

    <!-- ================= GRID PRODUK ================= -->
    <section class="market-grid" v-if="visibleProducts.length">
      <article class="product-card" v-for="product in visibleProducts" :key="product.id">

        <!-- Carousel Gambar -->
        <div
          class="product-image-wrap"
          @touchstart="onTouchStart($event, product.id)"
          @touchend="onTouchEnd($event, product.id)"
        >
          <div
            class="image-track"
            :style="{ transform: `translateX(-${(currentIndex[product.id] || 0) * 100}%)` }"
          >
            <img
              v-for="(img, i) in product.images"
              :key="i"
              :src="img"
              :alt="product.title + ' foto ' + (i + 1)"
              draggable="false"
            />
          </div>

          <button
            class="fav-btn"
            :class="{ active: isFavorite(product.id) }"
            @click="toggleFavorite(product.id)"
            :aria-label="isFavorite(product.id) ? 'Hapus dari favorit' : 'Simpan ke favorit'"
          >
            <svg viewBox="0 0 24 24" :fill="isFavorite(product.id) ? 'currentColor' : 'none'">
              <path d="M12 21s-7.2-4.6-9.6-9.1C.8 8.6 2.2 5 5.6 5c1.9 0 3.4 1 4.4 2.5C11 6 12.5 5 14.4 5c3.4 0 4.8 3.6 3.2 6.9C19.2 16.4 12 21 12 21Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          </button>

          <template v-if="product.images.length > 1">
            <button class="img-arrow left" @click.stop="prevImage(product.id, product.images.length)" aria-label="Foto sebelumnya">‹</button>
            <button class="img-arrow right" @click.stop="nextImage(product.id, product.images.length)" aria-label="Foto berikutnya">›</button>
            <div class="image-dots">
              <span
                v-for="(img, i) in product.images"
                :key="i"
                class="dot"
                :class="{ active: (currentIndex[product.id] || 0) === i }"
                @click.stop="goToImage(product.id, i)"
              ></span>
            </div>
          </template>

          <!-- Badge diskon -->
          <span v-if="discountPercent(product)" class="badge badge-discount">
            -{{ discountPercent(product) }}%
          </span>

          <!-- Badge tipe produk -->
          <span v-if="product.type === 'preorder'" class="badge badge-preorder">
            <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3.5 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            {{ formatDate(product.availableDate) }}
          </span>
          <span v-else-if="product.type === 'bundling'" class="badge badge-bundle">
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
            Bundling
          </span>

          <!-- Kondisi barang -->
          <span class="badge-condition">{{ product.condition }}</span>
        </div>

        <!-- Info produk -->
        <div class="product-info">
          <p class="product-category">{{ product.category }}</p>
          <h3 class="product-title">{{ product.title }}</h3>

          <div class="price-row">
            <span class="product-price">{{ formatPrice(product.price) }}</span>
            <span v-if="product.originalPrice" class="product-price-original">{{ formatPrice(product.originalPrice) }}</span>
          </div>

          <div class="rating-row">
            <span class="stars">
              <svg v-for="n in 5" :key="n" viewBox="0 0 24 24" :fill="n <= Math.round(product.rating) ? '#f5a623' : 'none'" stroke="#f5a623" stroke-width="1.5"><path d="M12 2.5l2.9 6 6.6.7-4.9 4.6 1.3 6.6L12 17l-5.9 3.4 1.3-6.6L2.5 9.2l6.6-.7L12 2.5Z"/></svg>
            </span>
            <span class="rating-value">{{ product.rating.toFixed(1) }}</span>
            <span class="sold-count">· Terjual {{ product.sold }}</span>
          </div>

          <ul v-if="product.type === 'bundling'" class="bundle-list">
            <li v-for="(item, i) in product.bundleItems" :key="i">{{ item }}</li>
          </ul>

          <p v-if="product.type === 'preorder'" class="preorder-note">
            Titip jual — diambil setelah penjual kembali ke kampus.
          </p>

          <div class="product-footer">
            <span class="product-location">
              <svg viewBox="0 0 24 24" fill="none"><path d="M12 21s7-6.1 7-11.3A7 7 0 0 0 5 9.7C5 14.9 12 21 12 21Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="9.5" r="2.3" stroke="currentColor" stroke-width="1.8"/></svg>
              {{ product.location }}
            </span>
            <span class="product-seller">
              {{ product.seller }}
              <svg v-if="product.verified" class="verified-icon" viewBox="0 0 24 24" fill="#1e6f5c"><path d="M12 2l2.4 1.3 2.7-.3 1.2 2.4 2.4 1.2-.3 2.7L21.7 12l-1.3 2.4.3 2.7-2.4 1.2-1.2 2.4-2.7-.3L12 22l-2.4-1.3-2.7.3-1.2-2.4-2.4-1.2.3-2.7L2.3 12l1.3-2.4-.3-2.7 2.4-1.2 1.2-2.4 2.7.3L12 2Z"/><path d="M8.5 12.3l2.2 2.2 4.5-4.8" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
            </span>
          </div>

          <button class="btn-chat">Chat Penjual</button>
        </div>
      </article>
    </section>

    <div class="empty-state" v-else>
      <svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.6"/><path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      <p>Produk tidak ditemukan. Coba kata kunci atau kategori lain.</p>
    </div>

    <!-- ================= LOAD MORE ================= -->
    <div class="load-more-wrap" v-if="visibleProducts.length < filteredProducts.length">
      <button class="btn-load-more" @click="visibleCount += 6">Muat Lebih Banyak</button>
    </div>

  </div>
</template>

<script>
export default {
  name: 'BerandaView',

  data() {
    return {
      searchQuery: '',
      activeCategory: 'Semua',
      activeTab: 'all',
      sortBy: 'terbaru',
      bannerIndex: 0,
      visibleCount: 6,

      banners: [
        {
          tag: 'Promo Kampus',
          title: 'Diskon Ongkir COD di Area Kampus',
          desc: 'Belanja hemat, ambil langsung tanpa ongkir tambahan.',
          bg: 'linear-gradient(135deg, #1e6f5c, #2f8f74)'
        },
        {
          tag: 'Titip Jual',
          title: 'Titip Barang Sebelum Pulang Kampung',
          desc: 'Jangan bawa barang berat, titip jual saja lewat kami.',
          bg: 'linear-gradient(135deg, #154c3d, #1e6f5c)'
        },
        {
          tag: 'Bundling Hemat',
          title: 'Paket Perlengkapan Kos Lebih Murah',
          desc: 'Beli satu paket, hemat sampai 20% dibanding beli satuan.',
          bg: 'linear-gradient(135deg, #2f8f74, #57b894)'
        }
      ],

      categories: [
        { name: 'Semua', icon: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/></svg>' },
        { name: 'Buku', icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5v-13Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>' },
        { name: 'Elektronik', icon: '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="11" rx="1.5" stroke="currentColor" stroke-width="1.8"/><path d="M9 19h6M12 15v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' },
        { name: 'Fashion', icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M8 4l4 2 4-2 3 3-2.5 2.5V20H5.5v-10.5L3 7l5-3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>' },
        { name: 'Perlengkapan Kos', icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 10.5L12 4l8 6.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10v9.5h12V10" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>' }
      ],

      tabs: [
        { key: 'all', label: 'Semua Produk' },
        { key: 'preorder', label: 'Titip Jual (Pre-Order)' },
        { key: 'bundling', label: 'Paket Bundling' }
      ],

      favorites: [],
      currentIndex: {},
      _touchStartX: {},

      // Data contoh — sambungkan ke data asli (Supabase/API)
      products: [
        {
          id: 1, title: 'Buku Paket Kalkulus + Fisika Dasar', category: 'Buku',
          price: 85000, originalPrice: 110000, rating: 4.8, sold: 32,
          condition: 'Bekas - Sangat Baik', location: 'Kampus AMIKOM',
          seller: 'Rani', verified: true, type: 'normal',
          images: ['https://media.karousell.com/media/photos/products/2021/8/5/fisika_dasar_halliday_kalkulus_1628148206_ffc8fd45_progressive.jpg']
        },
        {
          id: 2, title: 'Kursi Belajar Lipat Minimalis', category: 'Perlengkapan Kos',
          price: 150000, originalPrice: null, rating: 4.6, sold: 18,
          condition: 'Baru', location: 'Depok, Sleman',
          seller: 'Dimas', verified: false, type: 'normal',
          images: ['https://tse4.mm.bing.net/th/id/OIP.p9jE3IhfVpaUOySRabst3QHaHa?r=0&w=591&h=591&rs=1&pid=ImgDetMain&o=7&rm=3', 'https://5.imimg.com/data5/SELLER/Default/2022/4/WV/SG/TT/7669570/school-college-chair-1000x1000.jpg']
        },
        {
          id: 3, title: 'Setrika + Rice Cooker Mini', category: 'Elektronik',
          price: 120000, originalPrice: 150000, rating: 4.9, sold: 45,
          condition: 'Bekas - Layak Pakai', location: 'Kampus AMIKOM',
          seller: 'Putri', verified: true, type: 'preorder', availableDate: '2026-08-20',
          images: ['https://down-id.img.susercontent.com/file/id-11134207-7rasc-m5l8zdq4fvko5e', 'https://tse2.mm.bing.net/th/id/OIP.SPekAph_c6zNxF7DV0Xh9gHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3']
        },
        {
          id: 4, title: 'Paket Hemat Anak Kos: Rak + Lampu Belajar', category: 'Perlengkapan Kos',
          price: 175000, originalPrice: 220000, rating: 4.7, sold: 27,
          condition: 'Baru', location: 'Kampus AMIKOM',
          seller: 'Bagas', verified: true, type: 'bundling',
          bundleItems: ['Rak Buku 3 Susun', 'Lampu Belajar LED', 'Tikar Lipat'],
          images: ['https://i.pinimg.com/originals/ee/1f/70/ee1f70ecd1392eea9187bc272862a9db.jpg', 'https://down-id.img.susercontent.com/file/id-11134207-7r98t-lv37rryot26l9d', 'https://tse2.mm.bing.net/th/id/OIP.92BlaxA08_cXGkac61njLgHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3']
        },
        {
          id: 5, title: 'Kemeja Formal Sidang (Second, Rapi)', category: 'Fashion',
          price: 60000, originalPrice: null, rating: 4.4, sold: 9,
          condition: 'Bekas - Sangat Baik', location: 'Caturtunggal, Sleman',
          seller: 'Alya', verified: false, type: 'normal',
          images: ['https://tse3.mm.bing.net/th/id/OIP.ESGQtNX24L-WAJ3b0UiDuAAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3']
        },
        {
          id: 6, title: 'Laptop Bekas + Tas + Mouse Wireless', category: 'Elektronik',
          price: 2200000, originalPrice: 2600000, rating: 4.9, sold: 6,
          condition: 'Bekas - Sangat Baik', location: 'Kampus AMIKOM',
          seller: 'Fajar', verified: true, type: 'preorder', availableDate: '2026-09-05',
          images: ['https://down-id.img.susercontent.com/file/id-11134207-7qukx-lfap5d1y43nr3f']
        },
        {
          id: 7, title: 'Meja Lipat Serbaguna', category: 'Perlengkapan Kos',
          price: 95000, originalPrice: 130000, rating: 4.5, sold: 21,
          condition: 'Bekas - Layak Pakai', location: 'Depok, Sleman',
          seller: 'Yoga', verified: false, type: 'normal',
          images: ['https://tse2.mm.bing.net/th/id/OIP.bI4AEQcDBJ7bgBe4n5nilgHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', 'https://i.pinimg.com/originals/24/68/2c/24682c6d9473014283dd13e91f38a3c1.jpg']
        },
        {
          id: 8, title: 'Sepatu Sneakers Kuliah Ukuran 42', category: 'Fashion',
          price: 110000, originalPrice: null, rating: 4.3, sold: 14,
          condition: 'Bekas - Sangat Baik', location: 'Kampus AMIKOM',
          seller: 'Reza', verified: true, type: 'normal',
          images: ['https://media.karousell.com/media/photos/products/2018/04/26/adidas_pace_vs_1524756647_3f8f4265.jpg', 'https://media.karousell.com/media/photos/products/2018/04/26/adidas_pace_vs_1524756648_e4b4c61d.jpg']
        }
      ]
    }
  },

  computed: {
    filteredProducts() {
      const query = this.searchQuery.trim().toLowerCase()

      let result = this.products.filter((p) => {
        const matchesQuery = !query || p.title.toLowerCase().includes(query)
        const matchesCategory = this.activeCategory === 'Semua' || p.category === this.activeCategory
        const matchesTab =
          this.activeTab === 'all' ||
          (this.activeTab === 'preorder' && p.type === 'preorder') ||
          (this.activeTab === 'bundling' && p.type === 'bundling')
        return matchesQuery && matchesCategory && matchesTab
      })

      if (this.sortBy === 'termurah') result = [...result].sort((a, b) => a.price - b.price)
      else if (this.sortBy === 'termahal') result = [...result].sort((a, b) => b.price - a.price)
      else if (this.sortBy === 'terlaris') result = [...result].sort((a, b) => b.sold - a.sold)
      else result = [...result].sort((a, b) => b.id - a.id)

      return result
    },

    visibleProducts() {
      return this.filteredProducts.slice(0, this.visibleCount)
    }
  },

  watch: {
    searchQuery() { this.visibleCount = 6 },
    activeCategory() { this.visibleCount = 6 },
    activeTab() { this.visibleCount = 6 },
    sortBy() { this.visibleCount = 6 }
  },

  mounted() {
    this._bannerTimer = setInterval(() => {
      this.bannerIndex = (this.bannerIndex + 1) % this.banners.length
    }, 5000)
  },

  beforeUnmount() {
    clearInterval(this._bannerTimer)
  },

  methods: {
    formatPrice(value) {
      return 'Rp' + value.toLocaleString('id-ID')
    },

    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    },

    discountPercent(product) {
      if (!product.originalPrice) return 0
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    },

    isFavorite(id) {
      return this.favorites.includes(id)
    },

    toggleFavorite(id) {
      const idx = this.favorites.indexOf(id)
      if (idx === -1) this.favorites.push(id)
      else this.favorites.splice(idx, 1)
    },

    goToImage(productId, index) {
      this.currentIndex = { ...this.currentIndex, [productId]: index }
    },

    nextImage(productId, total) {
      const current = this.currentIndex[productId] || 0
      this.goToImage(productId, (current + 1) % total)
    },

    prevImage(productId, total) {
      const current = this.currentIndex[productId] || 0
      this.goToImage(productId, (current - 1 + total) % total)
    },

    onTouchStart(event, productId) {
      this._touchStartX[productId] = event.changedTouches[0].clientX
    },

    onTouchEnd(event, productId) {
      const startX = this._touchStartX[productId]
      if (startX == null) return
      const endX = event.changedTouches[0].clientX
      const diff = startX - endX
      const total = this.products.find((p) => p.id === productId).images.length

      if (Math.abs(diff) > 40 && total > 1) {
        if (diff > 0) this.nextImage(productId, total)
        else this.prevImage(productId, total)
      }
    }
  }
}
</script>

<style scoped>
.market-page {
  background: var(--bg-gradient);
  padding: 24px var(--section-padding-x) var(--section-padding-y);
}

/* ---------- BANNER ---------- */
.promo-banner {
  max-width: var(--container-max-width);
  margin: 0 auto 28px;
  position: relative;
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.banner-track { display: flex; transition: transform 0.5s ease; }
.banner-slide { min-width: 100%; padding: 44px 40px; color: white; }

.banner-tag {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 14px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.banner-slide h2 { font-size: 1.7rem; font-weight: var(--title-weight); margin-bottom: 8px; max-width: 480px; }
.banner-slide p { font-size: var(--paragraph-size); opacity: 0.9; max-width: 440px; }

.banner-dots { position: absolute; bottom: 14px; right: 20px; display: flex; gap: 6px; }
.banner-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255, 255, 255, 0.5); cursor: pointer; }
.banner-dot.active { background: white; width: 20px; border-radius: 4px; transition: var(--transition); }

/* ---------- SEARCH & CATEGORY ---------- */
.market-search { max-width: var(--container-max-width); margin: 0 auto 20px; display: flex; flex-direction: column; gap: 18px; }

.search-bar {
  display: flex; align-items: center; gap: 10px;
  background: white; border: 1px solid var(--card-border);
  border-radius: var(--radius-button); padding: 12px 18px;
  box-shadow: var(--shadow-soft);
}

.search-bar svg { width: 20px; height: 20px; color: var(--text-muteds); flex-shrink: 0; }
.search-bar input { border: none; outline: none; flex: 1; font-size: var(--paragraph-size); color: var(--text-mains); background: transparent; }

.category-icons { display: flex; gap: 22px; overflow-x: auto; padding-bottom: 4px; }

.category-item {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  background: none; border: none; cursor: pointer; flex-shrink: 0;
  color: var(--text-muteds); font-size: 0.72rem; font-weight: 600;
}

.category-icon {
  width: 52px; height: 52px; border-radius: 50%;
  background: white; border: 1px solid var(--card-border);
  display: flex; align-items: center; justify-content: center;
  color: var(--icon-color); transition: var(--transition);
}

.category-icon :deep(svg) { width: 24px; height: 24px; }

.category-item.active .category-icon { background: var(--primary-color); border-color: var(--primary-color); color: white; }
.category-item.active { color: var(--text-mains); }

/* ---------- TABS ---------- */
.market-tabs { max-width: var(--container-max-width); margin: 0 auto 16px; display: flex; gap: 12px; flex-wrap: wrap; }

.tab-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 18px; border-radius: var(--radius-button);
  border: 1px solid var(--card-border); background: white;
  color: var(--text-muteds); font-size: var(--caption-size);
  font-weight: var(--caption-weight); cursor: pointer; transition: var(--transition);
}

.tab-btn svg { width: 16px; height: 16px; }
.tab-btn.active { background: var(--secondary-color); border-color: var(--secondary-color); color: var(--button-text-color); }

/* ---------- TOOLBAR ---------- */
.market-toolbar {
  max-width: var(--container-max-width); margin: 0 auto 18px;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 10px;
}

.result-count { font-size: var(--caption-size); color: var(--text-muteds); }
.sort-select { display: flex; align-items: center; gap: 8px; font-size: var(--caption-size); color: var(--text-muteds); }
.sort-select select {
  border: 1px solid var(--card-border); border-radius: 8px;
  padding: 6px 10px; font-size: var(--caption-size);
  background: white; color: var(--text-mains);
}

/* ---------- GRID ---------- */
.market-grid {
  max-width: var(--container-max-width); margin: 0 auto;
  display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--grid-gap);
}

.product-card {
  background: var(--card-bg); border: 1px solid var(--card-border);
  border-radius: var(--radius-card); overflow: hidden;
  box-shadow: var(--shadow-card); transition: var(--transition);
  display: flex; flex-direction: column;
}

.product-card:hover { transform: translateY(-6px); box-shadow: 0 20px 30px rgba(30, 111, 92, 0.14); }

/* ---------- IMAGE ---------- */
.product-image-wrap { position: relative; width: 100%; aspect-ratio: 1 / 1; overflow: hidden; background: #eef2f0; touch-action: pan-y; }
.image-track { display: flex; height: 100%; transition: transform 0.3s ease; }
.image-track img { width: 100%; height: 100%; object-fit: cover; flex-shrink: 0; user-select: none; }

.fav-btn {
  position: absolute; top: 10px; right: 10px;
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(255, 255, 255, 0.9); border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--text-muteds); z-index: 2; transition: var(--transition);
}
.fav-btn svg { width: 18px; height: 18px; }
.fav-btn.active { color: #e63950; }
.fav-btn:hover { transform: scale(1.08); }

.img-arrow {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 30px; height: 30px; border-radius: 50%; border: none;
  background: rgba(255, 255, 255, 0.85); color: var(--text-mains);
  font-size: 1.1rem; line-height: 1; cursor: pointer; z-index: 2;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: var(--transition);
}
.product-image-wrap:hover .img-arrow { opacity: 1; }
.img-arrow.left { left: 8px; }
.img-arrow.right { right: 8px; }

.image-dots { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; z-index: 2; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255, 255, 255, 0.6); cursor: pointer; transition: var(--transition); }
.dot.active { background: white; width: 16px; border-radius: 4px; }

.badge {
  position: absolute; left: 10px;
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 10px; border-radius: 50px;
  font-size: 0.68rem; font-weight: 700; z-index: 2;
}
.badge svg { width: 11px; height: 11px; }
.badge-discount { top: 10px; background: #e63950; color: white; }
.badge-preorder { top: 42px; background: #fff4d6; color: #916800; }
.badge-bundle { top: 42px; background: #ddeee7; color: var(--primary-color); }

.badge-condition {
  position: absolute; bottom: 10px; left: 10px;
  background: rgba(0, 0, 0, 0.55); color: white;
  font-size: 0.65rem; padding: 4px 9px; border-radius: 50px; z-index: 2;
}

/* ---------- INFO ---------- */
.product-info { padding: 14px 16px 16px; display: flex; flex-direction: column; flex: 1; }

.product-category { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-muteds); opacity: 0.7; margin-bottom: 4px; }
.product-title { font-size: var(--caption-size); font-weight: var(--subtitle-weight); color: var(--text-mains); margin-bottom: 6px; line-height: 1.3; min-height: 2.4em; }

.price-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 6px; flex-wrap: wrap; }
.product-price { font-size: 1.05rem; font-weight: 800; color: var(--primary-color); }
.product-price-original { font-size: 0.75rem; color: var(--text-muteds); text-decoration: line-through; opacity: 0.7; }

.rating-row { display: flex; align-items: center; gap: 4px; margin-bottom: 8px; }
.stars { display: flex; gap: 1px; }
.stars svg { width: 12px; height: 12px; }
.rating-value { font-size: 0.72rem; color: var(--text-mains); font-weight: 600; }
.sold-count { font-size: 0.72rem; color: var(--text-muteds); }

.bundle-list { list-style: disc; padding-left: 18px; margin-bottom: 8px; }
.bundle-list li { font-size: 0.72rem; color: var(--text-muteds); }

.preorder-note { font-size: 0.72rem; color: var(--text-muteds); opacity: 0.85; line-height: 1.4; margin-bottom: 8px; }

.product-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 8px; margin-top: auto; border-top: 1px solid var(--card-border);
  font-size: 0.68rem; color: var(--text-muteds); gap: 6px; flex-wrap: wrap;
}
.product-location { display: inline-flex; align-items: center; gap: 4px; }
.product-location svg { width: 12px; height: 12px; }
.product-seller { display: inline-flex; align-items: center; gap: 4px; }
.verified-icon { width: 13px; height: 13px; }

.btn-chat {
  margin-top: 10px; width: 100%; padding: 9px;
  border-radius: var(--radius-button); border: 1px solid var(--primary-color);
  background: white; color: var(--primary-color);
  font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: var(--transition);
}
.btn-chat:hover { background: var(--primary-color); color: white; }

/* ---------- EMPTY / LOAD MORE ---------- */
.empty-state { max-width: var(--container-max-width); margin: 60px auto; text-align: center; color: var(--text-muteds); }
.empty-state svg { width: 48px; height: 48px; margin-bottom: 12px; opacity: 0.5; }

.load-more-wrap { text-align: center; margin-top: 32px; }
.btn-load-more {
  padding: 12px 32px; border-radius: var(--radius-button);
  border: 1px solid var(--primary-color); background: white;
  color: var(--primary-color); font-weight: 700; font-size: var(--caption-size);
  cursor: pointer; transition: var(--transition);
}
.btn-load-more:hover { background: var(--primary-color); color: white; }

/* ---------- RESPONSIVE ---------- */
@media (max-width: 640px) {
  .banner-slide { padding: 30px 22px; }
  .banner-slide h2 { font-size: 1.25rem; }
  .market-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px; }
  .product-title { font-size: 0.8rem; }
  .product-price { font-size: 0.95rem; }
}
</style>
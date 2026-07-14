<template>
  <div class="market-page">

    <!-- ================= HERO / BANNER ================= -->
    <section class="hero-banner">
      <div class="hero-track" :style="{ transform: `translateX(-${bannerIndex * 100}%)` }">
        <div class="hero-slide" v-for="(slide, i) in banners" :key="i">
          <span class="hero-tag">{{ slide.tag }}</span>
          <h2>{{ slide.title }}</h2>
          <p>{{ slide.desc }}</p>
        </div>
      </div>
      <div class="hero-dots">
        <button
          v-for="(slide, i) in banners"
          :key="i"
          class="hero-dot"
          :class="{ active: bannerIndex === i }"
          @click="bannerIndex = i"
          :aria-label="'Slide ' + (i + 1)"
        ></button>
      </div>
    </section>

    <!-- ================= FILTER BAR ================= -->
    <section class="filter-bar">
      <div class="search-bar">
        <svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <input v-model="searchQuery" type="text" placeholder="Cari buku, elektronik, perlengkapan kos..." />
      </div>

      <div class="chip-row">
        <button
          v-for="cat in categories"
          :key="cat.name"
          class="chip"
          :class="{ active: activeCategory === cat.name }"
          @click="activeCategory = cat.name"
        >
          <span class="chip-icon" v-html="cat.icon"></span>
          {{ cat.name }}
        </button>
      </div>
    </section>

    <!-- ================= TABS + TOOLBAR ================= -->
    <section class="control-row">
      <div class="tab-group" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-btn"
          role="tab"
          :aria-selected="activeTab === tab.key"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="toolbar-meta">
        <p class="result-count">{{ filteredProducts.length }} produk</p>
        <div class="sort-select">
          <select v-model="sortBy" aria-label="Urutkan produk">
            <option value="terbaru">Terbaru</option>
            <option value="termurah">Harga Terendah</option>
            <option value="termahal">Harga Tertinggi</option>
            <option value="terlaris">Terlaris</option>
          </select>
        </div>
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

          <!-- Badge diskon (satu-satunya badge berwarna) -->
          <span v-if="discountPercent(product)" class="badge badge-discount">
            -{{ discountPercent(product) }}%
          </span>

          <!-- Badge tipe produk (netral) -->
          <span v-if="product.type === 'preorder'" class="badge badge-neutral badge-top">
            {{ formatDate(product.availableDate) }}
          </span>
          <span v-else-if="product.type === 'bundling'" class="badge badge-neutral badge-top">
            Bundling
          </span>
        </div>

        <!-- Info produk -->
        <div class="product-info">
          <p class="product-category">{{ product.category }} · {{ product.condition }}</p>
          <h3 class="product-title">{{ product.title }}</h3>

          <div class="price-row">
            <span class="product-price">{{ formatPrice(product.price) }}</span>
            <span v-if="product.originalPrice" class="product-price-original">{{ formatPrice(product.originalPrice) }}</span>
          </div>

          <div class="rating-row">
            <svg class="star-icon" viewBox="0 0 24 24" fill="#f5a623"><path d="M12 2.5l2.9 6 6.6.7-4.9 4.6 1.3 6.6L12 17l-5.9 3.4 1.3-6.6L2.5 9.2l6.6-.7L12 2.5Z"/></svg>
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
          desc: 'Belanja hemat, ambil langsung tanpa ongkir tambahan.'
        },
        {
          tag: 'Titip Jual',
          title: 'Titip Barang Sebelum Pulang Kampung',
          desc: 'Jangan bawa barang berat, titip jual saja lewat kami.'
        },
        {
          tag: 'Bundling Hemat',
          title: 'Paket Perlengkapan Kos Lebih Murah',
          desc: 'Beli satu paket, hemat sampai 20% dibanding beli satuan.'
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
  padding: 20px var(--section-padding-x) var(--section-padding-y);
}

/* ---------- HERO BANNER (satu warna, tenang) ---------- */
.hero-banner {
  max-width: var(--container-max-width);
  margin: 0 auto 24px;
  position: relative;
  border-radius: var(--radius-card);
  overflow: hidden;
  background: var(--primary-color);
  box-shadow: var(--shadow-soft);
}

.hero-track { display: flex; transition: transform 0.5s ease; }
.hero-slide { min-width: 100%; padding: 32px 36px; color: white; }

.hero-tag {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0.75;
  margin-bottom: 10px;
}

.hero-slide h2 { font-size: 1.35rem; font-weight: var(--title-weight); margin-bottom: 6px; max-width: 480px; line-height: 1.3; }
.hero-slide p { font-size: var(--caption-size); opacity: 0.85; max-width: 420px; }

.hero-dots { position: absolute; bottom: 14px; right: 20px; display: flex; gap: 6px; }
.hero-dot { width: 6px; height: 6px; padding: 0; border-radius: 50%; border: none; background: rgba(255, 255, 255, 0.4); cursor: pointer; }
.hero-dot.active { background: white; width: 16px; border-radius: 4px; transition: var(--transition); }

/* ---------- FILTER BAR ---------- */
.filter-bar {
  max-width: var(--container-max-width);
  margin: 0 auto 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.search-bar {
  display: flex; align-items: center; gap: 10px;
  background: var(--card-bg); border: 1px solid var(--card-border);
  border-radius: var(--radius-button); padding: 11px 16px;
}

.search-bar svg { width: 18px; height: 18px; color: var(--text-muteds); flex-shrink: 0; }
.search-bar input { border: none; outline: none; flex: 1; font-size: var(--caption-size); color: var(--text-mains); background: transparent; }

.chip-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 2px; }

.chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 50px;
  border: 1px solid var(--card-border); background: var(--card-bg);
  color: var(--text-muteds); font-size: 0.78rem; font-weight: 600;
  cursor: pointer; white-space: nowrap; transition: var(--transition);
}

.chip-icon { display: inline-flex; width: 14px; height: 14px; }
.chip-icon :deep(svg) { width: 14px; height: 14px; }

.chip.active { background: var(--primary-color); border-color: var(--primary-color); color: white; }

/* ---------- TABS + TOOLBAR ---------- */
.control-row {
  max-width: var(--container-max-width);
  margin: 0 auto 18px;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--card-border);
}

.tab-group { display: flex; gap: 4px; }

.tab-btn {
  padding: 8px 4px; margin-right: 18px;
  border: none; background: none; border-bottom: 2px solid transparent;
  color: var(--text-muteds); font-size: var(--caption-size);
  font-weight: 600; cursor: pointer; transition: var(--transition);
}
.tab-btn.active { color: var(--primary-color); border-bottom-color: var(--primary-color); }

.toolbar-meta { display: flex; align-items: center; gap: 14px; }
.result-count { font-size: 0.78rem; color: var(--text-muteds); }
.sort-select select {
  border: 1px solid var(--card-border); border-radius: 8px;
  padding: 6px 10px; font-size: 0.78rem;
  background: var(--card-bg); color: var(--text-mains);
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
  display: flex; flex-direction: column; transition: var(--transition);
}

.product-card:hover { box-shadow: var(--shadow-card); }

/* ---------- IMAGE ---------- */
.product-image-wrap { position: relative; width: 100%; aspect-ratio: 1 / 1; overflow: hidden; background: #eef2f0; touch-action: pan-y; }
.image-track { display: flex; height: 100%; transition: transform 0.3s ease; }
.image-track img { width: 100%; height: 100%; object-fit: cover; flex-shrink: 0; user-select: none; }

.fav-btn {
  position: absolute; top: 10px; right: 10px;
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(255, 255, 255, 0.9); border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--text-muteds); z-index: 2; transition: var(--transition);
}
.fav-btn svg { width: 16px; height: 16px; }
.fav-btn.active { color: #e63950; }

.img-arrow {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 28px; height: 28px; border-radius: 50%; border: none;
  background: rgba(255, 255, 255, 0.85); color: var(--text-mains);
  font-size: 1.05rem; line-height: 1; cursor: pointer; z-index: 2;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: var(--transition);
}
.product-image-wrap:hover .img-arrow { opacity: 1; }
.img-arrow.left { left: 8px; }
.img-arrow.right { right: 8px; }

.image-dots { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: 5px; z-index: 2; }
.dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255, 255, 255, 0.6); cursor: pointer; transition: var(--transition); }
.dot.active { background: white; width: 14px; border-radius: 4px; }

.badge {
  position: absolute; top: 10px; left: 10px;
  padding: 4px 9px; border-radius: 6px;
  font-size: 0.65rem; font-weight: 700; z-index: 2;
}
.badge-discount { background: #e63950; color: white; }
.badge-neutral { background: rgba(0, 0, 0, 0.55); color: white; }
.badge-top { top: 10px; }
.badge-discount + .badge-top { top: 38px; }

/* ---------- INFO ---------- */
.product-info { padding: 13px 15px 15px; display: flex; flex-direction: column; flex: 1; }

.product-category { font-size: 0.68rem; color: var(--text-muteds); opacity: 0.75; margin-bottom: 4px; }
.product-title {
  font-size: var(--caption-size); font-weight: var(--subtitle-weight); color: var(--text-mains);
  margin-bottom: 6px; line-height: 1.3;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.price-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 6px; flex-wrap: wrap; }
.product-price { font-size: 1rem; font-weight: 800; color: var(--primary-color); }
.product-price-original { font-size: 0.72rem; color: var(--text-muteds); text-decoration: line-through; opacity: 0.7; }

.rating-row { display: flex; align-items: center; gap: 4px; margin-bottom: 8px; }
.star-icon { width: 13px; height: 13px; }
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
  background: transparent; color: var(--primary-color);
  font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: var(--transition);
}
.btn-chat:hover { background: var(--primary-color); color: white; }

/* ---------- EMPTY / LOAD MORE ---------- */
.empty-state { max-width: var(--container-max-width); margin: 60px auto; text-align: center; color: var(--text-muteds); }
.empty-state svg { width: 44px; height: 44px; margin-bottom: 12px; opacity: 0.4; }

.load-more-wrap { text-align: center; margin-top: 28px; }
.btn-load-more {
  padding: 11px 30px; border-radius: var(--radius-button);
  border: 1px solid var(--card-border); background: var(--card-bg);
  color: var(--text-mains); font-weight: 600; font-size: 0.82rem;
  cursor: pointer; transition: var(--transition);
}
.btn-load-more:hover { border-color: var(--primary-color); color: var(--primary-color); }

/* ---------- RESPONSIVE ---------- */
@media (max-width: 640px) {
  .hero-slide { padding: 24px 20px; }
  .hero-slide h2 { font-size: 1.1rem; }
  .control-row { flex-direction: column; align-items: flex-start; }
  .market-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
  .product-title { font-size: 0.8rem; }
  .product-price { font-size: 0.92rem; }
}
</style>
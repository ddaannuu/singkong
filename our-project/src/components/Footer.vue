<template>
  <footer class="site-footer">
    <div class="footer-top">
      <!-- Brand -->
      <div class="footer-col footer-brand">
        <div class="footer-logo">
          <img :src="content.images.logo" alt="Logo" />
          <span>Second Chance Market</span>
        </div>
        <p class="footer-desc">{{ content.footer.line1 }}</p>

        <div class="footer-social">
          <a href="#" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="2"/><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor"/></svg>
          </a>
          <a href="#" aria-label="TikTok">
            <svg viewBox="0 0 24 24" fill="none"><path d="M14 3v10.8a3.2 3.2 0 1 1-2.4-3.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M14 3c.4 2.6 2.2 4.4 4.8 4.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </a>
          <a href="#" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="none"><path d="M14 21v-7h2.4l.4-3H14V9c0-.9.2-1.5 1.6-1.5H17V4.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.7 1.4-3.7 3.9V11H8.5v3H11v7h3Z" fill="currentColor"/></svg>
          </a>
          <a href="#" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" fill="none"><path d="M4 20l1.2-3.9A7.9 7.9 0 1 1 8.3 19L4 20Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 9.3c0 3 2.7 5.7 5.7 5.7.6 0 .8-.4.8-.8v-1c-1 0-1.9-.2-2.7-.7-.2-.1-.4-.1-.6.1l-.6.6c-.8-.5-1.5-1.2-2-2l.6-.6c.2-.2.2-.4.1-.6-.5-.8-.7-1.7-.7-2.7h-1c-.4 0-.8.2-.8.8Z" fill="currentColor"/></svg>
          </a>
        </div>
      </div>

      <!-- Navigasi -->
      <div class="footer-col">
        <h4>Navigasi</h4>
        <ul>
          <li><a href="#features"><svg class="link-icon" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Fitur</a></li>
          <li><a href="#how-it-works"><svg class="link-icon" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Cara Kerja</a></li>
          <li><a href="#testimoni"><svg class="link-icon" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Testimoni</a></li>
          <li><a href="#action"><svg class="link-icon" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Mulai Sekarang</a></li>
        </ul>
      </div>

      <!-- Bantuan -->
      <div class="footer-col">
        <h4>Bantuan</h4>
        <ul>
          <li><a href="#"><svg class="link-icon" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Pusat Bantuan</a></li>
          <li><a href="#"><svg class="link-icon" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Syarat & Ketentuan</a></li>
          <li><a href="#"><svg class="link-icon" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Kebijakan Privasi</a></li>
          <li><a href="#"><svg class="link-icon" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>FAQ</a></li>
        </ul>
      </div>

      <!-- Kontak -->
      <div class="footer-col">
        <h4>Kontak Kami</h4>
        <ul class="footer-contact">
          <li>
            <svg class="contact-icon" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-6.1 7-11.3A7 7 0 0 0 5 9.7C5 14.9 12 21 12 21Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="9.5" r="2.3" stroke="currentColor" stroke-width="2"/></svg>
            Kampus AMIKOM, Yogyakarta
          </li>
          <li>
            <svg class="contact-icon" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3.5 6.5l8.5 6 8.5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            halo@secondchancemarket.id
          </li>
          <li>
            <svg class="contact-icon" viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8c1.4 2.7 3.6 4.9 6.3 6.3l2.1-2.1c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4.5c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1L6.6 10.8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
            +62 812-9999-9999
          </li>
        </ul>
      </div>
    </div>

    <div class="footer-divider"></div>

    <div class="footer-bottom">
      <p>{{ content.footer.line2 }}</p>
    </div>
  </footer>
</template>

<script>
import { content } from '../composables/useSiteContent'

export default {
  name: 'Footer',

  data() {
    return { content }
  }
}
</script>

<style scoped>
.site-footer {
  background: var(--footer-bg);
  color: var(--footer-text);
  padding: 60px var(--section-padding-x) 0;
  text-align: left;
}

.footer-top {
  max-width: var(--container-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
  gap: var(--grid-gap);
  padding-bottom: 40px;
}

.footer-col h4 {
  color: var(--text-main);
  font-size: var(--paragraph-size);
  font-weight: var(--subtitle-weight);
  margin-bottom: 18px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.footer-logo img {
  width: 28px;
  height: 28px;
}

.footer-logo span {
  color: var(--text-main);
  font-size: 1.15rem;
  font-weight: var(--subtitle-weight);
}

.footer-desc {
  font-size: var(--caption-size);
  line-height: var(--line-height-base);
  color: var(--footer-text);
  opacity: 0.85;
  max-width: 320px;
  margin-bottom: 22px;
}

.footer-social {
  display: flex;
  gap: 12px;
}

.footer-social a {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  color: var(--footer-text);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  text-decoration: none;
}

.footer-social a svg {
  width: 18px;
  height: 18px;
}

.footer-social a:hover {
  background: var(--secondary-color);
  color: var(--button-text-color);
  transform: translateY(-3px);
}

.footer-col ul {
  list-style: none;
}

.footer-col ul li {
  margin-bottom: 12px;
}

.footer-col ul li a {
  color: var(--footer-text);
  text-decoration: none;
  font-size: var(--caption-size);
  opacity: 0.85;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.footer-col ul li a .link-icon {
  width: 12px;
  height: 12px;
  color: var(--secondary-color);
  flex-shrink: 0;
}

.footer-col ul li a:hover {
  opacity: 1;
  color: var(--text-main);
  transform: translateX(4px);
}

.footer-contact li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: var(--caption-size);
  opacity: 0.85;
  line-height: 1.5;
}

.footer-contact li .contact-icon {
  width: 16px;
  height: 16px;
  color: var(--secondary-color);
  margin-top: 1px;
  flex-shrink: 0;
}

.footer-divider {
  max-width: var(--container-max-width);
  margin: 0 auto;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.footer-bottom {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 24px 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  text-align: left;
}

.footer-bottom p {
  font-size: var(--caption-size);
  opacity: 0.75;
  margin: 0;
}

.footer-made-with {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.footer-made-with .heart-icon {
  width: 14px;
  height: 14px;
  color: #ff6b6b;
}

/* Tablet */
@media (max-width: 1024px) {
  .footer-top {
    grid-template-columns: 1fr 1fr;
  }

  .footer-brand {
    grid-column: 1 / -1;
  }

  .footer-desc {
    max-width: 100%;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .site-footer {
    padding: 50px 6% 0;
  }

  .footer-top {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: left;
  }

  .footer-logo,
  .footer-social {
    justify-content: flex-start;
  }

  .footer-desc {
    margin-left: 0;
    margin-right: 0;
  }

  .footer-col ul li a,
  .footer-contact li {
    justify-content: flex-start;
    text-align: left;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>
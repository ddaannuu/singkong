import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'

const routes = [
  {
    path: '/',
    name: 'landing-page',
    component: LandingPage
  },
  {
    // Lazy-loaded supaya kode admin (form, GitHub API, dll) tidak ikut
    // membengkakkan bundle halaman utama yang dilihat pengunjung biasa.
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue')
  },
   {
    // Lazy-loaded supaya kode admin (form, GitHub API, dll) tidak ikut
    // membengkakkan bundle halaman utama yang dilihat pengunjung biasa.
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/BerandaView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router

import { createRouter, createWebHashHistory } from 'vue-router'
import MainLayout from '../views/MainLayout.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
    },
    {
      path: '/tools/minecraft',
      component: () => import('../tools/minecraft/MinecraftTracker.vue'),
    },
    {
      path: '/tools/music',
      component: () => import('../tools/music/MusicPlayer.vue'),
    },
    {
      path: '/tools/deltaforce',
      component: () => import('../tools/deltaforce/DeltaForceStats.vue'),
    },
    {
      path: '/tools/naruto',
      component: () => import('../tools/naruto/NarutoMobileStats.vue'),
    },
    {
      path: '/tools/wot',
      component: () => import('../tools/wot/WoTStats.vue'),
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

export default router

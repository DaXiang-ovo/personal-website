<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ThemeToggle from '../ui/ThemeToggle.vue'
import HamburgerMenu from './HamburgerMenu.vue'

const activeSection = ref('hero')
const scrollProgress = ref(0)

const navLinks = [
  { id: 'hero', label: '首页' },
  { id: 'about', label: '关于' },
  { id: 'techstack', label: '技术栈' },
  { id: 'projects', label: '项目' },
  { id: 'social', label: '联系' },
  { id: 'tools', label: '工具' },
]

let observers: IntersectionObserver[] = []

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function updateScrollProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
}

onMounted(() => {
  navLinks.forEach(({ id }) => {
    const el = document.getElementById(id)
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection.value = id
          }
        })
      },
      { threshold: 0.3, rootMargin: '-60px 0px 0px 0px' }
    )
    observer.observe(el)
    observers.push(observer)
  })

  window.addEventListener('scroll', updateScrollProgress, { passive: true })
  updateScrollProgress()
})

onUnmounted(() => {
  observers.forEach((o) => o.disconnect())
  observers = []
  window.removeEventListener('scroll', updateScrollProgress)
})
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0D1B2A]/80 border-b border-yellow-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
  >
    <!-- Scroll progress bar -->
    <div
      class="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-400 transition-all duration-100"
      :style="{ width: scrollProgress + '%' }"
    />

    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo -->
      <button
        @click="scrollTo('hero')"
        class="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
        aria-label="Go to top"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M14 2 C8 2, 3 7, 3 13 C3 18, 6 22, 10 24 L14 26 L18 24 C22 22, 25 18, 25 13 C25 7, 20 2, 14 2 Z"
            fill="#FF6B00"
          />
          <path
            d="M14 4 C9 4, 5 8, 5 13 C5 17, 7.5 20.5, 11 22.5 L14 24 L17 22.5 C20.5 20.5, 23 17, 23 13 C23 8, 19 4, 14 4 Z"
            fill="#FF8C38"
            opacity="0.6"
          />
          <line x1="14" y1="6" x2="14" y2="24" stroke="#0D1B2A" stroke-width="1.5" />
          <line x1="14" y1="13" x2="8" y2="9" stroke="#0D1B2A" stroke-width="1" />
          <line x1="14" y1="13" x2="20" y2="9" stroke="#0D1B2A" stroke-width="1" />
          <line x1="14" y1="16" x2="9" y2="20" stroke="#0D1B2A" stroke-width="1" />
          <line x1="14" y1="16" x2="19" y2="20" stroke="#0D1B2A" stroke-width="1" />
        </svg>
        <span class="text-orange-500 font-bold text-lg tracking-wide hidden sm:block">DaXiang</span>
      </button>

      <!-- Desktop nav links -->
      <nav class="hidden md:flex items-center gap-1" aria-label="Main navigation">
        <a
          v-for="link in navLinks"
          :key="link.id"
          href="#"
          @click.prevent="scrollTo(link.id)"
          class="relative px-3 py-1.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
          :class="
            activeSection === link.id
              ? 'text-orange-500'
              : 'text-gray-300 hover:text-orange-400'
          "
        >
          {{ link.label }}
          <!-- Active bottom border indicator -->
          <span
            v-if="activeSection === link.id"
            class="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full"
          />
        </a>
      </nav>

      <!-- Right side: ThemeToggle + Hamburger -->
      <div class="flex items-center gap-2">
        <ThemeToggle />
        <HamburgerMenu />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useThemeStore } from '../../stores/theme'

const themeStore = useThemeStore()
</script>

<template>
  <button
    @click="themeStore.toggle()"
    class="p-2 rounded-full transition-all duration-300 hover:bg-orange-500/20 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
    :aria-label="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <transition name="icon-fade" mode="out-in">
      <!-- Sun icon (light mode) -->
      <svg
        v-if="themeStore.isDark"
        key="sun"
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 text-yellow-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
      <!-- Moon icon (dark mode) -->
      <svg
        v-else
        key="moon"
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 text-slate-600 dark:text-slate-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </transition>
  </button>
</template>

<style scoped>
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.icon-fade-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}
.icon-fade-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}
</style>

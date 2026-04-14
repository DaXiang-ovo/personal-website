<script setup lang="ts">
import { ref, computed } from 'vue'
import siteData from '../../data/site.json'
import { useIntersectionObserver } from '../../composables/useIntersectionObserver'

const expanded = ref(false)
const { targetRef, isVisible } = useIntersectionObserver()

const wordCount = computed(() => siteData.bio.split(/\s+/).length)
const isLong = computed(() => wordCount.value > 200)

const displayBio = computed(() => {
  if (!isLong.value || expanded.value) return siteData.bio
  return siteData.bio.split(/\s+/).slice(0, 200).join(' ') + '…'
})
</script>

<template>
  <section
    id="about"
    class="relative py-20 px-4 bg-[var(--color-bg)] overflow-hidden"
  >
    <!-- Kanji watermark with slow rotation -->
    <div
      class="absolute right-4 top-1/2 text-[14rem] font-bold text-orange-500/5 select-none pointer-events-none leading-none rotate-slow"
      aria-hidden="true"
    >
      忍
    </div>

    <div
      ref="targetRef"
      class="max-w-3xl mx-auto relative z-10 transition-all duration-700"
      :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
    >
      <!-- Section title -->
      <h2 class="text-3xl font-bold gradient-text mb-2">关于我</h2>
      <div class="w-16 h-1 bg-gradient-to-r from-orange-500 to-yellow-400 rounded mb-8" />

      <!-- Bio card with left accent border -->
      <div class="scroll-border bg-[var(--color-surface)] rounded-2xl p-6 sm:p-10 relative overflow-hidden">
        <!-- Left gradient accent line -->
        <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-yellow-400 rounded-l-2xl" />

        <p class="text-[var(--color-text)] leading-relaxed text-base sm:text-lg whitespace-pre-line pl-2">
          {{ displayBio }}
        </p>

        <button
          v-if="isLong"
          @click="expanded = !expanded"
          class="mt-4 ml-2 text-orange-500 hover:text-orange-400 font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
        >
          {{ expanded ? '收起' : '阅读更多' }}
        </button>
      </div>
    </div>
  </section>
</template>

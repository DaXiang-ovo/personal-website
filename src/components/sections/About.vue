<script setup lang="ts">
import { ref, computed } from 'vue'
import siteData from '../../data/site.json'

const expanded = ref(false)

const wordCount = computed(() => siteData.bio.split(/\s+/).length)
const isLong = computed(() => wordCount.value > 200)

const displayBio = computed(() => {
  if (!isLong.value || expanded.value) return siteData.bio
  // Show first 200 words
  return siteData.bio.split(/\s+/).slice(0, 200).join(' ') + '…'
})
</script>

<template>
  <section
    id="about"
    class="relative py-20 px-4 bg-[var(--color-bg)] overflow-hidden"
  >
    <!-- Kanji watermark -->
    <div
      class="absolute right-4 top-1/2 -translate-y-1/2 text-[12rem] font-bold text-orange-500/5 select-none pointer-events-none leading-none"
      aria-hidden="true"
    >
      忍
    </div>

    <div class="max-w-3xl mx-auto relative z-10">
      <!-- Section title -->
      <h2 class="text-3xl font-bold text-[var(--color-text)] mb-2">关于我</h2>
      <div class="w-16 h-1 bg-orange-500 rounded mb-8" />

      <!-- Scroll-style border card -->
      <div class="scroll-border bg-[var(--color-surface)] rounded-lg p-6 sm:p-8">
        <p class="text-[var(--color-text)] leading-relaxed text-base sm:text-lg whitespace-pre-line">
          {{ displayBio }}
        </p>

        <button
          v-if="isLong"
          @click="expanded = !expanded"
          class="mt-4 text-orange-500 hover:text-orange-400 font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
        >
          {{ expanded ? '收起' : '阅读更多' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import techData from '../../data/techstack.json'

// Per-card visibility for stagger animation
const visibleCards = ref<boolean[]>(techData.categories.map(() => false))
const cardRefs = ref<(HTMLElement | null)[]>([])
let observers: IntersectionObserver[] = []

onMounted(() => {
  cardRefs.value.forEach((el, i) => {
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => { visibleCards.value[i] = true }, i * 100)
            obs.disconnect()
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    observers.push(obs)
  })
})

onUnmounted(() => {
  observers.forEach((o) => o.disconnect())
})
</script>

<template>
  <section
    id="techstack"
    class="relative py-20 px-4 bg-[var(--color-bg-secondary)] overflow-hidden"
  >
    <!-- Diagonal stripe pattern -->
    <div
      class="absolute inset-0 pointer-events-none opacity-[0.03]"
      style="background-image: repeating-linear-gradient(45deg, #FF6B00 0, #FF6B00 1px, transparent 0, transparent 50%); background-size: 20px 20px;"
    />

    <div class="max-w-6xl mx-auto relative z-10">
      <!-- Section title -->
      <h2 class="text-3xl font-bold gradient-text mb-2">技术栈</h2>
      <div class="flex items-center gap-2 mb-10">
        <div class="w-16 h-1 bg-gradient-to-r from-orange-500 to-yellow-400 rounded" />
        <div class="w-4 h-1 bg-yellow-500 rounded" />
        <div class="w-2 h-1 bg-orange-300 rounded" />
      </div>

      <!-- Category grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(category, i) in techData.categories"
          :key="category.name"
          :ref="(el) => { cardRefs[i] = el as HTMLElement | null }"
          class="rounded-2xl p-5 border card-hover transition-all duration-700 dark:glass"
          :class="[
            visibleCards[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
            'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-orange-500/50 hover:shadow-[0_8px_30px_rgba(255,107,0,0.15)]'
          ]"
        >
          <h3 class="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-4">
            {{ category.name }}
          </h3>
          <ul class="space-y-3">
            <li
              v-for="item in category.items"
              :key="item.name"
              class="flex items-center gap-3 group/item"
            >
              <img
                v-if="item.iconUrl"
                :src="item.iconUrl"
                :alt="`${item.name} icon`"
                class="w-6 h-6 object-contain flex-shrink-0 transition-transform duration-200 group-hover/item:scale-125"
              />
              <span
                v-else
                class="w-6 h-6 flex-shrink-0 rounded bg-orange-500/20 text-orange-500 text-xs flex items-center justify-center font-bold transition-transform duration-200 group-hover/item:scale-125"
                aria-hidden="true"
              >
                {{ item.name.charAt(0) }}
              </span>
              <span class="text-[var(--color-text)] text-sm">{{ item.name }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

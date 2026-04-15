<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import projectsData from '../../data/projects.json'

const visibleCards = ref<boolean[]>(projectsData.projects.map(() => false))
const cardRefs = ref<(HTMLElement | null)[]>([])
let observers: IntersectionObserver[] = []

// Color accents per card for visual variety
const cardAccents = [
  { gradient: 'from-blue-500 to-cyan-400', border: 'border-blue-500/30', glow: 'rgba(59,130,246,0.15)' },
  { gradient: 'from-purple-500 to-pink-400', border: 'border-purple-500/30', glow: 'rgba(168,85,247,0.15)' },
  { gradient: 'from-green-500 to-emerald-400', border: 'border-green-500/30', glow: 'rgba(34,197,94,0.15)' },
  { gradient: 'from-orange-500 to-yellow-400', border: 'border-orange-500/30', glow: 'rgba(255,107,0,0.15)' },
  { gradient: 'from-pink-500 to-rose-400', border: 'border-pink-500/30', glow: 'rgba(236,72,153,0.15)' },
]

onMounted(() => {
  cardRefs.value.forEach((el, i) => {
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => { visibleCards.value[i] = true }, i * 120)
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
    id="projects"
    class="relative py-20 px-4 bg-[var(--color-bg)] overflow-hidden"
  >
    <!-- Subtle grid pattern background -->
    <div
      class="absolute inset-0 pointer-events-none opacity-[0.025]"
      style="background-image: linear-gradient(rgba(255,107,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,1) 1px, transparent 1px); background-size: 40px 40px;"
    />

    <div class="max-w-4xl mx-auto relative z-10">
      <h2 class="text-3xl font-bold gradient-text-animated mb-2">项目</h2>
      <div class="flex items-center gap-2 mb-10">
        <div class="w-16 h-1 bg-gradient-to-r from-orange-500 to-yellow-400 rounded" />
        <div class="w-4 h-1 bg-yellow-500 rounded" />
        <div class="w-2 h-1 bg-orange-300 rounded" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="(project, i) in projectsData.projects"
          :key="project.name"
          :ref="(el) => { cardRefs[i] = el as HTMLElement | null }"
          class="flip-card transition-all duration-700"
          :class="visibleCards[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
          style="height: 280px;"
        >
          <div class="flip-card-inner">
            <!-- Front: Project name + tags -->
            <div
              class="flip-card-front bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col justify-between p-6"
              :class="cardAccents[i % cardAccents.length].border"
            >
              <!-- Top gradient bar -->
              <div
                class="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r"
                :class="cardAccents[i % cardAccents.length].gradient"
              />

              <!-- Decorative corner glow -->
              <div
                class="absolute top-0 right-0 w-32 h-32 pointer-events-none rounded-tr-2xl"
                :style="`background: radial-gradient(circle at top right, ${cardAccents[i % cardAccents.length].glow}, transparent 70%);`"
              />

              <div>
                <h3 class="text-lg font-bold text-[var(--color-text)] mb-3 relative z-10">
                  {{ project.name }}
                </h3>

                <!-- Tech tags -->
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in project.tags"
                    :key="tag"
                    class="text-xs px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- Flip hint -->
              <div class="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] opacity-60">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                悬停翻转查看详情
              </div>
            </div>

            <!-- Back: Description + link -->
            <div
              class="flip-card-back bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col justify-between p-6"
              :class="cardAccents[i % cardAccents.length].border"
            >
              <!-- Top gradient bar -->
              <div
                class="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r"
                :class="cardAccents[i % cardAccents.length].gradient"
              />

              <div>
                <h3 class="text-base font-bold text-[var(--color-text)] mb-3">
                  {{ project.name }}
                </h3>
                <p class="text-[var(--color-text-muted)] text-sm leading-relaxed">
                  {{ project.description }}
                </p>
              </div>

              <a
                v-if="project.url"
                :href="project.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-sm font-medium text-orange-500 hover:text-orange-400 transition-all duration-300 hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded self-start"
              >
                查看项目
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <span v-else class="text-xs text-[var(--color-text-muted)] opacity-50">内部项目</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import projectsData from '../../data/projects.json'

const visibleCards = ref<boolean[]>(projectsData.projects.map(() => false))
const cardRefs = ref<(HTMLElement | null)[]>([])
let observers: IntersectionObserver[] = []

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
      <h2 class="text-3xl font-bold gradient-text mb-2">项目</h2>
      <div class="w-16 h-1 bg-gradient-to-r from-orange-500 to-yellow-400 rounded mb-10" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article
          v-for="(project, i) in projectsData.projects"
          :key="project.name"
          :ref="(el) => { cardRefs[i] = el as HTMLElement | null }"
          class="group bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] flex flex-col overflow-hidden card-hover transition-all duration-700"
          :class="[
            visibleCards[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
            'hover:border-orange-500/50 hover:shadow-[0_16px_40px_rgba(255,107,0,0.15)]'
          ]"
        >
          <!-- Gradient top border -->
          <div class="h-0.5 bg-gradient-to-r from-orange-500 to-yellow-400 w-full" />

          <div class="p-6 flex flex-col flex-1">
            <h3 class="text-lg font-bold text-[var(--color-text)] mb-2 group-hover:text-orange-500 transition-colors">
              {{ project.name }}
            </h3>
            <p class="text-[var(--color-text-muted)] text-sm leading-relaxed flex-1 mb-4">
              {{ project.description }}
            </p>

            <!-- Tech tags -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tag in project.tags"
                :key="tag"
                class="text-xs px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20"
              >
                {{ tag }}
              </span>
            </div>

            <a
              v-if="project.url"
              :href="project.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-sm font-medium text-orange-500 hover:text-orange-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
            >
              查看项目
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

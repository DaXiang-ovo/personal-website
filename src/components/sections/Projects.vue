<script setup lang="ts">
import projectsData from '../../data/projects.json'
</script>

<template>
  <section
    id="projects"
    class="py-20 px-4 bg-[var(--color-bg)]"
  >
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold text-[var(--color-text)] mb-2">项目</h2>
      <div class="w-16 h-1 bg-orange-500 rounded mb-10" />

      <!-- Grid: 1 col mobile, 2 col desktop -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article
          v-for="project in projectsData.projects"
          :key="project.name"
          class="group bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]
                 hover:-translate-y-1 hover:chakra-glow hover:border-orange-500/50
                 transition-all duration-300 flex flex-col"
        >
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
              class="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Link button (only if url is not null) -->
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
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import techData from '../../data/techstack.json'
</script>

<template>
  <section
    id="techstack"
    class="py-20 px-4 bg-[var(--color-bg-secondary)]"
  >
    <div class="max-w-6xl mx-auto">
      <!-- Section title with Naruto-style underline -->
      <h2 class="text-3xl font-bold text-[var(--color-text)] mb-2">技术栈</h2>
      <div class="flex items-center gap-2 mb-10">
        <div class="w-16 h-1 bg-orange-500 rounded" />
        <div class="w-4 h-1 bg-yellow-500 rounded" />
        <div class="w-2 h-1 bg-orange-300 rounded" />
      </div>

      <!-- Category grid: 1 col mobile, 2 col tablet, 4 col desktop -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="category in techData.categories"
          :key="category.name"
          class="bg-[var(--color-surface)] rounded-xl p-5 border border-[var(--color-border)] hover:border-orange-500/50 transition-colors"
        >
          <h3 class="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-4">
            {{ category.name }}
          </h3>
          <ul class="space-y-3">
            <li
              v-for="item in category.items"
              :key="item.name"
              class="flex items-center gap-3"
            >
              <img
                v-if="item.iconUrl"
                :src="item.iconUrl"
                :alt="`${item.name} icon`"
                class="w-6 h-6 object-contain flex-shrink-0"
              />
              <span
                v-else
                class="w-6 h-6 flex-shrink-0 rounded bg-orange-500/20 text-orange-500 text-xs flex items-center justify-center font-bold"
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

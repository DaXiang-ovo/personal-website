<script setup lang="ts">
import ChakraParticles from '../ui/ChakraParticles.vue'
import siteData from '../../data/site.json'

// Distinct colors for hobby tags
const hobbyColors: Record<string, string> = {
  'Minecraft': 'bg-green-700/80 text-green-100',
  '三角洲行动': 'bg-slate-600/80 text-slate-100',
  '火影忍者手游': 'bg-orange-600/80 text-orange-100',
  '坦克世界': 'bg-yellow-700/80 text-yellow-100',
  '英雄联盟': 'bg-blue-700/80 text-blue-100',
  '星际争霸2': 'bg-purple-700/80 text-purple-100',
  '陈奕迅': 'bg-pink-700/80 text-pink-100',
}

const defaultColor = 'bg-gray-600/80 text-gray-100'

function hobbyColor(hobby: string): string {
  return hobbyColors[hobby] ?? defaultColor
}

function scrollDown() {
  const el = document.getElementById('about')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section
    id="hero"
    class="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0D1B2A]"
  >
    <!-- Particle background -->
    <ChakraParticles />

    <!-- Content -->
    <div class="relative z-10 flex flex-col items-center text-center px-4 py-20">
      <!-- Avatar -->
      <div class="mb-6">
        <img
          v-if="siteData.avatarUrl"
          :src="siteData.avatarUrl"
          :alt="`${siteData.name} avatar`"
          class="w-28 h-28 rounded-full border-4 border-orange-500 object-cover shadow-lg"
        />
        <div
          v-else
          class="w-28 h-28 rounded-full border-4 border-orange-500 bg-orange-500/20 flex items-center justify-center shadow-lg"
          aria-label="Avatar placeholder"
        >
          <span class="text-3xl font-bold text-orange-400">{{ siteData.initials }}</span>
        </div>
      </div>

      <!-- Name -->
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">
        {{ siteData.name }}
      </h1>

      <!-- Role badge -->
      <span class="inline-block bg-orange-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4 shadow">
        {{ siteData.role }}
      </span>

      <!-- Tagline -->
      <p class="text-gray-300 text-lg sm:text-xl max-w-md mb-8 leading-relaxed">
        {{ siteData.tagline }}
      </p>

      <!-- Hobby tags -->
      <div class="flex flex-wrap justify-center gap-2 max-w-lg">
        <span
          v-for="hobby in siteData.hobbies"
          :key="hobby"
          class="text-xs font-medium px-3 py-1 rounded-full"
          :class="hobbyColor(hobby)"
        >
          {{ hobby }}
        </span>
      </div>
    </div>

    <!-- Scroll-down arrow -->
    <button
      @click="scrollDown"
      class="absolute bottom-8 left-1/2 -translate-x-1/2 text-orange-400 animate-bounce focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-full p-1"
      aria-label="Scroll to about section"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  </section>
</template>

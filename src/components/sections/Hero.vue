<script setup lang="ts">
import ChakraParticles from '../ui/ChakraParticles.vue'
import siteData from '../../data/site.json'
import { useTypingEffect } from '../../composables/useTypingEffect'

const { displayed: typedTagline } = useTypingEffect(
  [siteData.tagline, '热爱技术，热爱生活', '代码是忍者的修行之道'],
  75,
  2500
)

// Distinct colors for hobby tags (glassmorphism style)
const hobbyColors: Record<string, { border: string; text: string }> = {
  'Minecraft':    { border: 'border-l-green-500',  text: 'text-green-300' },
  '三角洲行动':   { border: 'border-l-slate-400',  text: 'text-slate-200' },
  '火影忍者手游': { border: 'border-l-orange-500', text: 'text-orange-300' },
  '坦克世界':     { border: 'border-l-yellow-500', text: 'text-yellow-300' },
  '英雄联盟':     { border: 'border-l-blue-500',   text: 'text-blue-300' },
  '星际争霸2':    { border: 'border-l-purple-500', text: 'text-purple-300' },
  '陈奕迅':       { border: 'border-l-pink-500',   text: 'text-pink-300' },
}

const defaultHobby = { border: 'border-l-gray-500', text: 'text-gray-300' }

function hobbyStyle(hobby: string) {
  return hobbyColors[hobby] ?? defaultHobby
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
    <!-- Radial gradient overlay -->
    <div
      class="absolute inset-0 pointer-events-none"
      style="background: radial-gradient(ellipse at center, rgba(13,27,42,0.4) 0%, rgba(13,27,42,0.85) 70%, rgba(13,27,42,0.98) 100%);"
    />

    <!-- Particle background -->
    <ChakraParticles />

    <!-- Content -->
    <div class="relative z-10 flex flex-col items-center text-center px-4 py-20">
      <!-- Avatar with pulsing ring -->
      <div class="mb-6 animate-fade-in-up" style="opacity:0;">
        <img
          v-if="siteData.avatarUrl"
          :src="siteData.avatarUrl"
          :alt="`${siteData.name} avatar`"
          class="w-28 h-28 rounded-full border-4 border-orange-500 object-cover shadow-lg pulse-ring"
        />
        <div
          v-else
          class="w-28 h-28 rounded-full border-4 border-orange-500 bg-orange-500/20 flex items-center justify-center shadow-lg pulse-ring"
          aria-label="Avatar placeholder"
        >
          <span class="text-3xl font-bold text-orange-400">{{ siteData.initials }}</span>
        </div>
      </div>

      <!-- Name -->
      <h1
        class="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight animate-fade-in-up delay-200"
        style="opacity:0;"
      >
        {{ siteData.name }}
      </h1>

      <!-- Role badge -->
      <span
        class="inline-block bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-sm font-semibold px-5 py-1.5 rounded-full mb-4 shadow-lg animate-fade-in-up delay-400"
        style="opacity:0;"
      >
        {{ siteData.role }}
      </span>

      <!-- Tagline with typing effect -->
      <p
        class="text-gray-300 text-lg sm:text-xl max-w-md mb-8 leading-relaxed min-h-[2em] animate-fade-in-up delay-500"
        style="opacity:0;"
      >
        {{ typedTagline }}<span class="animate-pulse text-orange-400">|</span>
      </p>

      <!-- Hobby tags (glassmorphism style) -->
      <div
        class="flex flex-wrap justify-center gap-2 max-w-lg animate-fade-in-up"
        style="opacity:0; animation-delay: 0.8s;"
      >
        <span
          v-for="hobby in siteData.hobbies"
          :key="hobby"
          class="text-xs font-medium px-3 py-1 rounded-full border-l-2 backdrop-blur-sm bg-white/5 border border-white/10"
          :class="[hobbyStyle(hobby).border, hobbyStyle(hobby).text]"
        >
          {{ hobby }}
        </span>
      </div>
    </div>

    <!-- Scroll-down arrow -->
    <button
      @click="scrollDown"
      class="absolute bottom-20 left-1/2 -translate-x-1/2 text-orange-400 animate-bounce focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-full p-1"
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

    <!-- Wave divider at bottom -->
    <div class="absolute bottom-0 left-0 right-0 pointer-events-none">
      <svg
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        class="w-full h-12 sm:h-16"
      >
        <path
          d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
          fill="var(--color-bg)"
        />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import ChakraParticles from '../ui/ChakraParticles.vue'
import siteData from '../../data/site.json'
import { useTypingEffect } from '../../composables/useTypingEffect'

const { displayed: typedTagline } = useTypingEffect(
  [siteData.tagline, '热爱技术，热爱生活', '代码是忍者的修行之道'],
  75,
  2500
)

// 专业技能标签
const skills = ['MaxCompute', 'Hologres', 'DataWorks', 'Spark', 'Python', 'SQL']

// 爱好分类
const hobbies = [
  { label: 'Minecraft',    color: 'border-green-500/60 bg-green-500/10 text-green-300',   icon: '⛏' },
  { label: '三角洲行动',   color: 'border-slate-400/60 bg-slate-500/10 text-slate-200',   icon: '🎖' },
  { label: '火影忍者手游', color: 'border-orange-500/60 bg-orange-500/10 text-orange-300', icon: '🍃' },
  { label: '坦克世界',     color: 'border-yellow-500/60 bg-yellow-500/10 text-yellow-300', icon: '🛡' },
  { label: '英雄联盟',     color: 'border-blue-500/60 bg-blue-500/10 text-blue-300',       icon: '⚔' },
  { label: '星际争霸2',    color: 'border-purple-500/60 bg-purple-500/10 text-purple-300', icon: '🚀' },
  { label: '陈奕迅',       color: 'border-pink-500/60 bg-pink-500/10 text-pink-300',       icon: '🎵' },
]

function scrollDown() {
  const el = document.getElementById('about')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section
    id="hero"
    class="relative min-h-screen flex items-center overflow-hidden bg-[#0D1B2A]"
  >
    <!-- Radial gradient overlay -->
    <div
      class="absolute inset-0 pointer-events-none"
      style="background: radial-gradient(ellipse at 30% 50%, rgba(255,107,0,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(255,215,0,0.04) 0%, transparent 60%), linear-gradient(to bottom, rgba(13,27,42,0.3) 0%, rgba(13,27,42,0.95) 100%);"
    />

    <!-- Particle background -->
    <ChakraParticles />

    <!-- Two-column layout -->
    <div class="relative z-10 w-full max-w-6xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

      <!-- ── LEFT: Professional Identity ── -->
      <div class="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left animate-fade-in-up" style="opacity:0;">

        <!-- Avatar -->
        <div class="mb-6">
          <div
            class="w-24 h-24 rounded-full border-4 border-orange-500 bg-orange-500/20 flex items-center justify-center shadow-lg pulse-ring"
            aria-label="Avatar"
          >
            <span class="text-2xl font-bold text-orange-400">{{ siteData.initials }}</span>
          </div>
        </div>

        <!-- Name -->
        <h1 class="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight animate-fade-in-up delay-100" style="opacity:0;">
          {{ siteData.name }}
        </h1>

        <!-- Role badge -->
        <span class="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-sm font-semibold px-5 py-2 rounded-full mb-5 shadow-lg animate-fade-in-up delay-200" style="opacity:0;">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
          </svg>
          {{ siteData.role }}
        </span>

        <!-- Typing tagline -->
        <p class="text-gray-300 text-lg max-w-sm mb-6 leading-relaxed min-h-[1.8em] animate-fade-in-up delay-300" style="opacity:0;">
          {{ typedTagline }}<span class="animate-pulse text-orange-400">|</span>
        </p>

        <!-- Tech skill pills -->
        <div class="flex flex-wrap justify-center lg:justify-start gap-2 animate-fade-in-up delay-400" style="opacity:0;">
          <span
            v-for="skill in skills"
            :key="skill"
            class="text-xs px-3 py-1 rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-300 font-medium"
          >
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- Vertical divider (desktop only) -->
      <div class="hidden lg:block w-px self-stretch bg-gradient-to-b from-transparent via-orange-500/30 to-transparent" />

      <!-- ── RIGHT: Hobbies ── -->
      <div class="flex-1 flex flex-col items-center lg:items-start animate-fade-in-up delay-300" style="opacity:0;">

        <h2 class="text-sm font-semibold uppercase tracking-widest text-orange-400/80 mb-5 flex items-center gap-2">
          <span class="w-6 h-px bg-orange-500/50" />
          兴趣爱好
          <span class="w-6 h-px bg-orange-500/50" />
        </h2>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 w-full">
          <div
            v-for="(hobby, i) in hobbies"
            :key="hobby.label"
            class="flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg animate-fade-in-up"
            :class="hobby.color"
            :style="`opacity:0; animation-delay:${0.4 + i * 0.08}s`"
          >
            <span class="text-xl flex-shrink-0">{{ hobby.icon }}</span>
            <span class="text-sm font-medium leading-tight">{{ hobby.label }}</span>
          </div>
        </div>

        <!-- Naruto quote -->
        <div class="mt-8 px-4 py-3 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 max-w-xs animate-fade-in-up delay-500" style="opacity:0;">
          <p class="text-yellow-300/70 text-xs italic leading-relaxed">
            "我不会逃跑，也不会退缩——这就是我的忍道。"
          </p>
          <p class="text-yellow-500/50 text-xs mt-1 text-right">— 漩涡鸣人</p>
        </div>
      </div>
    </div>

    <!-- Scroll-down arrow -->
    <button
      @click="scrollDown"
      class="absolute bottom-8 left-1/2 -translate-x-1/2 text-orange-400 animate-bounce focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-full p-1"
      aria-label="Scroll to about section"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Wave divider -->
    <div class="absolute bottom-0 left-0 right-0 pointer-events-none">
      <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" class="w-full h-12 sm:h-16">
        <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="var(--color-bg)" />
      </svg>
    </div>
  </section>
</template>

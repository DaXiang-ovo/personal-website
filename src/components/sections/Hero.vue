<script setup lang="ts">
import ChakraParticles from '../ui/ChakraParticles.vue'
import siteData from '../../data/site.json'
import { useTypingEffect } from '../../composables/useTypingEffect'

const { displayed: typedTagline } = useTypingEffect(
  [siteData.tagline, '热爱技术，热爱生活', '代码是忍者的修行之道'],
  75,
  2500
)

const skills = ['MaxCompute', 'Hologres', 'DataWorks', 'Spark', 'Python', 'SQL']

const hobbies = [
  {
    label: 'Minecraft',
    color: 'border-green-500/60 bg-green-500/10 text-green-300',
    iconUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/22/d9/2d/22d92dca-ecec-60da-a0fc-df0d35040447/AppIcon-0-0-1x_U007emarketing-0-10-0-85-220.png/64x64bb.jpg',
    iconFallback: '⛏',
  },
  {
    label: '三角洲行动',
    color: 'border-slate-400/60 bg-slate-500/10 text-slate-200',
    iconUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/2507950/capsule_sm_120.jpg',
    iconFallback: '🎖',
  },
  {
    label: '火影忍者手游',
    color: 'border-orange-500/60 bg-orange-500/10 text-orange-300',
    iconUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/28/5c/3e/285c3e1a-c678-24fb-a6e2-d82ff05f985f/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/64x64bb.jpg',
    iconFallback: '🍃',
  },
  {
    label: '坦克世界',
    color: 'border-yellow-500/60 bg-yellow-500/10 text-yellow-300',
    iconUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/1407200/capsule_sm_120.jpg',
    iconFallback: '🛡',
  },
  {
    label: '英雄联盟',
    color: 'border-blue-500/60 bg-blue-500/10 text-blue-300',
    iconUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/ea/58/99/ea5899e0-cdc5-b3e0-c5b2-0b2a4dde4b57/AppIcon-0-0-1x_U007emarketing-0-8-0-0-85-220.png/64x64bb.jpg',
    iconFallback: '⚔',
  },
  {
    label: '星际争霸2',
    color: 'border-purple-500/60 bg-purple-500/10 text-purple-300',
    iconUrl: 'https://bnetcmsus-a.akamaihd.net/cms/gallery/D2TTHKAPW9BH1534981363136.png',
    iconFallback: '🚀',
  },
  {
    label: '陈奕迅',
    color: 'border-pink-500/60 bg-pink-500/10 text-pink-300',
    iconUrl: null,
    iconFallback: '🎵',
  },
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
      style="background: radial-gradient(ellipse at 30% 50%, rgba(255,107,0,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(255,215,0,0.05) 0%, transparent 60%), linear-gradient(to bottom, rgba(13,27,42,0.3) 0%, rgba(13,27,42,0.95) 100%);"
    />

    <!-- Particle background -->
    <ChakraParticles />

    <!-- Two-column layout -->
    <div class="relative z-10 w-full max-w-6xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

      <!-- LEFT: Professional Identity -->
      <div class="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left animate-fade-in-up" style="opacity:0;">

        <!-- Avatar with glow ring -->
        <div class="mb-6">
          <div
            class="w-24 h-24 rounded-full border-4 border-orange-500 bg-orange-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,107,0,0.4)] pulse-ring relative"
            aria-label="Avatar"
          >
            <span class="text-2xl font-bold text-orange-400">{{ siteData.initials }}</span>
            <!-- Outer rotating ring -->
            <div class="absolute inset-[-6px] rounded-full border-2 border-dashed border-orange-500/30 animate-[slow-rotate_20s_linear_infinite]" style="animation: spin 20s linear infinite;" />
          </div>
        </div>

        <!-- Name -->
        <h1 class="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight animate-fade-in-up delay-100" style="opacity:0;">
          {{ siteData.name }}
        </h1>

        <!-- Role badge with gradient -->
        <span class="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-sm font-semibold px-5 py-2 rounded-full mb-5 shadow-[0_4px_20px_rgba(255,107,0,0.4)] animate-fade-in-up delay-200 transition-transform duration-300 hover:scale-105" style="opacity:0;">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
          </svg>
          {{ siteData.role }}
        </span>

        <!-- Typing tagline -->
        <p class="text-gray-300 text-lg max-w-sm mb-6 leading-relaxed min-h-[1.8em] animate-fade-in-up delay-300" style="opacity:0;">
          {{ typedTagline }}<span class="animate-pulse text-orange-400">|</span>
        </p>

        <!-- Tech skill pills with gradient border -->
        <div class="flex flex-wrap justify-center lg:justify-start gap-2 animate-fade-in-up delay-400" style="opacity:0;">
          <span
            v-for="skill in skills"
            :key="skill"
            class="text-xs px-3 py-1 rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-300 font-medium transition-all duration-300 hover:border-orange-400 hover:bg-orange-500/20 hover:scale-105 cursor-default"
          >
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- Vertical divider (desktop only) -->
      <div class="hidden lg:block w-px self-stretch bg-gradient-to-b from-transparent via-orange-500/30 to-transparent" />

      <!-- RIGHT: Hobbies -->
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
            class="group flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:scale-[1.03] cursor-default animate-fade-in-up shine-effect"
            :class="hobby.color"
            :style="`opacity:0; animation-delay:${0.4 + i * 0.08}s`"
          >
            <img
              v-if="hobby.iconUrl"
              :src="hobby.iconUrl"
              :alt="hobby.label"
              class="w-6 h-6 object-contain flex-shrink-0 rounded transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6"
              @error="($event.target as HTMLImageElement).style.display='none'"
            />
            <span v-else class="text-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-125">{{ hobby.iconFallback }}</span>
            <span class="text-sm font-medium leading-tight">{{ hobby.label }}</span>
          </div>
        </div>

        <!-- Naruto quote -->
        <div class="mt-8 px-4 py-3 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 max-w-xs animate-fade-in-up delay-500 transition-all duration-300 hover:border-yellow-500/40 hover:bg-yellow-500/10" style="opacity:0;">
          <p class="text-yellow-300/70 text-xs italic leading-relaxed">
            "我不会逃跑，也不会退缩——这就是我的忍道。"
          </p>
          <p class="text-yellow-500/50 text-xs mt-1 text-right">— 漩涡鸣人</p>
        </div>
      </div>
    </div>

    <!-- Scroll-down arrow with float animation -->
    <button
      @click="scrollDown"
      class="absolute bottom-8 left-1/2 -translate-x-1/2 text-orange-400 animate-float focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-full p-1"
      aria-label="Scroll to about section"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Animated wave divider -->
    <div class="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden">
      <svg class="wave-svg" viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path class="wave-path wave-1" d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="var(--color-bg)" opacity="0.5" />
        <path class="wave-path wave-2" d="M0,50 C360,80 720,20 1080,50 C1260,65 1350,35 1440,50 L1440,80 L0,80 Z" fill="var(--color-bg)" opacity="0.7" />
        <path class="wave-path wave-3" d="M0,55 C180,70 540,40 720,55 C900,70 1260,40 1440,55 L1440,80 L0,80 Z" fill="var(--color-bg)" />
      </svg>
    </div>
  </section>
</template>

<style scoped>
.wave-svg {
  width: 100%;
  height: 60px;
  display: block;
}

@media (min-width: 640px) {
  .wave-svg { height: 80px; }
}

.wave-path {
  animation: wave-drift linear infinite;
}

.wave-1 {
  animation-duration: 8s;
  animation-direction: alternate;
}

.wave-2 {
  animation-duration: 6s;
  animation-direction: alternate-reverse;
}

.wave-3 {
  animation-duration: 10s;
  animation-direction: alternate;
}

@keyframes wave-drift {
  0% { d: path("M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"); }
  50% { d: path("M0,50 C300,20 600,70 720,35 C840,0 1100,70 1440,45 L1440,80 L0,80 Z"); }
  100% { d: path("M0,35 C200,70 500,10 720,45 C940,80 1200,15 1440,50 L1440,80 L0,80 Z"); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

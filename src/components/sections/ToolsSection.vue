<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'

const tools = [
  {
    title: 'Minecraft Tracker',
    route: '/tools/minecraft',
    iconUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/22/d9/2d/22d92dca-ecec-60da-a0fc-df0d35040447/AppIcon-0-0-1x_U007emarketing-0-10-0-85-220.png/100x100bb.jpg',
    iconFallback: '⛏',
    desc: '查看 Minecraft 最新版本更新',
    border: 'hover:border-green-500/60',
    shadow: 'hover:shadow-green-500/15',
    accent: 'bg-green-500/20',
  },
  {
    title: '陈奕迅音乐播放器',
    route: '/tools/music',
    iconUrl: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/music-note-beamed.svg',
    iconFallback: '🎵',
    desc: '陈奕迅歌曲播放器',
    border: 'hover:border-pink-500/60',
    shadow: 'hover:shadow-pink-500/15',
    accent: 'bg-pink-500/20',
  },
  {
    title: '三角洲行动',
    route: '/tools/deltaforce',
    iconUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/2507950/capsule_sm_120.jpg',
    iconFallback: '🎖️',
    desc: '个人战绩展示',
    border: 'hover:border-slate-400/60',
    shadow: 'hover:shadow-slate-400/15',
    accent: 'bg-slate-500/20',
  },
  {
    title: '火影忍者手游',
    route: '/tools/naruto',
    iconUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/28/5c/3e/285c3e1a-c678-24fb-a6e2-d82ff05f985f/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/100x100bb.jpg',
    iconFallback: '🍃',
    desc: '战绩与战力展示',
    border: 'hover:border-orange-500/60',
    shadow: 'hover:shadow-orange-500/15',
    accent: 'bg-orange-500/20',
  },
  {
    title: '坦克世界欧服',
    route: '/tools/wot',
    iconUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/1407200/capsule_sm_120.jpg',
    iconFallback: '🛡️',
    desc: '欧服战绩查询',
    border: 'hover:border-yellow-500/60',
    shadow: 'hover:shadow-yellow-500/15',
    accent: 'bg-yellow-500/20',
  },
]

const visibleCards = ref<boolean[]>(tools.map(() => false))
const wrapperRefs = ref<(HTMLElement | null)[]>([])
let observers: IntersectionObserver[] = []

onMounted(() => {
  wrapperRefs.value.forEach((el, i) => {
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
    id="tools"
    class="py-20 px-4 bg-[var(--color-bg)]"
  >
    <div class="max-w-5xl mx-auto">
      <h2 class="text-3xl font-bold gradient-text mb-2">工具</h2>
      <div class="w-16 h-1 bg-gradient-to-r from-orange-500 to-yellow-400 rounded mb-10" />

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="(tool, i) in tools"
          :key="tool.route"
          :ref="(el) => { wrapperRefs[i] = el as HTMLElement | null }"
          class="transition-all duration-700"
          :class="visibleCards[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        >
          <RouterLink
            :to="tool.route"
            class="group flex items-start gap-4 bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] card-hover transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 block"
            :class="[tool.border, `hover:shadow-lg ${tool.shadow}`]"
          >
            <!-- Icon: image or emoji fallback -->
            <div
              class="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-110"
              :class="tool.accent"
            >
              <img
                v-if="tool.iconUrl"
                :src="tool.iconUrl"
                :alt="tool.title"
                class="w-10 h-10 object-cover rounded-xl"
                @error="($event.target as HTMLImageElement).style.display='none'"
              />
              <span v-else class="text-3xl">{{ tool.iconFallback }}</span>
            </div>
            <div>
              <h3 class="font-semibold text-[var(--color-text)] group-hover:text-orange-500 transition-colors mb-1">
                {{ tool.title }}
              </h3>
              <p class="text-sm text-[var(--color-text-muted)]">{{ tool.desc }}</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

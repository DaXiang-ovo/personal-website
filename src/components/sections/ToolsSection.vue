<script setup lang="ts">
import { RouterLink } from 'vue-router'

const tools = [
  {
    title: 'Minecraft Tracker',
    route: '/tools/minecraft',
    icon: '🟫',
    desc: '查看 Minecraft 最新版本更新',
  },
  {
    title: '陈奕迅音乐播放器',
    route: '/tools/music',
    icon: '🎵',
    desc: '陈奕迅歌曲播放器',
  },
  {
    title: '三角洲行动',
    route: '/tools/deltaforce',
    icon: '🎖️',
    desc: '个人战绩展示',
  },
  {
    title: '火影忍者手游',
    route: '/tools/naruto',
    icon: '🍃',
    desc: '战绩与战力展示',
  },
  {
    title: '坦克世界欧服',
    route: '/tools/wot',
    icon: '🛡️',
    desc: '欧服战绩查询',
  },
]
</script>

<template>
  <section
    id="tools"
    class="py-20 px-4 bg-[var(--color-bg)]"
  >
    <div class="max-w-5xl mx-auto">
      <h2 class="text-3xl font-bold text-[var(--color-text)] mb-2">工具</h2>
      <div class="w-16 h-1 bg-orange-500 rounded mb-10" />

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <RouterLink
          v-for="tool in tools"
          :key="tool.route"
          :to="tool.route"
          class="group flex items-start gap-4 bg-[var(--color-surface)] rounded-xl p-5 border border-[var(--color-border)]
                 hover:border-orange-500/60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/10
                 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          <span class="text-3xl flex-shrink-0 mt-0.5" aria-hidden="true">{{ tool.icon }}</span>
          <div>
            <h3 class="font-semibold text-[var(--color-text)] group-hover:text-orange-500 transition-colors mb-1">
              {{ tool.title }}
            </h3>
            <p class="text-sm text-[var(--color-text-muted)]">{{ tool.desc }}</p>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

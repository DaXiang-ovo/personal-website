<script setup lang="ts">
import { RouterLink } from 'vue-router'
import deltaforceData from '../../data/deltaforce.json'
import ErrorBoundary from '../../components/ui/ErrorBoundary.vue'

const data = deltaforceData

function formatDate(iso: string): string {
  return iso.split('T')[0]
}

function pct(v: number): string {
  return (v * 100).toFixed(1) + '%'
}
</script>

<template>
  <ErrorBoundary>
  <div class="df-page min-h-screen" style="background:#0A0F0A;">
    <!-- Camo border top -->
    <div class="camo-stripe"></div>

    <!-- Back button -->
    <div class="p-4">
      <RouterLink to="/" class="inline-flex items-center gap-2 px-3 py-1 border border-[#00FF41]/40 text-[#00FF41] hover:bg-[#00FF41]/10 transition-colors text-sm font-mono">
        ← 返回主页
      </RouterLink>
    </div>

    <div class="max-w-3xl mx-auto px-4 pb-12">
      <!-- Title -->
      <h1 class="text-center mb-2 font-mono text-2xl tracking-widest" style="color:#00FF41; text-shadow:0 0 10px #00FF41;">
        ▣ 三角洲行动 · 战绩
      </h1>
      <p class="text-center mb-8 font-mono text-xs" style="color:#00FF41/60; color:rgba(0,255,65,0.5);">
        数据更新于 {{ formatDate(data.lastUpdated) }}
      </p>

      <!-- Stats grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div class="hud-box">
          <div class="hud-label">KDR</div>
          <div class="hud-value">{{ data.stats.kdr.toFixed(2) }}</div>
        </div>
        <div class="hud-box">
          <div class="hud-label">胜率</div>
          <div class="hud-value">{{ pct(data.stats.winRate) }}</div>
        </div>
        <div class="hud-box">
          <div class="hud-label">总场次</div>
          <div class="hud-value">{{ data.stats.totalMatches }}</div>
        </div>
        <div class="hud-box">
          <div class="hud-label">段位</div>
          <div class="hud-value text-base">{{ data.stats.rankTier }}</div>
        </div>
      </div>

      <!-- Screenshots -->
      <div v-if="data.screenshots && data.screenshots.length > 0" class="mb-8">
        <h2 class="font-mono text-sm mb-3" style="color:#00FF41;">[ 截图记录 ]</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <img
            v-for="(src, i) in data.screenshots"
            :key="i"
            :src="src"
            :alt="`截图 ${i + 1}`"
            class="w-full rounded border border-[#00FF41]/30 object-cover"
            style="max-height:200px;"
          />
        </div>
      </div>

      <!-- Dynamic query section (locked) -->
      <div class="locked-card p-5 flex items-start gap-4">
        <div class="text-2xl mt-1">🔒</div>
        <div>
          <h2 class="font-mono text-sm mb-1" style="color:#888;">动态查询（待探索）</h2>
          <p class="font-mono text-xs" style="color:#555;">
            暂无稳定官方 API，动态查询功能开发中
          </p>
        </div>
      </div>
    </div>

    <div class="camo-stripe"></div>
  </div>
  </ErrorBoundary>
</template>

<style scoped>
.df-page {
  font-family: 'Courier New', monospace;
}

/* Camouflage stripe */
.camo-stripe {
  height: 8px;
  background: repeating-linear-gradient(
    90deg,
    #1A2A1A 0px,
    #1A2A1A 20px,
    #2A3A1A 20px,
    #2A3A1A 40px,
    #0A1A0A 40px,
    #0A1A0A 60px,
    #3A4A2A 60px,
    #3A4A2A 80px
  );
}

/* HUD stat box */
.hud-box {
  background: #0F1A0F;
  border: 1px solid #00FF41;
  padding: 16px 12px;
  text-align: center;
  box-shadow: 0 0 8px rgba(0, 255, 65, 0.15), inset 0 0 8px rgba(0, 255, 65, 0.05);
}
.hud-label {
  font-size: 11px;
  color: rgba(0, 255, 65, 0.6);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 8px;
}
.hud-value {
  font-size: 1.6rem;
  font-weight: bold;
  color: #00FF41;
  text-shadow: 0 0 8px #00FF41;
}

/* Locked card */
.locked-card {
  background: #0F1A0F;
  border: 1px dashed #333;
  border-radius: 4px;
  opacity: 0.7;
}
</style>

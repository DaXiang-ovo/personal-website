<script setup lang="ts">
import { RouterLink } from 'vue-router'
import narutoData from '../../data/naruto-mobile.json'
import ErrorBoundary from '../../components/ui/ErrorBoundary.vue'

const data = narutoData

function formatDate(iso: string): string {
  return iso.split('T')[0]
}

function pct(v: number): string {
  return (v * 100).toFixed(1) + '%'
}

// Chakra bar width capped at 100%
function barWidth(value: number, max: number): string {
  return Math.min(100, (value / max) * 100).toFixed(1) + '%'
}
</script>

<template>
  <ErrorBoundary>
  <div class="naruto-page min-h-screen relative overflow-hidden" style="background:#0D1B2A;">
    <!-- 忍 watermark -->
    <div class="watermark" aria-hidden="true">忍</div>

    <!-- Back button -->
    <div class="p-4 relative z-10">
      <RouterLink to="/" class="inline-flex items-center gap-2 px-3 py-1 border border-[#FF6B00]/50 text-[#FF6B00] hover:bg-[#FF6B00]/10 transition-colors text-sm">
        ← 返回主页
      </RouterLink>
    </div>

    <div class="max-w-3xl mx-auto px-4 pb-12 relative z-10">
      <!-- Title -->
      <h1 class="text-center mb-2 text-2xl font-bold tracking-widest" style="color:#FF6B00; text-shadow:0 0 12px rgba(255,107,0,0.5);">
        🍥 火影忍者手游 · 战绩
      </h1>
      <p class="text-center mb-8 text-xs" style="color:rgba(255,107,0,0.6);">
        数据更新于 {{ formatDate(data.lastUpdated) }}
      </p>

      <!-- Stats cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div class="scroll-card p-4 text-center">
          <div class="stat-label">胜率</div>
          <div class="stat-value">{{ pct(data.stats.winRate) }}</div>
        </div>
        <div class="scroll-card p-4 text-center">
          <div class="stat-label">总场次</div>
          <div class="stat-value">{{ data.stats.totalBattles }}</div>
        </div>
        <div class="scroll-card p-4 text-center">
          <div class="stat-label">战力</div>
          <div class="stat-value text-base">{{ data.stats.combatPower.toLocaleString() }}</div>
        </div>
        <div class="scroll-card p-4 text-center">
          <div class="stat-label">段位</div>
          <div class="stat-value text-base">{{ data.stats.rankTier }}</div>
        </div>
      </div>

      <!-- Chakra stat bars -->
      <div class="scroll-card p-5 mb-6">
        <h2 class="text-sm font-semibold mb-4" style="color:#FFD700;">查克拉指标</h2>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between text-xs mb-1" style="color:#A0A8B0;">
              <span>胜率</span><span>{{ pct(data.stats.winRate) }}</span>
            </div>
            <div class="chakra-bar-bg">
              <div class="chakra-bar-fill" :style="{ width: barWidth(data.stats.winRate, 1) }"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-xs mb-1" style="color:#A0A8B0;">
              <span>战力</span><span>{{ data.stats.combatPower.toLocaleString() }}</span>
            </div>
            <div class="chakra-bar-bg">
              <div class="chakra-bar-fill" :style="{ width: barWidth(data.stats.combatPower, 1000000) }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main characters -->
      <div class="scroll-card p-5 mb-6">
        <h2 class="text-sm font-semibold mb-3" style="color:#FFD700;">主用角色</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="char in data.stats.mainCharacters"
            :key="char"
            class="char-tag"
          >{{ char }}</span>
        </div>
      </div>

      <!-- Dynamic query section (locked) -->
      <div class="locked-card p-5 flex items-start gap-4">
        <div class="text-2xl mt-1">🔒</div>
        <div>
          <h2 class="text-sm mb-1 font-semibold" style="color:#555;">动态查询（待探索）</h2>
          <p class="text-xs" style="color:#444;">
            暂无稳定官方 API，动态查询功能开发中
          </p>
        </div>
      </div>
    </div>
  </div>
  </ErrorBoundary>
</template>

<style scoped>
.naruto-page {
  font-family: 'Inter', system-ui, sans-serif;
}

/* 忍 watermark */
.watermark {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 40vw;
  font-weight: 900;
  color: rgba(255, 107, 0, 0.03);
  pointer-events: none;
  user-select: none;
  z-index: 0;
}

/* Scroll-border card */
.scroll-card {
  background: rgba(13, 27, 42, 0.8);
  border: 2px solid #FFD700;
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.2);
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 215, 0, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 6px;
}
.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #FF6B00;
}

/* Chakra bars */
.chakra-bar-bg {
  height: 8px;
  background: rgba(255, 107, 0, 0.15);
  border-radius: 4px;
  overflow: hidden;
}
.chakra-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF6B00, #FFD700);
  border-radius: 4px;
  transition: width 0.6s ease;
}

/* Character tags */
.char-tag {
  background: rgba(255, 107, 0, 0.15);
  border: 1px solid #FF6B00;
  color: #FF8C38;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
}

/* Locked card */
.locked-card {
  background: rgba(13, 27, 42, 0.5);
  border: 1px dashed #2A3F55;
  border-radius: 4px;
  opacity: 0.7;
}
</style>

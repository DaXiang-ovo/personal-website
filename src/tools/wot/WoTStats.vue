<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { searchPlayer, type WoTPlayerStats } from '../../composables/useWargamingApi'
import wotConfig from '../../data/wot-config.json'
import ErrorBoundary from '../../components/ui/ErrorBoundary.vue'

const username = ref(wotConfig.defaultPlayer)
const loading = ref(false)
const playerData = ref<WoTPlayerStats | null>(null)
const errorMsg = ref<string | null>(null)
const notFound = ref(false)

function wn8Color(wn8: number): string {
  if (wn8 < 300) return '#CD3333'
  if (wn8 < 900) return '#CD7700'
  if (wn8 < 1650) return '#CCB800'
  if (wn8 < 2450) return '#4D7326'
  if (wn8 < 3000) return '#4099BF'
  return '#B24CCC'
}

function wn8Label(wn8: number): string {
  if (wn8 < 300) return '很差'
  if (wn8 < 900) return '较差'
  if (wn8 < 1650) return '平均'
  if (wn8 < 2450) return '良好'
  if (wn8 < 3000) return '优秀'
  return '超神'
}

function pct(v: number): string {
  return (v * 100).toFixed(1) + '%'
}

async function doSearch() {
  if (!username.value.trim()) return
  loading.value = true
  errorMsg.value = null
  notFound.value = false
  playerData.value = null

  try {
    playerData.value = await searchPlayer(username.value.trim())
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'notFound' in e) {
      notFound.value = true
    } else {
      errorMsg.value = e instanceof Error ? e.message : '请求失败'
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  doSearch()
})
</script>

<template>
  <ErrorBoundary>
  <div class="wot-page min-h-screen" style="background:#1A1A1A;">
    <!-- Tank silhouette decoration -->
    <div class="tank-deco" aria-hidden="true">
      <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="200" height="80">
        <rect x="20" y="40" width="160" height="30" rx="4" fill="#2A2A2A"/>
        <rect x="50" y="20" width="90" height="30" rx="3" fill="#2A2A2A"/>
        <rect x="80" y="10" width="60" height="15" rx="2" fill="#2A2A2A"/>
        <rect x="130" y="12" width="50" height="6" rx="3" fill="#333"/>
        <circle cx="40" cy="72" r="10" fill="#333"/>
        <circle cx="80" cy="72" r="10" fill="#333"/>
        <circle cx="120" cy="72" r="10" fill="#333"/>
        <circle cx="160" cy="72" r="10" fill="#333"/>
      </svg>
    </div>

    <!-- Back button -->
    <div class="p-4 relative z-10">
      <RouterLink to="/" class="inline-flex items-center gap-2 px-3 py-1 border border-[#555] text-[#AAA] hover:bg-[#2A2A2A] transition-colors text-sm font-mono">
        ← 返回主页
      </RouterLink>
    </div>

    <div class="max-w-3xl mx-auto px-4 pb-12 relative z-10">
      <!-- Title -->
      <h1 class="text-center mb-6 font-mono text-2xl tracking-widest" style="color:#C0C0C0; text-shadow:0 0 8px rgba(192,192,192,0.3);">
        🛡 坦克世界 · 欧服战绩
      </h1>

      <!-- Search bar -->
      <div class="flex gap-2 mb-8">
        <input
          v-model="username"
          type="text"
          placeholder="输入欧服玩家名..."
          class="search-input flex-1 px-4 py-2 font-mono text-sm"
          @keyup.enter="doSearch"
        />
        <button @click="doSearch" class="search-btn px-5 py-2 font-mono text-sm">
          搜索
        </button>
      </div>

      <!-- Loading: tank tracks spinner -->
      <div v-if="loading" class="flex flex-col items-center gap-4 py-16">
        <div class="tracks-spinner">
          <div class="track-block" v-for="i in 5" :key="i" :style="{ animationDelay: `${(i-1)*0.15}s` }"></div>
        </div>
        <p class="font-mono text-sm" style="color:#666;">正在搜索玩家数据...</p>
      </div>

      <!-- Not found -->
      <div v-else-if="notFound" class="text-center py-12">
        <p class="font-mono text-lg mb-4" style="color:#CD3333;">⚠ 玩家 "{{ username }}" 未找到</p>
        <p class="font-mono text-sm" style="color:#666;">请检查玩家名是否正确（欧服）</p>
      </div>

      <!-- API error -->
      <div v-else-if="errorMsg" class="text-center py-12">
        <p class="font-mono mb-4" style="color:#CD3333;">⚠ 请求失败：{{ errorMsg }}</p>
        <button @click="doSearch" class="search-btn px-5 py-2 font-mono text-sm">重试</button>
      </div>

      <!-- Player data -->
      <div v-else-if="playerData">
        <!-- Player header -->
        <div class="steel-card p-5 mb-6">
          <div class="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 class="font-mono text-xl" style="color:#E0E0E0;">{{ playerData.nickname }}</h2>
              <p class="font-mono text-xs mt-1" style="color:#666;">ID: {{ playerData.account_id }}</p>
            </div>
            <div class="text-right">
              <div class="font-mono text-2xl font-bold" :style="{ color: wn8Color(playerData.wn8) }">
                {{ Math.round(playerData.wn8) }}
              </div>
              <div class="font-mono text-xs" :style="{ color: wn8Color(playerData.wn8) }">
                WN8 · {{ wn8Label(playerData.wn8) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Overall stats -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div class="stat-box">
            <div class="stat-label">总场次</div>
            <div class="stat-val">{{ playerData.battles.toLocaleString() }}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">胜率</div>
            <div class="stat-val">{{ pct(playerData.winRate) }}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">平均伤害</div>
            <div class="stat-val">{{ Math.round(playerData.avgDamage).toLocaleString() }}</div>
          </div>
        </div>

        <!-- Top vehicles table -->
        <div v-if="playerData.vehicles.length > 0" class="steel-card overflow-hidden">
          <h2 class="font-mono text-sm px-4 py-3 border-b border-[#333]" style="color:#C0C0C0;">
            Top 10 车辆
          </h2>
          <div class="overflow-x-auto">
            <table class="w-full font-mono text-sm">
              <thead>
                <tr style="background:#222;">
                  <th class="px-4 py-2 text-left" style="color:#888;">车辆名</th>
                  <th class="px-4 py-2 text-right" style="color:#888;">场次</th>
                  <th class="px-4 py-2 text-right" style="color:#888;">胜率</th>
                  <th class="px-4 py-2 text-right" style="color:#888;">平均伤害</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="v in playerData.vehicles"
                  :key="v.tank_id"
                  class="border-t border-[#2A2A2A] hover:bg-[#222] transition-colors"
                >
                  <td class="px-4 py-2" style="color:#C0C0C0;">{{ v.name }}</td>
                  <td class="px-4 py-2 text-right" style="color:#A0A0A0;">{{ v.battles }}</td>
                  <td class="px-4 py-2 text-right" style="color:#A0A0A0;">{{ pct(v.battles > 0 ? v.wins / v.battles : 0) }}</td>
                  <td class="px-4 py-2 text-right" style="color:#A0A0A0;">{{ v.battles > 0 ? Math.round(v.damage_dealt / v.battles).toLocaleString() : '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  </ErrorBoundary>
</template>

<style scoped>
.wot-page {
  font-family: 'Inter', system-ui, sans-serif;
}

.tank-deco {
  position: fixed;
  bottom: 20px;
  right: 20px;
  opacity: 0.08;
  pointer-events: none;
  z-index: 0;
}

.search-input {
  background: #111;
  border: 1px solid #444;
  color: #E0E0E0;
  border-radius: 4px;
  outline: none;
}
.search-input:focus {
  border-color: #888;
}
.search-input::placeholder {
  color: #555;
}

.search-btn {
  background: #333;
  border: 1px solid #555;
  color: #C0C0C0;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s;
}
.search-btn:hover {
  background: #444;
  color: #E0E0E0;
}

/* Tank tracks spinner */
.tracks-spinner {
  display: flex;
  gap: 6px;
  align-items: flex-end;
}
.track-block {
  width: 12px;
  height: 12px;
  background: #555;
  border-radius: 2px;
  animation: track-bounce 0.8s ease-in-out infinite alternate;
}
@keyframes track-bounce {
  from { transform: translateY(0); background: #555; }
  to   { transform: translateY(-12px); background: #888; }
}

/* Steel card */
.steel-card {
  background: #222;
  border: 1px solid #3A3A3A;
  border-radius: 4px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
}

/* Stat box */
.stat-box {
  background: #222;
  border: 1px solid #3A3A3A;
  padding: 16px 12px;
  text-align: center;
  border-radius: 4px;
}
.stat-label {
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 6px;
  font-family: 'Courier New', monospace;
}
.stat-val {
  font-size: 1.4rem;
  font-weight: bold;
  color: #C0C0C0;
  font-family: 'Courier New', monospace;
}
</style>

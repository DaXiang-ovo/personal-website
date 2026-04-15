<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { RouterLink } from "vue-router"
import { searchPlayer, type WoTPlayerStats, type VehicleStat } from "../../composables/useWargamingApi"
import wotConfig from "../../data/wot-config.json"
import ErrorBoundary from "../../components/ui/ErrorBoundary.vue"

const username = ref(wotConfig.defaultPlayer)
const loading = ref(false)
const playerData = ref<WoTPlayerStats | null>(null)
const errorMsg = ref<string | null>(null)
const notFound = ref(false)
const activeTab = ref<"vehicles" | "overview">("vehicles")

function wn8Color(wn8: number): string {
  if (wn8 < 300) return "#CD3333"
  if (wn8 < 900) return "#CD7700"
  if (wn8 < 1650) return "#CCB800"
  if (wn8 < 2450) return "#4D7326"
  if (wn8 < 3000) return "#4099BF"
  return "#B24CCC"
}

function wn8Label(wn8: number): string {
  if (wn8 < 300) return "很差"
  if (wn8 < 900) return "较差"
  if (wn8 < 1650) return "平均"
  if (wn8 < 2450) return "良好"
  if (wn8 < 3000) return "优秀"
  return "超神"
}

function pct(v: number): string {
  return (v * 100).toFixed(1) + "%"
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
    if (e && typeof e === "object" && "notFound" in e) {
      notFound.value = true
    } else {
      errorMsg.value = e instanceof Error ? e.message : "请求失败"
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => { doSearch() })
</script>

<template>
  <ErrorBoundary>
  <div class="wot-page min-h-screen">

    <!-- WoT hero banner -->
    <div class="wot-banner relative overflow-hidden">
      <div class="wot-banner-overlay" />
      <div class="relative z-10 p-4 flex items-center justify-between">
        <RouterLink to="/" class="inline-flex items-center gap-2 px-3 py-1 border border-[#555] text-[#AAA] hover:bg-[#2A2A2A] transition-colors text-sm font-mono rounded">
          ← 返回主页
        </RouterLink>
        <h1 class="font-mono text-lg tracking-widest" style="color:#C0C0C0;">🛡 坦克世界 · 欧服</h1>
        <div class="w-24" />
      </div>
      <!-- Tank silhouette SVG -->
      <div class="flex justify-center pb-6 relative z-10">
        <svg viewBox="0 0 320 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="320" height="100" opacity="0.6">
          <rect x="30" y="55" width="260" height="35" rx="6" fill="#2A2A2A" stroke="#444" stroke-width="1"/>
          <rect x="70" y="28" width="160" height="38" rx="5" fill="#333" stroke="#444" stroke-width="1"/>
          <rect x="110" y="12" width="90" height="22" rx="4" fill="#2A2A2A" stroke="#444" stroke-width="1"/>
          <rect x="190" y="15" width="80" height="8" rx="4" fill="#3A3A3A" stroke="#555" stroke-width="1"/>
          <circle cx="60" cy="90" r="12" fill="#222" stroke="#555" stroke-width="2"/>
          <circle cx="60" cy="90" r="6" fill="#333"/>
          <circle cx="110" cy="90" r="12" fill="#222" stroke="#555" stroke-width="2"/>
          <circle cx="110" cy="90" r="6" fill="#333"/>
          <circle cx="160" cy="90" r="12" fill="#222" stroke="#555" stroke-width="2"/>
          <circle cx="160" cy="90" r="6" fill="#333"/>
          <circle cx="210" cy="90" r="12" fill="#222" stroke="#555" stroke-width="2"/>
          <circle cx="210" cy="90" r="6" fill="#333"/>
          <circle cx="260" cy="90" r="12" fill="#222" stroke="#555" stroke-width="2"/>
          <circle cx="260" cy="90" r="6" fill="#333"/>
        </svg>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 pb-12">

      <!-- Search -->
      <div class="flex gap-2 my-6">
        <input v-model="username" type="text" placeholder="输入欧服玩家名..." class="search-input flex-1 px-4 py-2 font-mono text-sm rounded" @keyup.enter="doSearch"/>
        <button @click="doSearch" class="search-btn px-5 py-2 font-mono text-sm rounded">搜索</button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center gap-4 py-16">
        <div class="tracks-spinner">
          <div class="track-block" v-for="i in 5" :key="i" :style="{ animationDelay: `${(i-1)*0.15}s` }"></div>
        </div>
        <p class="font-mono text-sm" style="color:#666;">正在搜索玩家数据...</p>
      </div>

      <!-- Not found -->
      <div v-else-if="notFound" class="text-center py-12">
        <p class="font-mono text-lg mb-2" style="color:#CD3333;">⚠ 玩家未找到</p>
        <p class="font-mono text-sm" style="color:#666;">请检查玩家名是否正确（欧服）</p>
      </div>

      <!-- Error -->
      <div v-else-if="errorMsg" class="text-center py-12">
        <p class="font-mono mb-4" style="color:#CD3333;">⚠ {{ errorMsg }}</p>
        <button @click="doSearch" class="search-btn px-5 py-2 font-mono text-sm rounded">重试</button>
      </div>

      <!-- Player data -->
      <div v-else-if="playerData">

        <!-- Player header card -->
        <div class="steel-card p-5 mb-4 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 class="font-mono text-2xl font-bold" style="color:#E0E0E0;">{{ playerData.nickname }}</h2>
            <p class="font-mono text-xs mt-1" style="color:#555;">Account ID: {{ playerData.account_id }}</p>
          </div>
          <div class="text-right">
            <div class="font-mono text-3xl font-bold" :style="{ color: wn8Color(playerData.wn8) }">
              {{ Math.round(playerData.wn8) }}
            </div>
            <div class="font-mono text-sm font-semibold" :style="{ color: wn8Color(playerData.wn8) }">
              WN8 · {{ wn8Label(playerData.wn8) }}
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex gap-1 mb-4">
          <button @click="activeTab = 'vehicles'" class="tab-btn" :class="{ active: activeTab === 'vehicles' }">🚗 车辆战绩</button>
          <button @click="activeTab = 'overview'" class="tab-btn" :class="{ active: activeTab === 'overview' }">📊 总览数据</button>
        </div>

        <!-- Tab: Overview -->
        <div v-if="activeTab === 'overview'">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
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
              <div class="stat-val">{{ playerData.avgDamage.toLocaleString() }}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">平均击杀</div>
              <div class="stat-val">{{ playerData.avgFrags.toFixed(2) }}</div>
            </div>
          </div>

          <!-- WN8 color legend -->
          <div class="steel-card p-4">
            <div class="font-mono text-xs mb-3" style="color:#888;">WN8 评级说明</div>
            <div class="flex flex-wrap gap-2">
              <span v-for="[label, color] in [['很差 &lt;300','#CD3333'],['较差 &lt;900','#CD7700'],['平均 &lt;1650','#CCB800'],['良好 &lt;2450','#4D7326'],['优秀 &lt;3000','#4099BF'],['超神 3000+','#B24CCC']]" :key="label" class="font-mono text-xs px-2 py-1 rounded" :style="`color:${color}; border: 1px solid ${color}40; background: ${color}15`">{{ label }}</span>
            </div>
          </div>
        </div>

        <!-- Tab: Vehicles -->
        <div v-if="activeTab === 'vehicles'">
          <div v-if="playerData.vehicles.length > 0" class="steel-card overflow-hidden">
            <div class="px-4 py-3 border-b border-[#333] flex items-center justify-between">
              <span class="font-mono text-sm" style="color:#C0C0C0;">Top {{ playerData.vehicles.length }} 车辆（按场次排序）</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full font-mono text-sm">
                <thead>
                  <tr style="background:#1A1A1A;">
                    <th class="px-4 py-2 text-left" style="color:#888;">车辆</th>
                    <th class="px-4 py-2 text-right" style="color:#888;">场次</th>
                    <th class="px-4 py-2 text-right" style="color:#888;">胜率</th>
                    <th class="px-4 py-2 text-right" style="color:#888;">均伤</th>
                    <th class="px-4 py-2 text-right" style="color:#888;">WN8</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="v in playerData.vehicles" :key="v.tank_id" class="border-t border-[#2A2A2A] hover:bg-[#1E1E1E] transition-colors">
                    <td class="px-4 py-2.5" style="color:#E0E0E0;">{{ v.name }}</td>
                    <td class="px-4 py-2.5 text-right" style="color:#A0A0A0;">{{ v.battles.toLocaleString() }}</td>
                    <td class="px-4 py-2.5 text-right" style="color:#A0A0A0;">{{ pct(v.winRate) }}</td>
                    <td class="px-4 py-2.5 text-right" style="color:#A0A0A0;">{{ v.avgDamage.toLocaleString() }}</td>
                    <td class="px-4 py-2.5 text-right font-bold" :style="{ color: wn8Color(v.wn8) }">{{ Math.round(v.wn8) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="text-center py-8 font-mono text-sm" style="color:#555;">暂无车辆数据</div>
        </div>

      </div>
    </div>
  </div>
  </ErrorBoundary>
</template>

<style scoped>
.wot-page { background: #141414; font-family: "Inter", system-ui, sans-serif; }

.wot-banner {
  background: linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%);
  border-bottom: 1px solid #2A2A2A;
}
.wot-banner-overlay {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, rgba(192,192,192,0.03) 0%, transparent 70%);
}

.search-input { background: #111; border: 1px solid #333; color: #E0E0E0; outline: none; }
.search-input:focus { border-color: #666; }
.search-input::placeholder { color: #444; }
.search-btn { background: #2A2A2A; border: 1px solid #444; color: #C0C0C0; cursor: pointer; transition: background 0.15s; }
.search-btn:hover { background: #333; }

.tracks-spinner { display: flex; gap: 6px; align-items: flex-end; }
.track-block { width: 12px; height: 12px; background: #444; border-radius: 2px; animation: track-bounce 0.8s ease-in-out infinite alternate; }
@keyframes track-bounce { from { transform: translateY(0); background: #444; } to { transform: translateY(-12px); background: #888; } }

.steel-card { background: #1E1E1E; border: 1px solid #2E2E2E; border-radius: 8px; }

.stat-box { background: #1E1E1E; border: 1px solid #2E2E2E; padding: 16px 12px; text-align: center; border-radius: 8px; }
.stat-label { font-size: 11px; color: #555; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; font-family: "Courier New", monospace; }
.stat-val { font-size: 1.4rem; font-weight: bold; color: #C0C0C0; font-family: "Courier New", monospace; }

.tab-btn { padding: 8px 20px; font-mono: true; font-size: 13px; border: 1px solid #333; background: #1A1A1A; color: #888; cursor: pointer; border-radius: 6px; transition: all 0.15s; font-family: "Courier New", monospace; }
.tab-btn:hover { background: #222; color: #C0C0C0; }
.tab-btn.active { background: #2A2A2A; border-color: #555; color: #E0E0E0; }
</style>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { fetchMojangVersions, type MojangVersionInfo } from '../../composables/useMojangApi'
import ErrorBoundary from '../../components/ui/ErrorBoundary.vue'

const data = ref<MojangVersionInfo | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const fromCache = ref(false)

async function load() {
  loading.value = true
  error.value = null
  try {
    const result = await fetchMojangVersions()
    // If cachedAt is older than 60s, it came from cache on error
    const age = Date.now() - result.cachedAt
    fromCache.value = age > 60_000
    data.value = result
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '请求失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)

function formatCachedAt(ts: number): string {
  return new Date(ts).toLocaleString('zh-CN')
}
</script>

<template>
  <ErrorBoundary>
  <div class="mc-page min-h-screen" style="background:#1A1A1A; background-image: radial-gradient(circle, #2a4a2a 1px, transparent 1px); background-size: 24px 24px;">
    <!-- Back button -->
    <div class="p-4">
      <RouterLink to="/" class="inline-flex items-center gap-2 px-3 py-1 border-2 border-[#5A8A3A] text-[#7EC850] hover:bg-[#2a4a2a] transition-colors" style="font-family:'Courier New',monospace; font-size:14px;">
        ← 返回主页
      </RouterLink>
    </div>

    <div class="max-w-2xl mx-auto px-4 pb-12">
      <!-- Title -->
      <h1 class="text-center mb-8" style="font-family:'Courier New',monospace; font-size:2rem; color:#7EC850; text-shadow:2px 2px 0 #3A5A1A; letter-spacing:2px;">
        ⛏ Minecraft 版本追踪
      </h1>

      <!-- Loading state: dirt-block progress bar -->
      <div v-if="loading" class="flex flex-col items-center gap-4 py-16">
        <div class="dirt-bar-container">
          <div class="dirt-bar-fill"></div>
        </div>
        <p style="font-family:'Courier New',monospace; color:#A0A0A0; font-size:14px;">正在加载版本数据...</p>
      </div>

      <!-- Error state (no cache) -->
      <div v-else-if="error && !data" class="text-center py-16">
        <div class="mc-box border-2 border-red-600 p-6 mb-4">
          <p style="font-family:'Courier New',monospace; color:#FF4444; font-size:16px;">⚠ 加载失败：{{ error }}</p>
        </div>
        <button @click="load" class="mc-btn px-6 py-2 mt-4">
          重试
        </button>
      </div>

      <!-- Data display -->
      <div v-else-if="data">
        <!-- Cache banner -->
        <div v-if="fromCache || error" class="mc-box border-2 border-yellow-600 bg-yellow-900/20 p-3 mb-6 flex items-center gap-2">
          <span style="font-size:18px;">⚠</span>
          <span style="font-family:'Courier New',monospace; color:#FFD700; font-size:13px;">
            数据来自缓存，更新于 {{ formatCachedAt(data.cachedAt) }}
          </span>
        </div>

        <!-- Version cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div class="mc-box p-5">
            <div class="mc-label">Java 最新正式版</div>
            <div class="mc-value">{{ data.javaLatestRelease }}</div>
          </div>
          <div class="mc-box p-5">
            <div class="mc-label">Java 最新快照</div>
            <div class="mc-value">{{ data.javaLatestSnapshot }}</div>
          </div>
          <div class="mc-box p-5">
            <div class="mc-label">基岩版最新发布</div>
            <div class="mc-value">{{ data.bedrockLatestRelease }}</div>
          </div>
          <div class="mc-box p-5">
            <div class="mc-label">发布日期</div>
            <div class="mc-value">{{ data.releaseDate || '—' }}</div>
          </div>
        </div>

        <div class="text-center">
          <button @click="load" class="mc-btn px-6 py-2">
            🔄 刷新
          </button>
        </div>
      </div>
    </div>
  </div>
  </ErrorBoundary>
</template>

<style scoped>
.mc-box {
  background: #2A2A2A;
  border: 2px solid #5A8A3A;
  box-shadow: inset 0 0 0 1px #3A5A2A;
}

.mc-label {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #A0A0A0;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.mc-value {
  font-family: 'Courier New', monospace;
  font-size: 1.5rem;
  color: #7EC850;
  font-weight: bold;
}

.mc-btn {
  font-family: 'Courier New', monospace;
  background: #5A8A3A;
  color: #fff;
  border: 2px solid #7EC850;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.15s;
}
.mc-btn:hover {
  background: #7EC850;
  color: #1A1A1A;
}

/* Dirt-block loading bar */
.dirt-bar-container {
  width: 240px;
  height: 24px;
  background: #3D2B1A;
  border: 2px solid #6B4A2A;
  overflow: hidden;
  position: relative;
}
.dirt-bar-fill {
  height: 100%;
  width: 60%;
  background: repeating-linear-gradient(
    90deg,
    #8B5E3C 0px,
    #8B5E3C 20px,
    #6B4A2A 20px,
    #6B4A2A 24px
  );
  animation: dirt-slide 1.2s linear infinite;
}
@keyframes dirt-slide {
  from { transform: translateX(-100%); }
  to   { transform: translateX(200%); }
}
</style>

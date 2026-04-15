<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { fetchMojangVersions, type MojangVersionInfo } from '../../composables/useMojangApi'
import ErrorBoundary from '../../components/ui/ErrorBoundary.vue'

const data = ref<MojangVersionInfo | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const fromCache = ref(false)

// Wiki URL builder
function wikiUrl(version: string): string {
  const encoded = encodeURIComponent(`Java版${version}`)
  return `https://zh.minecraft.wiki/w/${encoded}`
}

function snapshotWikiUrl(version: string): string {
  const encoded = encodeURIComponent(version)
  return `https://zh.minecraft.wiki/w/${encoded}`
}

// Version type detection
const isSnapshot = computed(() => {
  if (!data.value) return false
  const s = data.value.javaLatestSnapshot
  return s !== data.value.javaLatestRelease
})

async function load() {
  loading.value = true
  error.value = null
  try {
    const result = await fetchMojangVersions()
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
  <div class="mc-page min-h-screen">
    <!-- Minecraft-style dot grid background -->
    <div class="mc-bg" />

    <!-- Back button -->
    <div class="p-4 relative z-10">
      <RouterLink to="/" class="mc-back-btn">
        ← 返回主页
      </RouterLink>
    </div>

    <div class="max-w-2xl mx-auto px-4 pb-16 relative z-10">
      <!-- Title with Minecraft logo style -->
      <div class="text-center mb-10">
        <div class="mc-title-block mx-auto mb-3">
          <span class="mc-title-icon">⛏</span>
        </div>
        <h1 class="mc-title">Minecraft 版本追踪</h1>
        <p class="mc-subtitle">Java Edition · Bedrock Edition</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center gap-4 py-16">
        <div class="dirt-bar-container">
          <div class="dirt-bar-fill" />
        </div>
        <p class="mc-text-muted">正在从 Mojang 服务器加载版本数据...</p>
      </div>

      <!-- Error (no cache) -->
      <div v-else-if="error && !data" class="text-center py-16">
        <div class="mc-card border-red-600 p-6 mb-4">
          <p class="mc-text" style="color:#FF4444;">⚠ 加载失败：{{ error }}</p>
        </div>
        <button @click="load" class="mc-btn mt-4">重试</button>
      </div>

      <!-- Data -->
      <div v-else-if="data">
        <!-- Cache banner -->
        <div v-if="fromCache || error" class="mc-card border-yellow-600 bg-yellow-900/20 p-3 mb-6 flex items-center gap-2">
          <span>⚠</span>
          <span class="mc-text-sm" style="color:#FFD700;">
            数据来自缓存，更新于 {{ formatCachedAt(data.cachedAt) }}
          </span>
        </div>

        <!-- Java Latest Release -->
        <div class="mc-card p-6 mb-4">
          <div class="flex items-start justify-between gap-4 flex-wrap">
            <div class="flex-1">
              <div class="mc-label">☕ Java 版 · 最新正式版</div>
              <div class="mc-version-num">{{ data.javaLatestRelease }}</div>
              <div class="mc-text-muted mt-1">发布日期：{{ data.releaseDate || '—' }}</div>
            </div>
            <div class="flex flex-col gap-2 flex-shrink-0">
              <a
                :href="wikiUrl(data.javaLatestRelease)"
                target="_blank"
                rel="noopener noreferrer"
                class="mc-wiki-btn"
              >
                📖 查看 Wiki
              </a>
              <a
                :href="`https://www.minecraft.net/zh-hans/article/minecraft-java-edition-${data.javaLatestRelease.replace(/\./g, '-')}`"
                target="_blank"
                rel="noopener noreferrer"
                class="mc-wiki-btn mc-wiki-btn-secondary"
              >
                📰 官方公告
              </a>
            </div>
          </div>

          <!-- Update highlights -->
          <div class="mt-4 pt-4 border-t border-[#3A5A2A]">
            <div class="mc-label mb-2">更新亮点</div>
            <ul class="space-y-1">
              <li class="mc-text-sm flex items-start gap-2">
                <span class="text-green-400 flex-shrink-0">▸</span>
                <span>查看完整更新内容，请访问上方 Wiki 链接</span>
              </li>
              <li class="mc-text-sm flex items-start gap-2">
                <span class="text-green-400 flex-shrink-0">▸</span>
                <span>Wiki 包含新方块、新生物、新特性的详细说明</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Java Latest Snapshot (only if different from release) -->
        <div v-if="isSnapshot" class="mc-card mc-card-snapshot p-6 mb-4">
          <div class="flex items-start justify-between gap-4 flex-wrap">
            <div class="flex-1">
              <div class="mc-label" style="color:#FFD700;">🧪 Java 版 · 最新快照</div>
              <div class="mc-version-num" style="color:#FFD700;">{{ data.javaLatestSnapshot }}</div>
              <div class="mc-text-muted mt-1">预览版本，可能不稳定</div>
            </div>
            <a
              :href="snapshotWikiUrl(data.javaLatestSnapshot)"
              target="_blank"
              rel="noopener noreferrer"
              class="mc-wiki-btn mc-wiki-btn-gold flex-shrink-0"
            >
              📖 查看 Wiki
            </a>
          </div>
        </div>

        <!-- Bedrock -->
        <div class="mc-card p-6 mb-6">
          <div class="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div class="mc-label">📱 基岩版 · 最新发布</div>
              <div class="mc-version-num">{{ data.bedrockLatestRelease }}</div>
              <div class="mc-text-muted mt-1">跨平台版本（手机/主机/Win10）</div>
            </div>
            <a
              href="https://zh.minecraft.wiki/w/基岩版"
              target="_blank"
              rel="noopener noreferrer"
              class="mc-wiki-btn flex-shrink-0"
            >
              📖 基岩版 Wiki
            </a>
          </div>
        </div>

        <!-- Quick links -->
        <div class="mc-card p-5 mb-6">
          <div class="mc-label mb-3">🔗 快速链接</div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <a href="https://zh.minecraft.wiki" target="_blank" rel="noopener noreferrer" class="mc-link-btn">中文 Wiki</a>
            <a href="https://www.minecraft.net/zh-hans/download" target="_blank" rel="noopener noreferrer" class="mc-link-btn">官方下载</a>
            <a href="https://zh.minecraft.wiki/w/Java版版本历史" target="_blank" rel="noopener noreferrer" class="mc-link-btn">版本历史</a>
            <a href="https://zh.minecraft.wiki/w/基岩版版本历史" target="_blank" rel="noopener noreferrer" class="mc-link-btn">基岩版历史</a>
            <a href="https://feedback.minecraft.net" target="_blank" rel="noopener noreferrer" class="mc-link-btn">反馈中心</a>
            <a href="https://zh.minecraft.wiki/w/快照" target="_blank" rel="noopener noreferrer" class="mc-link-btn">快照说明</a>
          </div>
        </div>

        <div class="text-center">
          <button @click="load" class="mc-btn">🔄 刷新数据</button>
        </div>
      </div>
    </div>
  </div>
  </ErrorBoundary>
</template>

<style scoped>
.mc-page {
  background: #1A1A1A;
  font-family: 'Courier New', monospace;
  position: relative;
}

.mc-bg {
  position: fixed;
  inset: 0;
  background-image: radial-gradient(circle, #2a4a2a 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
  z-index: 0;
}

.mc-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 2px solid #5A8A3A;
  color: #7EC850;
  font-size: 14px;
  transition: background 0.15s;
  text-decoration: none;
}
.mc-back-btn:hover { background: #2a4a2a; }

.mc-title-block {
  width: 64px;
  height: 64px;
  background: #5A8A3A;
  border: 3px solid #7EC850;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 4px 4px 0 #3A5A1A;
}
.mc-title-icon { font-size: 32px; }

.mc-title {
  font-size: 1.8rem;
  color: #7EC850;
  text-shadow: 2px 2px 0 #3A5A1A;
  letter-spacing: 2px;
  margin-bottom: 4px;
}
.mc-subtitle {
  font-size: 12px;
  color: #5A8A3A;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.mc-card {
  background: #2A2A2A;
  border: 2px solid #5A8A3A;
  box-shadow: inset 0 0 0 1px #3A5A2A, 4px 4px 0 #1A1A1A;
}

.mc-card-snapshot {
  border-color: #8A7A1A;
  box-shadow: inset 0 0 0 1px #6A5A0A, 4px 4px 0 #1A1A1A;
}

.mc-label {
  font-size: 11px;
  color: #7EC850;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 6px;
}

.mc-version-num {
  font-size: 2rem;
  color: #7EC850;
  font-weight: bold;
  text-shadow: 1px 1px 0 #3A5A1A;
}

.mc-text { color: #C0C0C0; font-size: 14px; }
.mc-text-sm { color: #A0A0A0; font-size: 13px; }
.mc-text-muted { color: #666; font-size: 12px; }

.mc-wiki-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  background: #3A5A2A;
  border: 2px solid #5A8A3A;
  color: #7EC850;
  font-size: 13px;
  text-decoration: none;
  transition: background 0.15s;
  white-space: nowrap;
}
.mc-wiki-btn:hover { background: #5A8A3A; color: #fff; }

.mc-wiki-btn-secondary {
  background: #2A3A2A;
  border-color: #4A6A3A;
  color: #5A8A3A;
}
.mc-wiki-btn-secondary:hover { background: #3A5A2A; color: #7EC850; }

.mc-wiki-btn-gold {
  background: #3A3A1A;
  border-color: #8A7A1A;
  color: #FFD700;
}
.mc-wiki-btn-gold:hover { background: #5A5A1A; }

.mc-link-btn {
  display: block;
  padding: 8px 10px;
  background: #222;
  border: 1px solid #3A5A2A;
  color: #7EC850;
  font-size: 12px;
  text-align: center;
  text-decoration: none;
  transition: background 0.15s;
}
.mc-link-btn:hover { background: #2a4a2a; }

.mc-btn {
  font-family: 'Courier New', monospace;
  background: #5A8A3A;
  color: #fff;
  border: 2px solid #7EC850;
  padding: 8px 24px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.15s;
  box-shadow: 3px 3px 0 #3A5A1A;
}
.mc-btn:hover { background: #7EC850; color: #1A1A1A; }

/* Dirt-block loading bar */
.dirt-bar-container {
  width: 240px;
  height: 24px;
  background: #3D2B1A;
  border: 2px solid #6B4A2A;
  overflow: hidden;
}
.dirt-bar-fill {
  height: 100%;
  width: 60%;
  background: repeating-linear-gradient(90deg, #8B5E3C 0px, #8B5E3C 20px, #6B4A2A 20px, #6B4A2A 24px);
  animation: dirt-slide 1.2s linear infinite;
}
@keyframes dirt-slide {
  from { transform: translateX(-100%); }
  to   { transform: translateX(200%); }
}
</style>

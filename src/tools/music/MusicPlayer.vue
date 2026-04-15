<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAudioStore } from '../../stores/audio'
import ErrorBoundary from '../../components/ui/ErrorBoundary.vue'

const store = useAudioStore()
const audioRef = ref<HTMLAudioElement | null>(null)
const currentTime = ref(0)
const duration = ref(0)
const isReady = ref(false)

const repeatIcon = computed(() => {
  if (store.repeatMode === 'single') return '🔂'
  if (store.repeatMode === 'playlist') return '🔁'
  return '➡'
})

const repeatLabel = computed(() => {
  if (store.repeatMode === 'single') return '单曲'
  if (store.repeatMode === 'playlist') return '列表'
  return '顺序'
})

const progressPct = computed(() =>
  duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
)

function formatTime(s: number): string {
  if (!isFinite(s) || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

function cycleRepeat() {
  const modes = ['none', 'single', 'playlist'] as const
  const idx = modes.indexOf(store.repeatMode)
  store.setRepeat(modes[(idx + 1) % modes.length])
}

function togglePlay() {
  const audio = audioRef.value
  if (!audio) return
  if (store.isPlaying) {
    audio.pause()
    store.pause()
  } else {
    audio.play().then(() => store.play()).catch(() => {})
  }
}

function seekTo(e: MouseEvent) {
  const bar = e.currentTarget as HTMLElement
  const rect = bar.getBoundingClientRect()
  const pct = (e.clientX - rect.left) / rect.width
  const audio = audioRef.value
  if (audio && isFinite(audio.duration)) {
    audio.currentTime = pct * audio.duration
  }
}

function handleEnded() {
  if (store.repeatMode === 'single') {
    audioRef.value?.play().catch(() => {})
  } else {
    store.next()
  }
}

function handleError() {
  isReady.value = false
  // Only skip if not already at max errors - prevents infinite loop when files missing
  store.onAudioError()
}

function handleTimeUpdate() {
  currentTime.value = audioRef.value?.currentTime ?? 0
}

function handleLoadedMetadata() {
  duration.value = audioRef.value?.duration ?? 0
  isReady.value = true
}

function handleCanPlay() {
  isReady.value = true
}

// When track changes via store.next()/prev(), sync audio element
watch(() => store.currentIndex, (newIdx, oldIdx) => {
  if (newIdx === oldIdx) return
  const audio = audioRef.value
  if (!audio) return
  isReady.value = false
  currentTime.value = 0
  duration.value = 0
  const track = store.currentTrack
  if (track) {
    audio.src = track.src
    audio.load()
    // Only auto-play if we were already playing (e.g. song ended → next)
    if (store.isPlaying) {
      audio.play().catch(() => {})
    }
  }
})

watch(() => store.volume, (v) => {
  if (audioRef.value) audioRef.value.volume = v
})

onMounted(() => {
  const audio = audioRef.value
  if (!audio) return
  audio.volume = store.volume
  const track = store.currentTrack
  if (track) {
    audio.src = track.src
    audio.load()
  }
})

onUnmounted(() => {
  store.pause()
})

// Background blur color from cover
const bgStyle = computed(() => {
  const cover = store.currentTrack?.coverUrl
  if (cover && !cover.includes('placeholder')) {
    return `background: linear-gradient(135deg, #1A0A00 0%, #2A1200 50%, #1A0A00 100%);`
  }
  return 'background: linear-gradient(135deg, #1A0A00 0%, #2A1200 50%, #1A0A00 100%);'
})
</script>

<template>
  <ErrorBoundary>
  <div class="music-page min-h-screen relative overflow-hidden" :style="bgStyle">

    <!-- Blurred album art background -->
    <div
      v-if="store.currentTrack?.coverUrl"
      class="absolute inset-0 pointer-events-none"
      :style="`background-image: url('${store.currentTrack.coverUrl}'); background-size: cover; background-position: center; filter: blur(60px) brightness(0.25); transform: scale(1.1);`"
    />
    <div class="absolute inset-0 bg-black/50 pointer-events-none" />

    <!-- Back button -->
    <div class="p-4 relative z-10">
      <RouterLink to="/" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-700/50 text-amber-400/80 hover:bg-amber-900/30 transition-colors text-sm backdrop-blur-sm">
        ← 返回主页
      </RouterLink>
    </div>

    <div class="relative z-10 max-w-5xl mx-auto px-4 pb-12">
      <h1 class="text-center mb-8 text-xl font-semibold tracking-widest" style="color:#D4A96A;">
        🎵 陈奕迅 · 音乐播放器
      </h1>

      <div class="flex flex-col lg:flex-row gap-6">

        <!-- ── Player Panel ── -->
        <div class="flex-1 flex flex-col items-center gap-5 player-card p-6 backdrop-blur-md">

          <!-- Album cover -->
          <div class="cover-wrapper" :class="{ spinning: store.isPlaying }">
            <img
              v-if="store.currentTrack?.coverUrl && !store.currentTrack.coverUrl.includes('placeholder')"
              :src="store.currentTrack.coverUrl"
              :alt="store.currentTrack.title"
              class="cover-img"
              @error="($event.target as HTMLImageElement).style.display='none'"
            />
            <div v-else class="cover-placeholder">
              <span class="text-5xl">🎵</span>
            </div>
            <div class="cover-center" />
          </div>

          <!-- Track info -->
          <div class="text-center w-full">
            <p class="text-lg font-semibold truncate" style="color:#F5DEB3;">
              {{ store.currentTrack?.title ?? '未选择歌曲' }}
            </p>
            <p class="text-sm mt-0.5" style="color:#A0785A;">
              陈奕迅 · {{ store.currentTrack?.album ?? '' }}
            </p>
          </div>

          <!-- Progress bar -->
          <div class="w-full">
            <div
              class="progress-bar cursor-pointer"
              @click="seekTo"
            >
              <div class="progress-fill" :style="{ width: progressPct + '%' }" />
              <div class="progress-thumb" :style="{ left: progressPct + '%' }" />
            </div>
            <div class="flex justify-between mt-1">
              <span class="text-xs" style="color:#666;">{{ formatTime(currentTime) }}</span>
              <span class="text-xs" style="color:#666;">{{ formatTime(duration) }}</span>
            </div>
          </div>

          <!-- Main controls -->
          <div class="flex items-center gap-5">
            <button @click="store.prev()" class="ctrl-btn" title="上一首" :disabled="!isReady">⏮</button>
            <button @click="togglePlay" class="ctrl-btn play-btn" :title="store.isPlaying ? '暂停' : '播放'">
              <span v-if="!isReady" class="loading-dot" />
              <span v-else>{{ store.isPlaying ? '⏸' : '▶' }}</span>
            </button>
            <button @click="store.next()" class="ctrl-btn" title="下一首" :disabled="!isReady">⏭</button>
          </div>

          <!-- Secondary controls -->
          <div class="flex items-center gap-3">
            <button
              @click="store.toggleShuffle()"
              class="ctrl-sm"
              :class="{ active: store.shuffleMode }"
            >🔀 {{ store.shuffleMode ? '随机' : '顺序' }}</button>
            <button @click="cycleRepeat" class="ctrl-sm">
              {{ repeatIcon }} {{ repeatLabel }}
            </button>
          </div>

          <!-- Volume -->
          <div class="flex items-center gap-3 w-full max-w-xs">
            <span style="color:#A0785A; font-size:14px;">🔈</span>
            <input
              type="range" min="0" max="1" step="0.01"
              :value="store.volume"
              @input="store.setVolume(+($event.target as HTMLInputElement).value)"
              class="volume-slider flex-1"
            />
            <span style="color:#A0785A; font-size:14px;">🔊</span>
          </div>
        </div>

        <!-- ── Playlist ── -->
        <div class="lg:w-72 player-card p-4 backdrop-blur-md overflow-y-auto" style="max-height:520px;">
          <h2 class="text-sm font-semibold mb-3 pb-2 border-b border-amber-900/40" style="color:#D4A96A;">
            播放列表 · {{ store.tracks.length }} 首
          </h2>
          <ul class="space-y-0.5">
            <li
              v-for="(track, idx) in store.tracks"
              :key="track.id"
              @click="() => { store.jumpTo(idx); const audio = audioRef; if(audio) { audio.src = store.tracks[idx].src; audio.load(); audio.play().then(() => store.play()).catch(() => {}); } }"
              class="playlist-item px-3 py-2.5 cursor-pointer rounded-lg flex items-center gap-3"
              :class="{ 'playlist-active': idx === store.currentIndex }"
            >
              <span class="text-xs w-5 text-center flex-shrink-0" style="color:#666;">
                <span v-if="idx === store.currentIndex && store.isPlaying">▶</span>
                <span v-else>{{ idx + 1 }}</span>
              </span>
              <div class="flex-1 min-w-0">
                <p class="text-sm truncate" :style="idx === store.currentIndex ? 'color:#D4A96A;' : 'color:#F5DEB3;'">
                  {{ track.title }}
                </p>
                <p class="text-xs truncate" style="color:#6B4A2A;">{{ track.album }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Audio element -->
    <audio
      ref="audioRef"
      @ended="handleEnded"
      @error="handleError"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      @canplay="handleCanPlay"
      preload="metadata"
    />
  </div>
  </ErrorBoundary>
</template>

<style scoped>
.music-page { font-family: 'Inter', system-ui, sans-serif; }

.player-card {
  background: rgba(42, 18, 0, 0.75);
  border: 1px solid rgba(139, 94, 60, 0.4);
  border-radius: 16px;
}

/* Cover art */
.cover-wrapper {
  width: 200px; height: 200px;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
}
.cover-wrapper.spinning { animation: spin 8s linear infinite; }
.cover-img {
  width: 100%; height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(139,94,60,0.6);
}
.cover-placeholder {
  width: 100%; height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, #3D1F00 30%, #1A0A00 100%);
  border: 4px solid rgba(139,94,60,0.6);
  display: flex; align-items: center; justify-content: center;
}
.cover-center {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 28px; height: 28px;
  border-radius: 50%;
  background: #D4A96A;
  border: 3px solid #1A0A00;
  z-index: 1;
}
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* Progress bar */
.progress-bar {
  width: 100%; height: 4px;
  background: rgba(139,94,60,0.3);
  border-radius: 2px;
  position: relative;
  margin-top: 4px;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #D4A96A, #FF8C38);
  border-radius: 2px;
  transition: width 0.3s linear;
}
.progress-thumb {
  position: absolute; top: 50%;
  transform: translate(-50%, -50%);
  width: 12px; height: 12px;
  border-radius: 50%;
  background: #D4A96A;
  transition: left 0.3s linear;
}

/* Controls */
.ctrl-btn {
  background: rgba(61,31,0,0.8);
  border: 1px solid rgba(139,94,60,0.6);
  color: #F5DEB3;
  width: 44px; height: 44px;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.ctrl-btn:hover:not(:disabled) { background: rgba(90,48,16,0.9); }
.ctrl-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.play-btn { width: 60px; height: 60px; font-size: 22px; background: rgba(139,94,60,0.8); }
.play-btn:hover:not(:disabled) { background: #D4A96A; color: #1A0A00; }

.loading-dot {
  display: inline-block; width: 8px; height: 8px;
  border-radius: 50%; background: #D4A96A;
  animation: pulse 1s ease-in-out infinite;
}
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

.ctrl-sm {
  background: transparent;
  border: 1px solid rgba(90,48,16,0.6);
  color: #A0785A;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}
.ctrl-sm:hover, .ctrl-sm.active { border-color: #D4A96A; color: #D4A96A; }

.volume-slider {
  -webkit-appearance: none;
  height: 4px;
  background: rgba(90,48,16,0.5);
  border-radius: 2px;
  outline: none;
}
.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: #D4A96A;
  cursor: pointer;
}

/* Playlist */
.playlist-item { transition: background 0.1s; }
.playlist-item:hover { background: rgba(61,31,0,0.6); }
.playlist-active { background: rgba(90,48,16,0.7) !important; }
</style>

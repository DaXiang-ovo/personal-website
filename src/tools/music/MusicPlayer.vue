<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAudioStore } from '../../stores/audio'
import ErrorBoundary from '../../components/ui/ErrorBoundary.vue'

const store = useAudioStore()
const audioRef = ref<HTMLAudioElement | null>(null)

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

function cycleRepeat() {
  const modes = ['none', 'single', 'playlist'] as const
  const idx = modes.indexOf(store.repeatMode)
  store.setRepeat(modes[(idx + 1) % modes.length])
}

function togglePlay() {
  if (store.isPlaying) {
    store.pause()
    audioRef.value?.pause()
  } else {
    store.play()
    audioRef.value?.play().catch(() => {})
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
  store.onAudioError()
}

// Sync audio element when track changes
watch(
  () => store.currentIndex,
  () => {
    const audio = audioRef.value
    if (!audio) return
    audio.src = store.currentTrack?.src ?? ''
    audio.load()
    if (store.isPlaying) {
      audio.play().catch(() => {})
    }
  }
)

// Sync volume
watch(
  () => store.volume,
  (v) => {
    if (audioRef.value) audioRef.value.volume = v
  }
)

// Sync play/pause from store
watch(
  () => store.isPlaying,
  (playing) => {
    if (!audioRef.value) return
    if (playing) {
      audioRef.value.play().catch(() => {})
    } else {
      audioRef.value.pause()
    }
  }
)

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = store.volume
    if (store.currentTrack) {
      audioRef.value.src = store.currentTrack.src
    }
  }
})

onUnmounted(() => {
  store.pause()
})
</script>

<template>
  <ErrorBoundary>
  <div class="music-page min-h-screen" style="background:#1A0A00;">
    <!-- Back button -->
    <div class="p-4">
      <RouterLink to="/" class="inline-flex items-center gap-2 px-3 py-1 border border-[#8B5E3C] text-[#D4A96A] hover:bg-[#3D1F00] transition-colors text-sm">
        ← 返回主页
      </RouterLink>
    </div>

    <div class="max-w-4xl mx-auto px-4 pb-12">
      <h1 class="text-center mb-8 text-2xl font-bold" style="color:#D4A96A; letter-spacing:2px;">
        🎵 音乐播放器
      </h1>

      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Player panel -->
        <div class="flex-1 player-card p-6 flex flex-col items-center gap-5">
          <!-- Vinyl record -->
          <div class="vinyl-wrapper" :class="{ spinning: store.isPlaying }">
            <div class="vinyl-outer">
              <img
                v-if="store.currentTrack?.coverUrl"
                :src="store.currentTrack.coverUrl"
                :alt="store.currentTrack.title"
                class="vinyl-cover"
                @error="($event.target as HTMLImageElement).style.display='none'"
              />
              <div class="vinyl-center"></div>
            </div>
          </div>

          <!-- Track info -->
          <div class="text-center">
            <p class="text-lg font-semibold" style="color:#F5DEB3;">
              {{ store.currentTrack?.title ?? '—' }}
            </p>
            <p class="text-sm mt-1" style="color:#A0785A;">
              {{ store.currentTrack?.album ?? '' }}
            </p>
          </div>

          <!-- Controls -->
          <div class="flex items-center gap-4">
            <button @click="store.prev()" class="ctrl-btn" title="上一首">⏮</button>
            <button @click="togglePlay" class="ctrl-btn play-btn" :title="store.isPlaying ? '暂停' : '播放'">
              {{ store.isPlaying ? '⏸' : '▶' }}
            </button>
            <button @click="store.next()" class="ctrl-btn" title="下一首">⏭</button>
          </div>

          <!-- Secondary controls -->
          <div class="flex items-center gap-4 w-full justify-center">
            <button
              @click="store.toggleShuffle()"
              class="ctrl-sm"
              :class="{ active: store.shuffleMode }"
              title="随机播放"
            >🔀 {{ store.shuffleMode ? '随机' : '顺序' }}</button>

            <button @click="cycleRepeat" class="ctrl-sm" :title="`重复: ${repeatLabel}`">
              {{ repeatIcon }} {{ repeatLabel }}
            </button>
          </div>

          <!-- Volume -->
          <div class="flex items-center gap-3 w-full max-w-xs">
            <span style="color:#A0785A; font-size:14px;">🔈</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              :value="store.volume"
              @input="store.setVolume(+($event.target as HTMLInputElement).value)"
              class="volume-slider flex-1"
            />
            <span style="color:#A0785A; font-size:14px;">🔊</span>
          </div>
        </div>

        <!-- Playlist sidebar -->
        <div class="lg:w-72 player-card p-4 overflow-y-auto" style="max-height:480px;">
          <h2 class="text-sm font-semibold mb-3" style="color:#D4A96A; letter-spacing:1px;">播放列表</h2>
          <ul class="space-y-1">
            <li
              v-for="(track, idx) in store.tracks"
              :key="track.id"
              @click="store.jumpTo(idx); store.play()"
              class="playlist-item px-3 py-2 cursor-pointer rounded"
              :class="{ 'playlist-active': idx === store.currentIndex }"
            >
              <p class="text-sm truncate" style="color:#F5DEB3;">{{ track.title }}</p>
              <p class="text-xs truncate" style="color:#A0785A;">{{ track.album }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Hidden audio element -->
    <audio
      ref="audioRef"
      @ended="handleEnded"
      @error="handleError"
      preload="metadata"
    />
  </div>
  </ErrorBoundary>
</template>

<style scoped>
.player-card {
  background: #2A1200;
  border: 1px solid #5A3010;
  border-radius: 8px;
}

/* Vinyl */
.vinyl-wrapper {
  width: 160px;
  height: 160px;
}
.vinyl-wrapper.spinning .vinyl-outer {
  animation: spin 4s linear infinite;
}
.vinyl-outer {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, #1A0A00 30%, #3D1F00 60%, #1A0A00 100%);
  border: 4px solid #5A3010;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.vinyl-cover {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  opacity: 0.6;
}
.vinyl-center {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #D4A96A;
  z-index: 1;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* Controls */
.ctrl-btn {
  background: #3D1F00;
  border: 1px solid #8B5E3C;
  color: #F5DEB3;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.ctrl-btn:hover { background: #5A3010; }
.play-btn {
  width: 56px;
  height: 56px;
  font-size: 22px;
  background: #8B5E3C;
}
.play-btn:hover { background: #D4A96A; color: #1A0A00; }

.ctrl-sm {
  background: transparent;
  border: 1px solid #5A3010;
  color: #A0785A;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}
.ctrl-sm:hover, .ctrl-sm.active {
  border-color: #D4A96A;
  color: #D4A96A;
}

/* Volume slider */
.volume-slider {
  -webkit-appearance: none;
  height: 4px;
  background: #5A3010;
  border-radius: 2px;
  outline: none;
}
.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #D4A96A;
  cursor: pointer;
}

/* Playlist */
.playlist-item {
  transition: background 0.1s;
}
.playlist-item:hover { background: #3D1F00; }
.playlist-active { background: #5A3010 !important; }
</style>

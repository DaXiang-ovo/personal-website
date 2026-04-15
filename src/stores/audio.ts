import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import musicData from '../data/music.json'

export interface Track {
  id: string
  title: string
  album: string
  coverUrl: string
  src: string
}

export type RepeatMode = 'none' | 'single' | 'playlist'

function fisherYates(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export const useAudioStore = defineStore('audio', () => {
  const tracks = ref<Track[]>(musicData.tracks as Track[])
  const currentIndex = ref(0)
  const isPlaying = ref(false)
  const volume = ref(0.8)
  const shuffleMode = ref(false)
  const repeatMode = ref<RepeatMode>('none')
  const shuffleOrder = ref<number[]>([])
  const shufflePos = ref(0)
  // Generation counter to prevent race conditions during track switching
  const playGeneration = ref(0)

  const currentTrack = computed(() => tracks.value[currentIndex.value] ?? null)

  function generateShuffle() {
    shuffleOrder.value = fisherYates(tracks.value.length)
    const pos = shuffleOrder.value.indexOf(currentIndex.value)
    shufflePos.value = pos >= 0 ? pos : 0
  }

  function play() {
    isPlaying.value = true
  }

  function pause() {
    isPlaying.value = false
  }

  function next() {
    const n = tracks.value.length
    if (n === 0) return
    if (repeatMode.value === 'single') {
      return
    }
    if (shuffleMode.value) {
      if (shuffleOrder.value.length !== n) generateShuffle()
      shufflePos.value = (shufflePos.value + 1) % n
      currentIndex.value = shuffleOrder.value[shufflePos.value]
    } else {
      currentIndex.value = (currentIndex.value + 1) % n
    }
  }

  function prev() {
    const n = tracks.value.length
    if (n === 0) return
    if (repeatMode.value === 'single') {
      return
    }
    if (shuffleMode.value) {
      if (shuffleOrder.value.length !== n) generateShuffle()
      shufflePos.value = (shufflePos.value - 1 + n) % n
      currentIndex.value = shuffleOrder.value[shufflePos.value]
    } else {
      currentIndex.value = (currentIndex.value - 1 + n) % n
    }
  }

  function setVolume(v: number) {
    volume.value = Math.max(0, Math.min(1, v))
  }

  function toggleShuffle() {
    shuffleMode.value = !shuffleMode.value
    if (shuffleMode.value) {
      generateShuffle()
    }
  }

  function setRepeat(mode: RepeatMode) {
    repeatMode.value = mode
  }

  function jumpTo(index: number) {
    if (index >= 0 && index < tracks.value.length) {
      currentIndex.value = index
      if (shuffleMode.value) {
        const pos = shuffleOrder.value.indexOf(index)
        shufflePos.value = pos >= 0 ? pos : 0
      }
    }
  }

  // Error tracking: only reset on successful playback, not on timer
  const consecutiveErrors = ref(0)
  const MAX_CONSECUTIVE_ERRORS = 3
  const playbackStopped = ref(false)

  function onAudioError() {
    consecutiveErrors.value++
    if (consecutiveErrors.value >= MAX_CONSECUTIVE_ERRORS) {
      isPlaying.value = false
      playbackStopped.value = true
      return
    }
    if (isPlaying.value) {
      next()
    }
  }

  function onPlaybackSuccess() {
    consecutiveErrors.value = 0
    playbackStopped.value = false
  }

  function bumpGeneration(): number {
    playGeneration.value++
    return playGeneration.value
  }

  return {
    tracks,
    currentIndex,
    isPlaying,
    volume,
    shuffleMode,
    repeatMode,
    shuffleOrder,
    shufflePos,
    playGeneration,
    currentTrack,
    play,
    pause,
    next,
    prev,
    setVolume,
    toggleShuffle,
    setRepeat,
    jumpTo,
    generateShuffle,
    onAudioError,
    onPlaybackSuccess,
    bumpGeneration,
    consecutiveErrors,
    playbackStopped,
  }
})

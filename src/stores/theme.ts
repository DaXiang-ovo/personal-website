import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'theme'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  function applyTheme(dark: boolean) {
    isDark.value = dark
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  }

  function toggle() {
    applyTheme(!isDark.value)
  }

  function init() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') {
      applyTheme(stored === 'dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      applyTheme(prefersDark)
    }
  }

  return { isDark, toggle, init }
})

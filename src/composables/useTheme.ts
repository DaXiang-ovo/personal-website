import { useThemeStore } from '../stores/theme'
import { storeToRefs } from 'pinia'

export function useTheme() {
  const store = useThemeStore()
  const { isDark } = storeToRefs(store)
  return { isDark, toggle: store.toggle, init: store.init }
}

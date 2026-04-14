import { ref, onMounted, onUnmounted } from 'vue'

export function useTypingEffect(texts: string[], speed = 80, pause = 2000) {
  const displayed = ref('')
  let textIndex = 0
  let charIndex = 0
  let isDeleting = false
  let timerId: ReturnType<typeof setTimeout> | null = null

  function tick() {
    const current = texts[textIndex]

    if (!isDeleting) {
      displayed.value = current.slice(0, charIndex + 1)
      charIndex++
      if (charIndex === current.length) {
        isDeleting = true
        timerId = setTimeout(tick, pause)
        return
      }
    } else {
      displayed.value = current.slice(0, charIndex - 1)
      charIndex--
      if (charIndex === 0) {
        isDeleting = false
        textIndex = (textIndex + 1) % texts.length
      }
    }

    timerId = setTimeout(tick, isDeleting ? speed / 2 : speed)
  }

  onMounted(() => {
    timerId = setTimeout(tick, 500)
  })

  onUnmounted(() => {
    if (timerId) clearTimeout(timerId)
  })

  return { displayed }
}

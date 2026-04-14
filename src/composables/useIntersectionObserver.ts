import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useIntersectionObserver(
  threshold = 0.15,
  rootMargin = '0px 0px -60px 0px'
): { targetRef: Ref<HTMLElement | null>; isVisible: Ref<boolean> } {
  const targetRef = ref<HTMLElement | null>(null)
  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!targetRef.value) return
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            observer?.disconnect()
          }
        })
      },
      { threshold, rootMargin }
    )
    observer.observe(targetRef.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { targetRef, isVisible }
}

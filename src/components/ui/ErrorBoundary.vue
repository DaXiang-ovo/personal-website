<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorInfo = ref('')

onErrorCaptured((err: unknown) => {
  hasError.value = true
  errorInfo.value = err instanceof Error ? err.message : String(err)
  // Prevent propagation
  return false
})
</script>

<template>
  <div v-if="hasError" class="error-boundary-fallback">
    <div class="fallback-card">
      <div class="fallback-icon" aria-hidden="true">⚠</div>
      <p class="fallback-title">该工具暂时不可用，请稍后再试</p>
      <p v-if="errorInfo" class="fallback-detail">{{ errorInfo }}</p>
      <button class="fallback-btn" @click="hasError = false">重试</button>
    </div>
  </div>
  <slot v-else />
</template>

<style scoped>
.error-boundary-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 24px;
}

.fallback-card {
  background: var(--color-surface, #fff);
  border: 2px solid var(--color-border, #D4C9B0);
  border-radius: 8px;
  padding: 32px 40px;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.fallback-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
  color: var(--color-primary, #FF6B00);
}

.fallback-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text, #1A1A1A);
  margin-bottom: 8px;
}

.fallback-detail {
  font-size: 0.75rem;
  color: var(--color-text-muted, #555);
  margin-bottom: 16px;
  word-break: break-word;
}

.fallback-btn {
  background: var(--color-primary, #FF6B00);
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.15s;
}
.fallback-btn:hover {
  opacity: 0.85;
}
</style>

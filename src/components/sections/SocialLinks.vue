<script setup lang="ts">
import socialData from '../../data/social.json'
import { useIntersectionObserver } from '../../composables/useIntersectionObserver'

const links = socialData.links.filter((l) => l.url)
const { targetRef, isVisible } = useIntersectionObserver()
</script>

<template>
  <section
    id="social"
    class="relative py-20 px-4 bg-[var(--color-bg-secondary)] overflow-hidden"
  >
    <!-- Decorative background dots -->
    <div
      class="absolute inset-0 pointer-events-none opacity-[0.04]"
      style="background-image: radial-gradient(circle, #FF6B00 1px, transparent 1px); background-size: 28px 28px;"
    />

    <div
      ref="targetRef"
      class="max-w-2xl mx-auto text-center relative z-10 transition-all duration-700"
      :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
    >
      <h2 class="text-3xl font-bold gradient-text mb-2">联系我</h2>
      <div class="w-16 h-1 bg-gradient-to-r from-orange-500 to-yellow-400 rounded mx-auto mb-10" />

      <div class="flex justify-center gap-6 flex-wrap">
        <a
          v-for="link in links"
          :key="link.platform"
          :href="link.url"
          :target="link.isEmail ? undefined : '_blank'"
          :rel="link.isEmail ? undefined : 'noopener noreferrer'"
          class="flex flex-col items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-2xl p-4"
        >
          <div class="w-16 h-16 rounded-full glass flex items-center justify-center group-hover:border-orange-500/60 group-hover:shadow-[0_0_20px_rgba(255,107,0,0.3)] transition-all duration-300 group-hover:scale-110">
            <!-- GitHub icon -->
            <svg
              v-if="link.icon === 'github'"
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8 text-gray-300 group-hover:text-orange-500 transition-colors"
              viewBox="0 0 24 24"
              fill="currentColor"
              :aria-label="`${link.platform} profile`"
            >
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            <!-- Email icon -->
            <svg
              v-else-if="link.icon === 'email'"
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8 text-gray-300 group-hover:text-orange-500 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              :aria-label="link.platform"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <!-- Generic icon fallback -->
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8 text-gray-300 group-hover:text-orange-500 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <span class="text-sm text-[var(--color-text-muted)] group-hover:text-orange-500 transition-colors">
            {{ link.platform }}
          </span>
        </a>
      </div>
    </div>
  </section>
</template>

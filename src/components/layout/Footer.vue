<script setup lang="ts">
</script>

<template>
  <footer class="relative bg-[#0D1B2A] py-10 overflow-hidden">
    <!-- Gradient top border -->
    <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

    <!-- Subtle background gradient -->
    <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(ellipse at bottom center, rgba(255,107,0,0.05) 0%, transparent 70%);" />

    <div class="max-w-6xl mx-auto px-4 flex flex-col items-center gap-4 relative z-10">
      <!-- Konoha leaf decoration -->
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        class="opacity-70"
      >
        <path
          d="M14 2 C8 2, 3 7, 3 13 C3 18, 6 22, 10 24 L14 26 L18 24 C22 22, 25 18, 25 13 C25 7, 20 2, 14 2 Z"
          fill="#FF6B00"
        />
        <path
          d="M14 4 C9 4, 5 8, 5 13 C5 17, 7.5 20.5, 11 22.5 L14 24 L17 22.5 C20.5 20.5, 23 17, 23 13 C23 8, 19 4, 14 4 Z"
          fill="#FF8C38"
          opacity="0.6"
        />
        <line x1="14" y1="6" x2="14" y2="24" stroke="#0D1B2A" stroke-width="1.5" />
        <line x1="14" y1="13" x2="8" y2="9" stroke="#0D1B2A" stroke-width="1" />
        <line x1="14" y1="13" x2="20" y2="9" stroke="#0D1B2A" stroke-width="1" />
        <line x1="14" y1="16" x2="9" y2="20" stroke="#0D1B2A" stroke-width="1" />
        <line x1="14" y1="16" x2="19" y2="20" stroke="#0D1B2A" stroke-width="1" />
      </svg>
      <p class="text-gray-400 text-sm">
        © 2026 DaXiang · Built with Vue 3
      </p>
      <p class="text-gray-600 text-xs">千里之行，始于足下</p>
    </div>
  </footer>
</template>

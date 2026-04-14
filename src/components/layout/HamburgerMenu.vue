<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

const navLinks = [
  { id: 'hero', label: '首页' },
  { id: 'about', label: '关于' },
  { id: 'techstack', label: '技术栈' },
  { id: 'projects', label: '项目' },
  { id: 'social', label: '联系' },
  { id: 'tools', label: '工具' },
]

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  close()
}
</script>

<template>
  <div class="md:hidden">
    <!-- Hamburger button -->
    <button
      @click="toggle"
      class="p-2 rounded focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
      :aria-label="isOpen ? 'Close menu' : 'Open menu'"
      :aria-expanded="isOpen"
    >
      <div class="w-6 h-5 flex flex-col justify-between">
        <span
          class="block h-0.5 bg-orange-500 transition-all duration-300 origin-center"
          :class="isOpen ? 'rotate-45 translate-y-2' : ''"
        />
        <span
          class="block h-0.5 bg-orange-500 transition-all duration-300"
          :class="isOpen ? 'opacity-0 scale-x-0' : ''"
        />
        <span
          class="block h-0.5 bg-orange-500 transition-all duration-300 origin-center"
          :class="isOpen ? '-rotate-45 -translate-y-2' : ''"
        />
      </div>
    </button>

    <!-- Mobile drawer overlay -->
    <transition name="drawer">
      <div
        v-if="isOpen"
        class="fixed inset-0 top-14 z-40 bg-[#0D1B2A]/95 backdrop-blur-sm flex flex-col"
      >
        <nav class="flex flex-col items-center justify-center flex-1 gap-6">
          <a
            v-for="link in navLinks"
            :key="link.id"
            href="#"
            @click.prevent="scrollTo(link.id)"
            class="text-xl font-semibold text-gray-200 hover:text-orange-500 transition-colors duration-200 py-2 px-6 rounded-lg hover:bg-orange-500/10"
          >
            {{ link.label }}
          </a>
        </nav>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

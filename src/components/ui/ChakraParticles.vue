<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animFrameId = 0
let particles: Particle[] = []

interface Particle {
  x: number
  y: number
  radius: number
  color: string
  opacity: number
  opacityDir: number
  speedX: number
  speedY: number
}

const COLORS = ['#FF6B00', '#FFD700', '#FF8C38']
const MAX_PARTICLES = 60

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2.5 + 0.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    opacity: Math.random() * 0.3 + 0.1,
    opacityDir: (Math.random() > 0.5 ? 1 : -1) * 0.003,
    speedX: (Math.random() - 0.5) * 0.3,
    speedY: -(Math.random() * 0.4 + 0.1),
  }
}

function initParticles(width: number, height: number) {
  particles = Array.from({ length: MAX_PARTICLES }, () => createParticle(width, height))
}

function animate(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.clearRect(0, 0, width, height)

  for (const p of particles) {
    p.x += p.speedX
    p.y += p.speedY
    p.opacity += p.opacityDir

    if (p.opacity <= 0.05 || p.opacity >= 0.65) p.opacityDir *= -1
    p.opacity = Math.max(0.05, Math.min(0.65, p.opacity))

    // Wrap around edges
    if (p.y < -5) p.y = height + 5
    if (p.x < -5) p.x = width + 5
    if (p.x > width + 5) p.x = -5

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.globalAlpha = p.opacity
    ctx.fill()
    ctx.globalAlpha = 1
  }

  animFrameId = requestAnimationFrame(() => animate(ctx, width, height))
}

onMounted(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return

  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const resize = () => {
    const parent = canvas.parentElement
    if (!parent) return
    canvas.width = parent.offsetWidth
    canvas.height = parent.offsetHeight
    initParticles(canvas.width, canvas.height)
  }

  resize()
  const ro = new ResizeObserver(resize)
  if (canvas.parentElement) ro.observe(canvas.parentElement)

  animate(ctx, canvas.width, canvas.height)

  onUnmounted(() => {
    cancelAnimationFrame(animFrameId)
    ro.disconnect()
  })
})

onUnmounted(() => {
  cancelAnimationFrame(animFrameId)
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="absolute inset-0 w-full h-full pointer-events-none"
    aria-hidden="true"
  />
</template>

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
  // burst state
  bursting: boolean
  burstRadius: number
  burstOpacity: number
}

const COLORS = ['#FF6B00', '#FFD700', '#FF8C38', '#FFB070']
const MAX_PARTICLES = 80

function createParticle(width: number, height: number): Particle {
  const isLarge = Math.random() < 0.2
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: isLarge ? Math.random() * 2 + 3 : Math.random() * 2.5 + 0.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    opacity: Math.random() * 0.3 + 0.1,
    opacityDir: (Math.random() > 0.5 ? 1 : -1) * 0.003,
    speedX: (Math.random() - 0.5) * (isLarge ? 0.15 : 0.3),
    speedY: -(Math.random() * (isLarge ? 0.2 : 0.4) + 0.05),
    bursting: false,
    burstRadius: 0,
    burstOpacity: 0,
  }
}

function initParticles(width: number, height: number) {
  particles = Array.from({ length: MAX_PARTICLES }, () => createParticle(width, height))
}

let burstTimer = 0

function animate(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.clearRect(0, 0, width, height)

  // Occasionally trigger a burst on a random particle
  burstTimer++
  if (burstTimer > 120) {
    burstTimer = 0
    const idx = Math.floor(Math.random() * particles.length)
    if (!particles[idx].bursting) {
      particles[idx].bursting = true
      particles[idx].burstRadius = particles[idx].radius
      particles[idx].burstOpacity = 0.6
    }
  }

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

    // Draw main particle
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.globalAlpha = p.opacity
    ctx.fill()
    ctx.globalAlpha = 1

    // Draw burst ring
    if (p.bursting) {
      p.burstRadius += 0.8
      p.burstOpacity -= 0.015
      if (p.burstOpacity <= 0) {
        p.bursting = false
        p.burstRadius = 0
        p.burstOpacity = 0
      } else {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.burstRadius, 0, Math.PI * 2)
        ctx.strokeStyle = p.color
        ctx.lineWidth = 1.5
        ctx.globalAlpha = p.burstOpacity
        ctx.stroke()
        ctx.globalAlpha = 1
      }
    }
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
